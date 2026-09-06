import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, type } from '../theme';
import { Eyebrow, Button } from '../components/UI';
import { ScreenProps } from '../navigation';
import { useApp } from '../store/AppContext';
import { ROUND_NAMES, loopFor } from '../content/loops';
import { failureText, mockFinish, mockTurn } from '../services/api';
import { Message } from '../logic/types';

export default function MockScreen({ navigation, route }: ScreenProps<'Mock'>) {
  const { state, updateMock } = useApp();
  const mock = state.mocks.find((m) => m.id === route.params.id);
  const [messages, setMessages] = useState<Message[]>(mock?.messages ?? []);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [ending, setEnding] = useState(false);
  const startedAt = useRef(Date.now());
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!mock || messages.length) return;
    void open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mock) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={[type.bodySoft, { padding: 24 }]}>This round is gone.</Text>
      </SafeAreaView>
    );
  }

  const push = (m: Message[]) => {
    setMessages(m);
    updateMock(mock.id, { messages: m });
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
  };

  const open = async () => {
    setBusy(true);
    const r = await mockTurn({ lab: mock.lab, round: mock.round, role: state.profile.role, messages: [], zh: state.profile.zh });
    const text = r.ok ? r.reply : mock.question;
    push([{ role: 'interviewer', text, at: new Date().toISOString() }]);
    setBusy(false);
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || busy) return;
    const next: Message[] = [...messages, { role: 'candidate' as const, text, at: new Date().toISOString() }];
    push(next);
    setDraft('');
    setBusy(true);
    const r = await mockTurn({ lab: mock.lab, round: mock.round, role: state.profile.role, question: mock.question, messages: next, zh: state.profile.zh });
    if (r.ok) push([...next, { role: 'interviewer', text: r.reply, at: new Date().toISOString() }]);
    else Alert.alert('Interviewer paused', failureText(r.reason));
    setBusy(false);
  };

  const end = async () => {
    if (messages.filter((m) => m.role === 'candidate').length === 0) {
      Alert.alert('Nothing to score', 'Answer at least one question first.');
      return;
    }
    setEnding(true);
    const r = await mockFinish({ lab: mock.lab, round: mock.round, role: state.profile.role, question: mock.question, messages, zh: state.profile.zh });
    setEnding(false);
    if (!r.ok) {
      Alert.alert('Could not write the debrief', failureText(r.reason));
      return;
    }
    updateMock(mock.id, { scorecard: r.scorecard, durationSec: Math.round((Date.now() - startedAt.current) / 1000) });
    navigation.replace('Scorecard', { id: mock.id });
  };

  const turns = messages.filter((m) => m.role === 'candidate').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={{ color: colors.accent, fontSize: 16, fontWeight: '600' }}>Leave</Text>
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={type.h3}>{loopFor(mock.lab).short} · {ROUND_NAMES[mock.round]}</Text>
          <Text style={type.caption}>{turns} answer{turns === 1 ? '' : 's'}</Text>
        </View>
        <Pressable onPress={end} hitSlop={12} disabled={ending}>
          <Text style={{ color: ending ? colors.muted : colors.accent, fontSize: 16, fontWeight: '700' }}>{ending ? '…' : 'End'}</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={8}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {messages.map((m, i) => (
            <View key={i} style={[styles.bubble, m.role === 'candidate' ? styles.mine : styles.theirs]}>
              {m.role === 'interviewer' && <Eyebrow style={{ marginBottom: 6 }}>Interviewer</Eyebrow>}
              <Text style={[type.body, m.role === 'candidate' && { color: colors.onAccent }]}>{m.text}</Text>
            </View>
          ))}
          {busy && (
            <View style={[styles.bubble, styles.theirs, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
              <ActivityIndicator color={colors.accent} size="small" />
              <Text style={type.sub}>thinking…</Text>
            </View>
          )}
          {ending && (
            <View style={{ alignItems: 'center', paddingVertical: 20, gap: 10 }}>
              <ActivityIndicator color={colors.accent} />
              <Text style={type.sub}>Writing the debrief…</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type your answer…"
            placeholderTextColor={colors.dim}
            style={styles.input}
            multiline
            editable={!busy && !ending}
          />
          <Button title="Send" onPress={send} disabled={!draft.trim() || busy || ending} style={{ height: 44, paddingHorizontal: 18 }} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  scroll: { padding: 18, gap: 12, paddingBottom: 24 },
  bubble: { padding: 14, borderRadius: radius.lg, maxWidth: '92%' },
  theirs: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignSelf: 'flex-start' },
  mine: { backgroundColor: colors.accent, alignSelf: 'flex-end' },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  input: { flex: 1, maxHeight: 140, minHeight: 44, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12, color: colors.ink, fontSize: 15, lineHeight: 21 },
});
