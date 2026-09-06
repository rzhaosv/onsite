import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PurchasesPackage } from 'react-native-purchases';
import { colors, radius, type } from '../theme';
import { Button, Eyebrow } from '../components/UI';
import { getPackages, purchase, restore, isCancelledError } from '../services/billing';
import { useApp } from '../store/AppContext';
import { ScreenProps } from '../navigation';
import { demo } from '../dev/demo';
import { loopFor } from '../content/loops';

export const SITE = 'https://tryforma.app/onsite';

const BENEFITS: [string, string][] = [
  ['Unlimited mock rounds', 'Every round type at every lab, with follow-ups that do not let vague answers pass.'],
  ['Real debrief scorecards', 'Strong Hire to No Hire, by dimension, with the gaps named and the next drills chosen.'],
  ['The full drill bank', 'Graded answers with spaced repetition, so the weak rounds come back until they are not weak.'],
  ['Story sharpening', 'Your STAR stories rewritten for a two-minute answer, in your own facts.'],
  ['中文解析', 'Coaching notes in Chinese under every scorecard and grade.'],
];

type Plan = { id: string; title: string; sub: string; price: string; period: 'week' | 'year'; trial: boolean; pkg: PurchasesPackage | null; best?: boolean };

export default function PaywallScreen({ navigation, route }: ScreenProps<'Paywall'>) {
  const { state, setPro } = useApp();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const reason = route.params?.reason;

  useEffect(() => {
    getPackages().then((p) => {
      const weekly = p.find((x) => x.packageType === 'WEEKLY' || x.identifier === '$rc_weekly');
      const annual = p.find((x) => x.packageType === 'ANNUAL' || x.identifier === '$rc_annual');
      const list: Plan[] = [];
      if (weekly) list.push({ id: weekly.identifier, title: 'Weekly', sub: '3-day free trial, then billed weekly', price: weekly.product.priceString, period: 'week', trial: true, pkg: demo ? null : weekly });
      if (annual) list.push({ id: annual.identifier, title: 'Yearly', sub: 'Billed once a year', price: annual.product.priceString, period: 'year', trial: false, pkg: demo ? null : annual, best: true });
      setPlans(list);
      setSelected(list[0]?.id ?? null);
      setLoaded(true);
    });
  }, []);

  const close = () => (navigation.canGoBack() ? navigation.goBack() : navigation.replace('Tabs'));
  const current = plans.find((p) => p.id === selected) ?? null;

  const onSubscribe = async () => {
    if (!current?.pkg) {
      Alert.alert('Not available yet', 'Plans could not be loaded. Check your connection and try again.');
      return;
    }
    setBusy(true);
    try {
      const ok = await purchase(current.pkg);
      if (ok) {
        setPro(true);
        close();
      }
    } catch (e) {
      if (!isCancelledError(e)) Alert.alert('Purchase failed', 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const onRestore = async () => {
    setBusy(true);
    try {
      const ok = await restore();
      if (ok) {
        setPro(true);
        close();
      } else Alert.alert('Nothing to restore', 'No active subscription was found for this Apple ID.');
    } catch {
      Alert.alert('Restore failed', 'Please try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  const labs = state.profile.labs.map((l) => loopFor(l).short).join(' and ');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Eyebrow>Onsite Pro</Eyebrow>
        <Pressable onPress={close} hitSlop={12}>
          <Text style={{ color: colors.muted, fontSize: 16, fontWeight: '600' }}>Close</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={type.display}>
          {reason === 'mock' ? 'One mock is not\nenough reps.' : reason === 'grade' ? 'Keep the grading\nhonest.' : 'Walk in knowing\nwhere you stand.'}
        </Text>
        <Text style={[type.bodySoft, { marginTop: 14 }]}>
          {labs ? `You are preparing for ${labs}. ` : ''}Pro is unlimited rounds, real scorecards, and a drill bank that keeps returning to your weak spots until they are not weak.
        </Text>

        <View style={{ marginTop: 24 }}>
          {BENEFITS.map(([label, sub], i) => (
            <View key={label} style={[styles.benefit, i < BENEFITS.length - 1 && styles.benefitBorder]}>
              <Text style={[type.caption, { color: colors.accent, width: 20 }]}>{String(i + 1).padStart(2, '0')}</Text>
              <View style={{ flex: 1 }}>
                <Text style={type.h3}>{label}</Text>
                <Text style={[type.sub, { marginTop: 3 }]}>{sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ gap: 10, marginTop: 22 }}>
          {!loaded ? (
            <Text style={type.sub}>Loading plans…</Text>
          ) : plans.length === 0 ? (
            <Text style={type.bodySoft}>Plans are not available right now. Your work stays saved; try again later.</Text>
          ) : (
            plans.map((p) => {
              const active = p.id === selected;
              return (
                <Pressable key={p.id} onPress={() => setSelected(p.id)} style={[styles.plan, active && styles.planActive]}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={[type.h3, active && { color: colors.onAccent }]}>{p.title}</Text>
                      {p.best && <Text style={[type.caption, { color: active ? '#5a4a1a' : colors.accent }]}>BEST VALUE</Text>}
                    </View>
                    <Text style={[type.sub, { marginTop: 3 }, active && { color: '#4a3f22' }]}>{p.sub}</Text>
                  </View>
                  <Text style={[type.num, { fontSize: 22 }, active && { color: colors.onAccent }]}>
                    {p.price}
                    <Text style={[type.caption, active && { color: '#4a3f22' }]}>/{p.period}</Text>
                  </Text>
                </Pressable>
              );
            })
          )}
        </View>

        <Button title={current?.trial ? 'Start 3-day free trial' : 'Get Onsite Pro'} onPress={onSubscribe} loading={busy} disabled={!selected} style={{ marginTop: 18 }} />

        <Text style={[type.caption, { textAlign: 'center', marginTop: 12, lineHeight: 17 }]}>
          {current ? (current.trial ? `${current.price} per ${current.period} after a 3-day free trial.` : `${current.price} per ${current.period}.`) : 'Plan price applies after any trial.'} Charged to your Apple ID. Renews automatically unless cancelled at least 24 hours before the period ends. Cancel anytime in Settings.
        </Text>
        <Text style={[type.caption, { textAlign: 'center', marginTop: 10, lineHeight: 17 }]}>
          Onsite is independent and not affiliated with any company named in the app. No offer is guaranteed; preparation is not a promise.
        </Text>

        <View style={styles.links}>
          <Pressable onPress={onRestore}><Text style={[type.label, { color: colors.accent }]}>Restore</Text></Pressable>
          <Pressable onPress={() => Linking.openURL(`${SITE}/terms.html`)}><Text style={[type.label, { color: colors.muted }]}>Terms</Text></Pressable>
          <Pressable onPress={() => Linking.openURL(`${SITE}/privacy.html`)}><Text style={[type.label, { color: colors.muted }]}>Privacy</Text></Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 14 },
  scroll: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 34 },
  benefit: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 13 },
  benefitBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  plan: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1.5, borderColor: colors.lineStrong, borderRadius: radius.md, padding: 16, gap: 10 },
  planActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  links: { flexDirection: 'row', justifyContent: 'center', gap: 26, marginTop: 20 },
});
