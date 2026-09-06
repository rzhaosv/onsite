import React from 'react';
import { View, Text } from 'react-native';
import { colors, radius, type } from '../theme';
import { Screen, Header, Card, Eyebrow, Button, Bar, Zh, TextLink } from '../components/UI';
import { ScreenProps } from '../navigation';
import { useApp } from '../store/AppContext';
import { ROUND_NAMES, loopFor } from '../content/loops';
import { verdictColor } from '../logic';

const SCORE_WORD = ['', 'No Hire', 'Lean No Hire', 'Hire', 'Strong Hire'];

export default function ScorecardScreen({ navigation, route }: ScreenProps<'Scorecard'>) {
  const { state } = useApp();
  const mock = state.mocks.find((m) => m.id === route.params.id);
  const s = mock?.scorecard;

  if (!mock || !s) {
    return (
      <Screen>
        <Header title="Scorecard" onBack={() => navigation.goBack()} />
        <Text style={[type.bodySoft, { marginTop: 30 }]}>No scorecard for this round.</Text>
      </Screen>
    );
  }

  const c = verdictColor(s.verdict);
  const tone = c === 'good' ? colors.good : c === 'warn' ? colors.accent : colors.danger;

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <Header title="Debrief" onBack={() => navigation.navigate('Tabs')} sub={`${loopFor(mock.lab).short} · ${ROUND_NAMES[mock.round]}`} />

      <Card accent style={{ alignItems: 'center', paddingVertical: 26 }}>
        <Eyebrow>Interviewer's verdict</Eyebrow>
        <Text style={[type.big, { color: tone, marginTop: 10, fontSize: 40, lineHeight: 44 }]}>{s.verdict}</Text>
        <Text style={[type.caption, { marginTop: 6 }]}>{s.overall} of 4 on the standard debrief scale</Text>
      </Card>

      <Card style={{ marginTop: 14 }}>
        <Eyebrow>Summary</Eyebrow>
        <Text style={[type.body, { marginTop: 8 }]}>{s.summary}</Text>
        {s.zh ? <Zh>{s.zh}</Zh> : null}
      </Card>

      {s.dimensions.length > 0 && (
        <Card style={{ marginTop: 14 }}>
          <Eyebrow>By dimension</Eyebrow>
          <View style={{ marginTop: 14, gap: 14 }}>
            {s.dimensions.map((d, i) => (
              <View key={i}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={type.h3}>{d.label}</Text>
                  <Text style={[type.caption, { color: d.score >= 3 ? colors.good : d.score >= 2 ? colors.accent : colors.danger }]}>{SCORE_WORD[d.score] ?? d.score}</Text>
                </View>
                <Bar value={(d.score / 4) * 100} color={d.score >= 3 ? colors.good : d.score >= 2 ? colors.accent : colors.danger} />
                <Text style={[type.sub, { marginTop: 6 }]}>{d.note}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
        <Card style={{ flex: 1 }}>
          <Eyebrow color={colors.good}>Strengths</Eyebrow>
          <View style={{ marginTop: 10, gap: 8 }}>
            {s.strengths.map((x, i) => (
              <Text key={i} style={type.bodySoft}>{x}</Text>
            ))}
          </View>
        </Card>
        <Card style={{ flex: 1 }}>
          <Eyebrow color={colors.warn}>Gaps</Eyebrow>
          <View style={{ marginTop: 10, gap: 8 }}>
            {s.gaps.map((x, i) => (
              <Text key={i} style={type.bodySoft}>{x}</Text>
            ))}
          </View>
        </Card>
      </View>

      {s.nextDrills.length > 0 && (
        <Card style={{ marginTop: 14 }}>
          <Eyebrow>Do this next</Eyebrow>
          <View style={{ marginTop: 10, gap: 10 }}>
            {s.nextDrills.map((d, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={[type.caption, { color: colors.accent, width: 16 }]}>{String(i + 1).padStart(2, '0')}</Text>
                <Text style={[type.bodySoft, { flex: 1 }]}>{d}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      <Button title="Run another round" onPress={() => navigation.replace('MockSetup', { lab: mock.lab })} style={{ marginTop: 18 }} />
      <View style={{ alignItems: 'center' }}>
        <TextLink title="Back to today" onPress={() => navigation.navigate('Tabs')} dim />
      </View>
      <Text style={[type.caption, { textAlign: 'center', marginTop: 8, lineHeight: 17 }]}>
        A simulated debrief from a model, calibrated to public descriptions of this loop. It is practice, not a prediction.
      </Text>
    </Screen>
  );
}
