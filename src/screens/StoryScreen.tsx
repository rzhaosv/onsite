import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, type } from '../theme';
import { Header, Card, Eyebrow, Button, TextLink, Zh } from '../components/UI';
import { ScreenProps } from '../navigation';
import { useApp } from '../store/AppContext';
import { Story } from '../logic/types';
import { uid } from '../logic';
import { failureText, sharpenStory } from '../services/api';

const BLANK: Story = { id: '', title: '', situation: '', task: '', action: '', result: '', tags: [], sharpened: null, updatedAt: '' };

export default function StoryScreen({ navigation, route }: ScreenProps<'Story'>) {
  const { state, upsertStory, removeStory, isPro } = useApp();
  const existing = state.stories.find((s) => s.id === route.params?.id);
  const [s, setS] = useState<Story>(existing ?? { ...BLANK, id: uid() });
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [zh, setZh] = useState('');

  const save = () => {
    upsertStory({ ...s, updatedAt: new Date().toISOString() });
    navigation.goBack();
  };

  const sharpen = async () => {
    if (!isPro && state.stories.filter((x) => x.sharpened).length >= 1) {
      navigation.navigate('Paywall', { reason: 'grade' });
      return;
    }
    setBusy(true);
    const r = await sharpenStory(s, state.profile.labs[0] ?? 'anthropic', state.profile.zh);
    setBusy(false);
    if (!r.ok) {
      Alert.alert('Could not sharpen', failureText(r.reason));
      return;
    }
    const next = { ...s, sharpened: r.sharpened, updatedAt: new Date().toISOString() };
    setS(next);
    setNotes(r.notes);
    setZh(r.zh);
    upsertStory(next);
  };

  const del = () =>
    Alert.alert('Delete this story?', 'It goes for good.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { removeStory(s.id); navigation.goBack(); } },
    ]);

  const field = (label: string, key: keyof Story, placeholder: string, lines = 3) => (
    <View style={{ marginTop: 14 }}>
      <Text style={[type.caption, { color: colors.accent, marginBottom: 6 }]}>{label.toUpperCase()}</Text>
      <TextInput
        value={String(s[key] ?? '')}
        onChangeText={(t) => setS((prev) => ({ ...prev, [key]: t }))}
        placeholder={placeholder}
        placeholderTextColor={colors.dim}
        style={[styles.input, { minHeight: lines * 26 }]}
        multiline
        textAlignVertical="top"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Header title="Story" onBack={() => navigation.goBack()} right={<Text onPress={save} style={{ color: colors.accent, fontWeight: '700' }}>Save</Text>} />
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <TextInput value={s.title} onChangeText={(t) => setS((p) => ({ ...p, title: t }))} placeholder="Title, e.g. The migration nobody wanted" placeholderTextColor={colors.dim} style={[styles.input, { fontSize: 18, fontWeight: '700' }]} />
          {field('Situation', 'situation', 'What was going on? Team, scale, constraint.')}
          {field('Task', 'task', 'What were you responsible for?', 2)}
          {field('Action', 'action', 'What did YOU do? Decisions, trade-offs, specifics.', 5)}
          {field('Result', 'result', 'What changed? Numbers if you have them.', 2)}

          <Button title={s.sharpened ? 'Sharpen again' : 'Sharpen for interview'} onPress={sharpen} loading={busy} disabled={!s.situation.trim() || !s.action.trim()} style={{ marginTop: 18 }} />

          {s.sharpened ? (
            <Card style={{ marginTop: 16 }} accent>
              <Eyebrow>Interview version</Eyebrow>
              <Text style={[type.body, { marginTop: 10 }]}>{s.sharpened}</Text>
              {notes.length > 0 && (
                <View style={{ marginTop: 12, gap: 6 }}>
                  <Text style={[type.caption, { color: colors.accent }]}>TIGHTEN</Text>
                  {notes.map((n, i) => (
                    <Text key={i} style={type.bodySoft}>· {n}</Text>
                  ))}
                </View>
              )}
              {zh ? <Zh>{zh}</Zh> : null}
            </Card>
          ) : null}

          {existing && (
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <TextLink title="Delete story" onPress={del} dim />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  input: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 14, color: colors.ink, fontSize: 15, lineHeight: 22 },
});
