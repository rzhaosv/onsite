import React from 'react';
import { View, Text } from 'react-native';
import { colors, type } from '../theme';
import { Screen, Header, Card, Eyebrow } from '../components/UI';
import { LOOPS, ROUND_NAMES } from '../content/loops';
import { useApp } from '../store/AppContext';
import { TabProps } from '../navigation';

export default function LoopsScreen({ navigation }: TabProps<'Loops'>) {
  const { state } = useApp();
  const mine = new Set(state.profile.labs);
  const ordered = [...LOOPS].sort((a, b) => Number(mine.has(b.id)) - Number(mine.has(a.id)));

  return (
    <Screen scroll>
      <Header title="Loops" />
      <Text style={[type.sub, { marginBottom: 14 }]}>Round-by-round, what each lab actually tests. Compiled from public guides and candidate reports.</Text>
      <View style={{ gap: 12 }}>
        {ordered.map((l) => (
          <Card key={l.id} onPress={() => navigation.navigate('Loop', { lab: l.id })}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Eyebrow color={mine.has(l.id) ? colors.accent : colors.muted}>{mine.has(l.id) ? 'Your target' : 'Reference'}</Eyebrow>
              <Text style={type.caption}>{l.stages.length} rounds ›</Text>
            </View>
            <Text style={[type.h2, { marginTop: 8 }]}>{l.name}</Text>
            <Text style={[type.bodySoft, { marginTop: 6 }]}>{l.tagline}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {l.stages.map((s, i) => (
                <View key={i} style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 }}>
                  <Text style={type.caption}>{ROUND_NAMES[s.round]}</Text>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
