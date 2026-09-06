import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, type } from '../theme';
import { Button, Chip, Steps, TextLink, Eyebrow } from '../components/UI';
import { LABS, ROLES } from '../content/loops';
import { LabId, Profile, RoleId, DEFAULT_PROFILE } from '../logic/types';

const STEPS = 5;
const YEARS: Profile['years'][] = ['0-1', '2-4', '5-8', '9+'];
const YEAR_LABEL: Record<Profile['years'], string> = { '0-1': 'New grad / 0-1 yrs', '2-4': '2-4 years', '5-8': '5-8 years', '9+': '9+ years' };

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const WHEN: { label: string; value: string | null }[] = [
  { label: 'In 2 weeks', value: addDays(14) },
  { label: 'In a month', value: addDays(30) },
  { label: 'In 2 months', value: addDays(60) },
  { label: 'In 3 months', value: addDays(90) },
  { label: 'Not scheduled yet', value: null },
];

export default function OnboardingScreen({ onDone, initialStep, still }: { onDone: (p: Profile) => void; initialStep?: number; still?: boolean }) {
  const [step, setStep] = useState(initialStep ?? 0);
  const [p, setP] = useState<Profile>(DEFAULT_PROFILE);

  const next = () => (step < STEPS - 1 ? setStep(step + 1) : onDone(p));
  const back = () => step > 0 && setStep(step - 1);
  const toggleLab = (id: LabId) => setP((s) => ({ ...s, labs: s.labs.includes(id) ? s.labs.filter((l) => l !== id) : [...s.labs, id] }));

  const canNext = step === 0 ? true : step === 1 ? p.labs.length > 0 : true;

  if (step === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.door}>
          <View>
            <Eyebrow>Onsite</Eyebrow>
            <Text style={[type.display, { marginTop: 14 }]}>You are closer{'\n'}than you think.</Text>
            <Text style={[type.bodySoft, { marginTop: 18 }]}>
              Onsite prepares you for the interview loops at Anthropic, OpenAI, DeepMind, Meta and Big Tech. Real round formats, a plan for your weeks, an AI interviewer that asks follow-ups, and a scorecard written the way a real debrief is written.
            </Text>
            <Text style={[type.bodySoft, { marginTop: 14 }]}>
              It will not get you the offer. Your reps will. This is the map and the honest feedback; the walking is yours.
            </Text>
            <Text style={[type.zh, { marginTop: 14 }]}>
              为准备 Anthropic、OpenAI、DeepMind 等公司面试而做。真实轮次结构、按周计划、会追问的 AI 面试官、以及像真实 debrief 一样的评分卡。中文解析全程可开。
            </Text>
          </View>
          <View style={{ gap: 12 }}>
            <Button title="Start" onPress={next} />
            <Text style={[type.caption, { textAlign: 'center' }]}>No account. Everything stays on your phone.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.top}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Pressable onPress={back} hitSlop={12}><Text style={{ color: colors.accent, fontSize: 16, fontWeight: '600' }}>‹ Back</Text></Pressable>
            <Text style={type.caption}>{step} / {STEPS - 1}</Text>
          </View>
          <Steps count={STEPS - 1} index={step - 1} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {step === 1 && (
            <>
              <Text style={type.h1}>Where are you interviewing?</Text>
              <Text style={[type.sub, { marginTop: 8 }]}>Pick every loop you are preparing for. 可多选。</Text>
              <View style={{ gap: 10, marginTop: 22 }}>
                {LABS.map((l) => {
                  const on = p.labs.includes(l.id);
                  return (
                    <Pressable key={l.id} onPress={() => toggleLab(l.id)} style={[styles.pick, on && styles.pickOn]}>
                      <Text style={[type.body, { flex: 1, fontWeight: on ? '700' : '400' }]}>{l.name}</Text>
                      <View style={[styles.box, on && { backgroundColor: colors.accent, borderColor: colors.accent }]}>{on ? <Text style={{ color: colors.onAccent, fontWeight: '900', fontSize: 13 }}>✓</Text> : null}</View>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={type.h1}>Which role?</Text>
              <Text style={[type.sub, { marginTop: 8 }]}>This changes which rounds you get.</Text>
              <View style={{ gap: 10, marginTop: 22 }}>
                {ROLES.map((r) => {
                  const on = p.role === r.id;
                  return (
                    <Pressable key={r.id} onPress={() => setP((s) => ({ ...s, role: r.id as RoleId }))} style={[styles.pick, on && styles.pickOn]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[type.body, { fontWeight: on ? '700' : '400' }]}>{r.name}</Text>
                        <Text style={type.caption}>{r.zh}</Text>
                      </View>
                      <View style={[styles.box, { borderRadius: 999 }, on && { backgroundColor: colors.accent, borderColor: colors.accent }]} />
                    </Pressable>
                  );
                })}
              </View>
              <Text style={[type.sub, { marginTop: 24 }]}>Years of experience</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {YEARS.map((y) => (
                  <Chip key={y} text={YEAR_LABEL[y]} selected={p.years === y} onPress={() => setP((s) => ({ ...s, years: y }))} />
                ))}
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={type.h1}>When is it?</Text>
              <Text style={[type.sub, { marginTop: 8 }]}>Your plan is built backwards from this date.</Text>
              <View style={{ gap: 10, marginTop: 22 }}>
                {WHEN.map((w) => {
                  const on = p.interviewDate === w.value;
                  return (
                    <Pressable key={w.label} onPress={() => setP((s) => ({ ...s, interviewDate: w.value }))} style={[styles.pick, on && styles.pickOn]}>
                      <Text style={[type.body, { flex: 1, fontWeight: on ? '700' : '400' }]}>{w.label}</Text>
                      <View style={[styles.box, { borderRadius: 999 }, on && { backgroundColor: colors.accent, borderColor: colors.accent }]} />
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {step === 4 && (
            <>
              <Text style={type.h1}>Tell the coach about you.</Text>
              <Text style={[type.sub, { marginTop: 8 }]}>Two or three lines: what you build, your strongest area, your weakest. This shapes your plan and every mock. 中英文都可以。</Text>
              <TextInput
                value={p.background}
                onChangeText={(t) => setP((s) => ({ ...s, background: t }))}
                placeholder="e.g. 3 years backend at a fintech, strong on distributed systems, weak on ML coding and behavioral. Targeting Anthropic infra."
                placeholderTextColor={colors.dim}
                style={styles.input}
                multiline
                textAlignVertical="top"
              />
              <TextInput value={p.name} onChangeText={(t) => setP((s) => ({ ...s, name: t }))} placeholder="First name (optional)" placeholderTextColor={colors.dim} style={styles.inputOne} />
              <Pressable onPress={() => setP((s) => ({ ...s, zh: !s.zh }))} style={[styles.pick, { marginTop: 16 }, p.zh && styles.pickOn]}>
                <View style={{ flex: 1 }}>
                  <Text style={[type.body, { fontWeight: '700' }]}>中文解析</Text>
                  <Text style={type.caption}>Add Chinese coaching notes under every scorecard and grade.</Text>
                </View>
                <View style={[styles.box, p.zh && { backgroundColor: colors.accent, borderColor: colors.accent }]}>{p.zh ? <Text style={{ color: colors.onAccent, fontWeight: '900', fontSize: 13 }}>✓</Text> : null}</View>
              </Pressable>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button title={step === STEPS - 1 ? 'Build my plan' : 'Continue'} onPress={next} disabled={!canNext} />
          {step === STEPS - 1 && <Text style={[type.caption, { textAlign: 'center', marginTop: 10 }]}>Onsite is independent and not affiliated with any company named here.</Text>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  door: { flex: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 18, justifyContent: 'space-between' },
  top: { paddingHorizontal: 20, paddingTop: 8 },
  scroll: { paddingHorizontal: 20, paddingTop: 26, paddingBottom: 24 },
  footer: { paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  pick: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  pickOn: { borderColor: colors.accent, backgroundColor: '#171c1c' },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  input: { marginTop: 18, minHeight: 130, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 14, color: colors.ink, fontSize: 15, lineHeight: 22 },
  inputOne: { marginTop: 12, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 14, color: colors.ink, fontSize: 15 },
});
