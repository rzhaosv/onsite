import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { colors, type } from '../theme';
import { Screen, Header, Card, Eyebrow, Button, Zh } from '../components/UI';
import { useApp } from '../store/AppContext';
import { ScreenProps } from '../navigation';
import { buildPlan, failureText } from '../services/api';
import { weeksLeft } from '../logic';

export default function PlanScreen({ navigation }: ScreenProps<'Plan'>) {
  const { state, plan, setPlan } = useApp();
  const [busy, setBusy] = useState(false);

  const rebuild = async () => {
    setBusy(true);
    const r = await buildPlan(state.profile, weeksLeft(state.profile.interviewDate));
    if (r.ok) setPlan(r.plan);
    setBusy(false);
  };

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <Header title="Your plan" onBack={() => navigation.goBack()} />
      {plan?.note ? (
        <Card accent>
          <Eyebrow>The honest read</Eyebrow>
          <Text style={[type.body, { marginTop: 8 }]}>{plan.note}</Text>
          {plan.zh ? <Zh>{plan.zh}</Zh> : null}
        </Card>
      ) : null}
      <View style={{ gap: 12, marginTop: 14 }}>
        {(plan?.weeks ?? []).map((w, i) => (
          <Card key={i}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Eyebrow>Week {i + 1}</Eyebrow>
            </View>
            <Text style={[type.h3, { marginTop: 6 }]}>{w.title}</Text>
            <Text style={[type.sub, { marginTop: 2 }]}>{w.focus}</Text>
            <View style={{ marginTop: 12, gap: 8 }}>
              {w.tasks.map((t, j) => (
                <View key={j} style={{ flexDirection: 'row', gap: 10 }}>
                  <Text style={[type.caption, { color: colors.accent, width: 16 }]}>{String(j + 1).padStart(2, '0')}</Text>
                  <Text style={[type.bodySoft, { flex: 1 }]}>{t}</Text>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </View>
      <Button title="Rebuild the plan" onPress={rebuild} loading={busy} ghost style={{ marginTop: 18 }} />
    </Screen>
  );
}
