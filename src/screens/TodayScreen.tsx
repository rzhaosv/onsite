import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { colors, radius, type } from '../theme';
import { Screen, Card, Button, Eyebrow, Stat, Bar, TextLink, Zh } from '../components/UI';
import { useApp } from '../store/AppContext';
import { TabProps } from '../navigation';
import { RULES } from '../content/rules';
import { LOOPS, ROUND_NAMES, loopFor } from '../content/loops';
import { daysUntil, dueDrills, readiness, streak, weeksLeft } from '../logic';
import { buildPlan, failureText } from '../services/api';

export default function TodayScreen({ navigation }: TabProps<'Today'>) {
  const { state, plan, setPlan, isPro, touch } = useApp();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const p = state.profile;
  const days = daysUntil(p.interviewDate);
  const rule = RULES[Math.floor(Date.now() / 86_400_000) % RULES.length];
  const r = readiness(state);
  const due = dueDrills(state).length;
  const st = streak(state.activeDays);
  const week = plan?.weeks?.[Math.max(0, plan.weeks.length - Math.max(1, weeksLeft(p.interviewDate)))] ?? plan?.weeks?.[0] ?? null;

  useEffect(() => {
    if (plan || busy) return;
    void makePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makePlan = async () => {
    setBusy(true);
    setErr(null);
    const res = await buildPlan(p, weeksLeft(p.interviewDate));
    if (res.ok) {
      setPlan(res.plan);
      touch();
    } else setErr(failureText(res.reason));
    setBusy(false);
  };

  return (
    <Screen scroll>
      <View style={{ paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Eyebrow>{p.name ? `Morning, ${p.name}` : 'Today'}</Eyebrow>
          <Text style={[type.h1, { marginTop: 6 }]}>
            {days === null ? 'No date set yet' : days > 0 ? `${days} days out` : days === 0 ? 'Today is the day' : 'Interview passed'}
          </Text>
          <Text style={type.sub}>{p.labs.map((l) => loopFor(l).short).join(' · ')}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[type.num, { color: colors.accent }]}>{st}</Text>
          <Text style={type.caption}>day streak</Text>
        </View>
      </View>

      <Card style={{ marginTop: 18 }} accent>
        <Eyebrow>Today's line</Eyebrow>
        <Text style={[type.h2, { marginTop: 8 }]}>{rule}</Text>
      </Card>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <Stat label="Readiness" value={`${r.overall}`} sub="of 100" color={r.overall >= 70 ? colors.good : r.overall >= 40 ? colors.accent : colors.warn} />
        <Stat label="Mocks" value={`${state.mocks.length}`} sub="completed" />
        <Stat label="Due drills" value={`${due}`} sub="today" />
      </View>

      <Card style={{ marginTop: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Eyebrow>This week</Eyebrow>
          {plan ? <TextLink title="Full plan ›" onPress={() => navigation.navigate('Plan')} /> : null}
        </View>
        {busy ? (
          <View style={{ paddingVertical: 24, alignItems: 'center', gap: 10 }}>
            <ActivityIndicator color={colors.accent} />
            <Text style={type.sub}>Building your plan…</Text>
          </View>
        ) : err ? (
          <View style={{ gap: 12, marginTop: 10 }}>
            <Text style={type.bodySoft}>{err}</Text>
            <Button title="Try again" onPress={makePlan} ghost />
          </View>
        ) : week ? (
          <>
            <Text style={[type.h3, { marginTop: 10 }]}>{week.title}</Text>
            <Text style={[type.sub, { marginTop: 2 }]}>{week.focus}</Text>
            <View style={{ marginTop: 12, gap: 8 }}>
              {week.tasks.slice(0, 4).map((t, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                  <Text style={[type.caption, { color: colors.accent, width: 16 }]}>{String(i + 1).padStart(2, '0')}</Text>
                  <Text style={[type.bodySoft, { flex: 1 }]}>{t}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Button title="Build my plan" onPress={makePlan} style={{ marginTop: 12 }} />
        )}
      </Card>

      <Card style={{ marginTop: 14 }}>
        <Eyebrow>Mock interview</Eyebrow>
        <Text style={[type.bodySoft, { marginTop: 8 }]}>
          {isPro ? 'A full round with follow-ups, then a scorecard written the way a real debrief is written.' : state.freeMocksUsed < 1 ? 'Your first full mock is free. Pick a lab and a round.' : 'Membership opens unlimited mocks and the full drill bank.'}
        </Text>
        <Button title="Start a mock round" onPress={() => navigation.navigate('MockSetup')} style={{ marginTop: 14 }} />
      </Card>

      {r.rounds.length > 0 && (
        <Card style={{ marginTop: 14 }}>
          <Eyebrow>By round</Eyebrow>
          <View style={{ marginTop: 12, gap: 12 }}>
            {r.rounds.map((rr) => (
              <View key={rr.round}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={type.sub}>{ROUND_NAMES[rr.round]}</Text>
                  <Text style={[type.caption, { color: rr.score >= 70 ? colors.good : rr.score >= 40 ? colors.accent : colors.muted }]}>{rr.score}</Text>
                </View>
                <Bar value={rr.score} color={rr.score >= 70 ? colors.good : rr.score >= 40 ? colors.accent : colors.dim} />
              </View>
            ))}
          </View>
          <Text style={[type.caption, { marginTop: 12 }]}>Readiness comes from your own mock scorecards and drill grades. It is a mirror, not a promise.</Text>
        </Card>
      )}

      {state.mocks[0]?.scorecard && (
        <Card style={{ marginTop: 14 }} onPress={() => navigation.navigate('Scorecard', { id: state.mocks[0].id })}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Eyebrow>Last debrief</Eyebrow>
            <Text style={type.caption}>OPEN ›</Text>
          </View>
          <Text style={[type.h3, { marginTop: 8 }]}>{state.mocks[0].scorecard!.verdict}</Text>
          <Text style={[type.bodySoft, { marginTop: 6 }]} numberOfLines={3}>{state.mocks[0].scorecard!.summary}</Text>
        </Card>
      )}

      <Text style={[type.caption, { marginTop: 22, textAlign: 'center', lineHeight: 17 }]}>
        Onsite is independent and not affiliated with any company named in the app. Loops are compiled from public sources and candidate reports; formats change.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({});
