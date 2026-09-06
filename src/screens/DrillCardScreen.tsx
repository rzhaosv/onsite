import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, type } from '../theme';
import { Header, Card, Eyebrow, Button, Bar, Zh, TextLink } from '../components/UI';
import { ScreenProps } from '../navigation';
import { useApp } from '../store/AppContext';
import { DRILLS } from '../content/drills';
import { ROUND_NAMES, loopFor } from '../content/loops';
import { NEW_DRILL, dueDrills, schedule } from '../logic';
import { failureText, gradeDrill } from '../services/api';
import { FREE_GRADES } from '../logic/types';

export default function DrillCardScreen({ navigation, route }: ScreenProps<'DrillCard'>) {
  const { state, isPro, setDrill } = useApp();
  const card = DRILLS.find((d) => d.id === route.params.id);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ grade: number; feedback: string; missing: string[]; zh: string } | null>(null);
  const [showKeys, setShowKeys] = useState(false);

  if (!card) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Drill" onBack={() => navigation.goBack()} />
        <Text style={[type.bodySoft, { padding: 20 }]}>Card not found.</Text>
      </SafeAreaView>
    );
  }

  const canGrade = isPro || state.freeGradesUsed < FREE_GRADES;

  const submit = async () => {
    if (!answer.trim()) return;
    if (!canGrade) {
      navigation.navigate('Paywall', { reason: 'grade' });
      return;
    }
    setBusy(true);
    const r = await gradeDrill(card, answer.trim(), state.profile.zh);
    setBusy(false);
    if (!r.ok) {
      Alert.alert('Could not grade', failureText(r.reason));
      return;
    }
    setResult({ grade: r.grade, feedback: r.feedback, missing: r.missing, zh: r.zh });
    setShowKeys(true);
    setDrill(card.id, schedule(state.drills[card.id] ?? NEW_DRILL, r.grade, r.feedback), !isPro);
  };

  const next = () => {
    const remaining = dueDrills(state).filter((d) => d.id !== card.id);
    if (remaining.length) navigation.replace('DrillCard', { id: remaining[0].id });
    else navigation.navigate('Tabs');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Header title={ROUND_NAMES[card.round]} onBack={() => navigation.goBack()} sub={card.lab === 'all' ? 'Any lab' : loopFor(card.lab).short} />
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Card accent>
            <Eyebrow>Question</Eyebrow>
            <Text style={[type.h2, { marginTop: 10 }]}>{card.prompt}</Text>
            {!result && <Text style={[type.caption, { marginTop: 12 }]}>Hint: {card.hint}</Text>}
          </Card>

          {!result && (
            <>
              <TextInput value={answer} onChangeText={setAnswer} placeholder="Answer out loud, then type the short version…" placeholderTextColor={colors.dim} style={styles.input} multiline textAlignVertical="top" autoFocus />
              <Button title={canGrade ? 'Grade my answer' : 'Unlock unlimited grading'} onPress={submit} loading={busy} disabled={!answer.trim()} style={{ marginTop: 14 }} />
              {!isPro && <Text style={[type.caption, { textAlign: 'center', marginTop: 8 }]}>{Math.max(0, FREE_GRADES - state.freeGradesUsed)} free grades left</Text>}
            </>
          )}

          {result && (
            <>
              <Card style={{ marginTop: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Eyebrow>Grade</Eyebrow>
                  <Text style={[type.num, { color: result.grade >= 4 ? colors.good : result.grade >= 3 ? colors.accent : colors.warn }]}>{result.grade}/5</Text>
                </View>
                <Bar value={(result.grade / 5) * 100} color={result.grade >= 4 ? colors.good : result.grade >= 3 ? colors.accent : colors.warn} />
                <Text style={[type.body, { marginTop: 12 }]}>{result.feedback}</Text>
                {result.missing.length > 0 && (
                  <View style={{ marginTop: 12, gap: 6 }}>
                    <Text style={[type.caption, { color: colors.warn }]}>MISSED</Text>
                    {result.missing.map((m, i) => (
                      <Text key={i} style={type.bodySoft}>· {m}</Text>
                    ))}
                  </View>
                )}
                {result.zh ? <Zh>{result.zh}</Zh> : null}
              </Card>
              <Card style={{ marginTop: 12 }}>
                <Eyebrow>A strong answer covers</Eyebrow>
                <View style={{ marginTop: 10, gap: 8 }}>
                  {card.keys.map((k, i) => (
                    <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accent, marginTop: 8 }} />
                      <Text style={[type.bodySoft, { flex: 1 }]}>{k}</Text>
                    </View>
                  ))}
                </View>
              </Card>
              <Card style={{ marginTop: 12 }}>
                <Eyebrow>Your answer</Eyebrow>
                <Text style={[type.bodySoft, { marginTop: 8 }]}>{answer}</Text>
              </Card>
              <Button title="Next card" onPress={next} style={{ marginTop: 16 }} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  input: { marginTop: 14, minHeight: 160, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 14, color: colors.ink, fontSize: 15, lineHeight: 22 },
});
