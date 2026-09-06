import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, DEFAULT_STATE, DrillState, FREE_GRADES, FREE_MOCKS, Mock, Profile, Story } from '../logic/types';
import { dateKey } from '../logic';
import { Plan } from '../services/api';
import { configureBilling, getCustomerInfo, isPremium, addPremiumListener } from '../services/billing';
import { demo } from '../dev/demo';

export const STORAGE_KEY = 'onsite.state.v1';
export const PLAN_KEY = 'onsite.plan.v1';
const DEV_UNLOCK = process.env.EXPO_PUBLIC_DEV_UNLOCK === '1' || process.env.EXPO_PUBLIC_DEV_UNLOCK === 'true';
const FORCE_PRO = DEV_UNLOCK || !!demo?.pro;

type Ctx = {
  ready: boolean;
  state: AppState;
  plan: Plan | null;
  isPro: boolean;
  freeMocksLeft: number;
  freeGradesLeft: number;
  setPro: (v: boolean) => void;
  update: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
  completeOnboarding: (profile: Profile) => void;
  setProfile: (patch: Partial<Profile>) => void;
  setPlan: (plan: Plan | null) => void;
  addMock: (mock: Mock) => void;
  updateMock: (id: string, patch: Partial<Mock>) => void;
  setDrill: (id: string, s: DrillState, usedFree: boolean) => void;
  upsertStory: (story: Story) => void;
  removeStory: (id: string) => void;
  touch: () => void;
  resetAll: () => Promise<void>;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [plan, setPlanState] = useState<Plan | null>(null);
  const [isPro, setIsPro] = useState(FORCE_PRO);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setState({ ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<AppState>) });
        const p = await AsyncStorage.getItem(PLAN_KEY);
        if (p) setPlanState(JSON.parse(p));
      } catch {
        /* fresh */
      }
      configureBilling();
      const info = await getCustomerInfo();
      if (isPremium(info)) setIsPro(true);
      unsub = addPremiumListener((pro) => setIsPro(pro || FORCE_PRO));
      setReady(true);
    })();
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const update = useCallback<Ctx['update']>((patch) => {
    setState((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  const touchDays = (prev: AppState): string[] => {
    const k = dateKey();
    return prev.activeDays.includes(k) ? prev.activeDays : [...prev.activeDays, k].slice(-400);
  };

  const completeOnboarding = useCallback((profile: Profile) => {
    setState((prev) => ({ ...prev, profile, onboarded: true, createdAt: prev.createdAt ?? new Date().toISOString(), activeDays: touchDays(prev) }));
  }, []);

  const setProfile = useCallback((patch: Partial<Profile>) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  }, []);

  const setPlan = useCallback((p: Plan | null) => {
    setPlanState(p);
    if (p) AsyncStorage.setItem(PLAN_KEY, JSON.stringify(p)).catch(() => {});
    else AsyncStorage.removeItem(PLAN_KEY).catch(() => {});
  }, []);

  const addMock = useCallback((mock: Mock) => {
    setState((prev) => ({ ...prev, mocks: [mock, ...prev.mocks].slice(0, 100), freeMocksUsed: prev.freeMocksUsed + 1, activeDays: touchDays(prev) }));
  }, []);

  const updateMock = useCallback((id: string, patch: Partial<Mock>) => {
    setState((prev) => ({ ...prev, mocks: prev.mocks.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
  }, []);

  const setDrill = useCallback((id: string, s: DrillState, usedFree: boolean) => {
    setState((prev) => ({ ...prev, drills: { ...prev.drills, [id]: s }, freeGradesUsed: prev.freeGradesUsed + (usedFree ? 1 : 0), activeDays: touchDays(prev) }));
  }, []);

  const upsertStory = useCallback((story: Story) => {
    setState((prev) => {
      const exists = prev.stories.some((s) => s.id === story.id);
      return { ...prev, stories: exists ? prev.stories.map((s) => (s.id === story.id ? story : s)) : [story, ...prev.stories], activeDays: touchDays(prev) };
    });
  }, []);

  const removeStory = useCallback((id: string) => {
    setState((prev) => ({ ...prev, stories: prev.stories.filter((s) => s.id !== id) }));
  }, []);

  const touch = useCallback(() => setState((prev) => ({ ...prev, activeDays: touchDays(prev) })), []);

  const resetAll = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEY, PLAN_KEY]).catch(() => {});
    setState(DEFAULT_STATE);
    setPlanState(null);
  }, []);

  return (
    <AppCtx.Provider
      value={{
        ready,
        state,
        plan,
        isPro,
        freeMocksLeft: Math.max(0, FREE_MOCKS - state.freeMocksUsed),
        freeGradesLeft: Math.max(0, FREE_GRADES - state.freeGradesUsed),
        setPro: (v) => setIsPro(v || FORCE_PRO),
        update,
        completeOnboarding,
        setProfile,
        setPlan,
        addMock,
        updateMock,
        setDrill,
        upsertStory,
        removeStory,
        touch,
        resetAll,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp outside AppProvider');
  return ctx;
}
