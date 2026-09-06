import React from 'react';
import { View, Text } from 'react-native';
import { colors, type } from '../theme';
import { Screen, Header, Card, Eyebrow, Button } from '../components/UI';
import { useApp } from '../store/AppContext';
import { TabProps } from '../navigation';

export default function StoriesScreen({ navigation }: TabProps<'Stories'>) {
  const { state } = useApp();
  return (
    <Screen scroll>
      <Header title="Stories" right={<Text onPress={() => navigation.navigate('Story', {})} style={{ color: colors.accent, fontSize: 24, fontWeight: '600' }}>+</Text>} />
      <Text style={[type.sub, { marginBottom: 14 }]}>Your STAR bank. Six good stories cover almost every behavioral round. The coach sharpens them without inventing anything.</Text>
      {state.stories.length === 0 ? (
        <Card accent>
          <Eyebrow>Start here</Eyebrow>
          <Text style={[type.body, { marginTop: 8 }]}>
            Write the hardest technical problem you solved in the last two years. Situation, task, action, result. Rough is fine; the coach tightens it.
          </Text>
          <Button title="Write my first story" onPress={() => navigation.navigate('Story', {})} style={{ marginTop: 14 }} />
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          {state.stories.map((s) => (
            <Card key={s.id} onPress={() => navigation.navigate('Story', { id: s.id })}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Eyebrow color={s.sharpened ? colors.good : colors.muted}>{s.sharpened ? 'Sharpened' : 'Draft'}</Eyebrow>
                <Text style={type.caption}>EDIT ›</Text>
              </View>
              <Text style={[type.h3, { marginTop: 8 }]}>{s.title || 'Untitled story'}</Text>
              <Text style={[type.bodySoft, { marginTop: 6 }]} numberOfLines={2}>{s.sharpened || s.situation}</Text>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}
