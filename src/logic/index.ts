import { AppState, DrillCard, DrillState, LabId, Mock, RoundType, Scorecard } from './types';
import { DRILLS } from '../content/drills';

export const DAY_MS = 86_400_000;

export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / DAY_MS);
}

export function weeksLeft(iso: string | null): number {
  const d = daysUntil(iso);
  if (d === null) return 6;
  return Math.max(1, Math.min(12, Math.ceil(d / 7)));
}

export function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Consecutive active days ending today or yesterday. */
export function streak(activeDays: string[]): number {
  const set = new Set(activeDays);
  let n = 0;
  const d = new Date();
  if (!set.has(dateKey(d))) d.setDate(d.getDate() - 1);
  while (set.has(dateKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

// ---- drills / spaced repetition (SM-2 flavoured, grades 0-5) ----------------

export const NEW_DRILL: DrillState = { due: new Date(0).toISOString(), interval: 0, ease: 2.5, reps: 0, lastGrade: null, lastNote: '' };

export function schedule(prev: DrillState, grade: number, note: string): DrillState {
  let { interval, ease, reps } = prev;
  if (grade < 3) {
    reps = 0;
    interval = 1;
  } else {
    reps += 1;
    interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(interval * ease);
  }
  ease = Math.max(1.3, ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  const due = new Date();
  due.setDate(due.getDate() + interval);
  due.setHours(6, 0, 0, 0);
  return { due: due.toISOString(), interval, ease, reps, lastGrade: grade, lastNote: note };
}

export function drillsFor(labs: LabId[], role?: string): DrillCard[] {
  const set = new Set<string>(labs);
  return DRILLS.filter((d) => d.lab === 'all' || set.has(d.lab));
}

export function dueDrills(state: AppState): DrillCard[] {
  const now = Date.now();
  return drillsFor(state.profile.labs).filter((d) => {
    const s = state.drills[d.id];
    return !s || new Date(s.due).getTime() <= now;
  });
}

export function drillProgress(state: AppState): { seen: number; total: number; strong: number } {
  const cards = drillsFor(state.profile.labs);
  let seen = 0;
  let strong = 0;
  for (const c of cards) {
    const s = state.drills[c.id];
    if (s && s.reps + (s.lastGrade !== null ? 1 : 0) > 0) seen++;
    if (s && (s.lastGrade ?? 0) >= 4) strong++;
  }
  return { seen, total: cards.length, strong };
}

// ---- readiness ----------------------------------------------------------------

export type RoundReadiness = { round: RoundType; score: number; mocks: number; drills: number };

/** 0-100 per round from mock scorecards (weighted most) and drill grades. */
export function readiness(state: AppState): { overall: number; rounds: RoundReadiness[] } {
  const rounds: RoundType[] = ['coding', 'mlcoding', 'design', 'debugging', 'behavioral', 'values', 'research', 'quiz'];
  const cards = drillsFor(state.profile.labs);
  const out: RoundReadiness[] = [];
  for (const r of rounds) {
    const mocks = state.mocks.filter((m) => m.round === r && m.scorecard);
    const mockAvg = mocks.length ? mocks.slice(0, 3).reduce((a, m) => a + (m.scorecard as Scorecard).overall, 0) / Math.min(3, mocks.length) : null; // 1-4
    const rDrills = cards.filter((c) => c.round === r);
    const graded = rDrills.map((c) => state.drills[c.id]).filter((s) => s && s.lastGrade !== null) as DrillState[];
    const drillAvg = graded.length ? graded.reduce((a, s) => a + (s.lastGrade ?? 0), 0) / graded.length : null; // 0-5
    if (rDrills.length === 0 && mocks.length === 0) continue;
    let score = 0;
    if (mockAvg !== null && drillAvg !== null) score = ((mockAvg - 1) / 3) * 70 + (drillAvg / 5) * 30;
    else if (mockAvg !== null) score = ((mockAvg - 1) / 3) * 85;
    else if (drillAvg !== null) score = (drillAvg / 5) * 55 * Math.min(1, graded.length / Math.max(1, rDrills.length) + 0.4);
    out.push({ round: r, score: Math.round(score), mocks: mocks.length, drills: graded.length });
  }
  const overall = out.length ? Math.round(out.reduce((a, r) => a + r.score, 0) / out.length) : 0;
  return { overall, rounds: out };
}

export function verdictColor(v: Scorecard['verdict']): 'good' | 'warn' | 'danger' {
  if (v === 'Strong Hire' || v === 'Hire') return 'good';
  if (v === 'Lean No Hire') return 'warn';
  return 'danger';
}

export function mockDuration(m: Mock): string {
  const s = m.durationSec;
  return `${Math.floor(s / 60)}m`;
}

/** Opening question when the server is unreachable. */
export function fallbackOpening(round: RoundType): string {
  const map: Record<RoundType, string> = {
    coding: 'Let us start with a spec. Build a small in-memory key-value store with get, set and delete. Talk me through your first version before you write it.',
    mlcoding: 'Implement scaled dot-product attention for a single head, from scratch. Start by telling me the shapes of every tensor.',
    design: 'Design a system that serves a large language model to millions of users with streaming responses. Where is the bottleneck?',
    debugging: 'A training run: loss is flat from step zero, the code runs without errors. What are your first three hypotheses?',
    behavioral: 'Tell me about the hardest technical problem you have solved in the last two years.',
    values: 'A feature would clearly help users but modestly raises misuse risk. How would you decide whether to ship it?',
    research: 'Walk me through your strongest project in about two minutes, then tell me the two ways it fails.',
    quiz: 'Quick one: what does the SVD of a weight matrix tell you, and how does that relate to compression?',
  };
  return map[round];
}
