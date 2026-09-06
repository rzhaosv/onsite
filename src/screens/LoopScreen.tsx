import React from 'react';
import { View, Text } from 'react-native';
import { colors, type } from '../theme';
import { Screen, Header, Card, Eyebrow, Button, Zh } from '../components/UI';
import { loopFor, ROUND_NAMES } from '../content/loops';
import { ScreenProps } from '../navigation';
import { useApp } from '../store/AppContext';

export default function LoopScreen({ navigation, route }: ScreenProps<'Loop'>) {
  const l = loopFor(route.params.lab);
  const { state } = useApp();

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <Header title={l.short} onBack={() => navigation.goBack()} />
      <Text style={type.h1}>{l.name}</Text>
      <Text style={[type.bodySoft, { marginTop: 8 }]}>{l.tagline}</Text>

      <Card style={{ marginTop: 16 }}>
        <Eyebrow>Timeline</Eyebrow>
        <Text style={[type.body, { marginTop: 6 }]}>{l.weeks}</Text>
        <Text style={[type.sub, { marginTop: 10 }]}>{l.bar}</Text>
      </Card>

      <Card style={{ marginTop: 12 }} accent>
        <Eyebrow>What they are really testing</Eyebrow>
        <Text style={[type.body, { marginTop: 8 }]}>{l.culture}</Text>
      </Card>

      <Text style={[type.h2, { marginTop: 24, marginBottom: 12 }]}>The rounds</Text>
      <View style={{ gap: 12 }}>
        {l.stages.map((s, i) => (
          <Card key={i}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Eyebrow>{String(i + 1).padStart(2, '0')} · {ROUND_NAMES[s.round]}</Eyebrow>
            </View>
            <Text style={[type.h3, { marginTop: 8 }]}>{s.title}</Text>
            <Text style={[type.sub, { marginTop: 6 }]}>{s.format}</Text>
            <Text style={[type.bodySoft, { marginTop: 10 }]}>{s.tests}</Text>
            <View style={{ marginTop: 12, gap: 6 }}>
              {s.themes.map((t, j) => (
                <View key={j} style={{ flexDirection: 'row', gap: 8 }}>
                  <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accent, marginTop: 8 }} />
                  <Text style={[type.bodySoft, { flex: 1 }]}>{t}</Text>
                </View>
              ))}
            </View>
            <View style={{ marginTop: 12, padding: 12, borderRadius: 10, backgroundColor: colors.surface2 }}>
              <Text style={[type.caption, { color: colors.accent, marginBottom: 4 }]}>HOW TO PREPARE</Text>
              <Text style={type.bodySoft}>{s.tip}</Text>
            </View>
            {state.profile.zh ? <Zh>{s.zh}</Zh> : null}
            <Button title={`Mock this round`} onPress={() => navigation.navigate('MockSetup', { lab: l.id, round: s.round })} ghost style={{ marginTop: 14 }} />
          </Card>
        ))}
      </View>

      <Card style={{ marginTop: 20 }}>
        <Eyebrow>Read before you go</Eyebrow>
        <View style={{ marginTop: 10, gap: 10 }}>
          {l.reading.map((r, i) => (
            <View key={i}>
              <Text style={type.h3}>{r.title}</Text>
              <Text style={type.sub}>{r.why}</Text>
            </View>
          ))}
        </View>
      </Card>
      <Text style={[type.caption, { marginTop: 16, lineHeight: 17 }]}>{l.sources.join(' ')} Onsite is not affiliated with {l.name}.</Text>
    </Screen>
  );
}
