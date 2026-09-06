import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { colors, type } from '../theme';
import { Screen, Header, Card, Eyebrow, Stat, Button } from '../components/UI';
import { useApp } from '../store/AppContext';
import { TabProps } from '../navigation';
import { drillProgress, drillsFor, dueDrills } from '../logic';
import { ROUND_NAMES, loopFor } from '../content/loops';

export default function DrillScreen({ navigation }: TabProps<'Drill'>) {
  const { state } = useApp();
  const due = useMemo(() => dueDrills(state), [state]);
  const all = useMemo(() => drillsFor(state.profile.labs), [state.profile.labs]);
  const p = drillProgress(state);

  return (
    <Screen scroll>
      <Header title="Drills" />
      <Text style={[type.sub, { marginBottom: 14 }]}>Short answers, graded against what a strong answer covers. Cards you miss come back sooner.</Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Due now" value={`${due.length}`} color={due.length ? colors.accent : colors.muted} />
        <Stat label="Practised" value={`${p.seen}/${p.total}`} />
        <Stat label="Strong" value={`${p.strong}`} color={colors.good} />
      </View>

      {due.length > 0 && (
        <Button title={`Start ${Math.min(5, due.length)} due card${due.length === 1 ? '' : 's'}`} onPress={() => navigation.navigate('DrillCard', { id: due[0].id })} style={{ marginTop: 16 }} />
      )}

      <Text style={[type.h2, { marginTop: 24, marginBottom: 12 }]}>All cards</Text>
      <View style={{ gap: 10 }}>
        {all.map((d) => {
          const s = state.drills[d.id];
          const graded = s && s.lastGrade !== null;
          return (
            <Card key={d.id} onPress={() => navigation.navigate('DrillCard', { id: d.id })}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Eyebrow color={graded ? ((s!.lastGrade ?? 0) >= 4 ? colors.good : colors.accent) : colors.muted}>
                  {d.lab === 'all' ? 'Any lab' : loopFor(d.lab).short} · {ROUND_NAMES[d.round]}
                </Eyebrow>
                {graded ? <Text style={[type.caption, { color: (s!.lastGrade ?? 0) >= 4 ? colors.good : colors.accent }]}>{s!.lastGrade}/5</Text> : <Text style={type.caption}>new</Text>}
              </View>
              <Text style={[type.body, { marginTop: 8 }]} numberOfLines={3}>{d.prompt}</Text>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
