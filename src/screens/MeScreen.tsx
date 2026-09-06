import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Linking, Modal, Pressable, ScrollView } from 'react-native';
import { colors, radius, type } from '../theme';
import { Screen, Header, Card, Eyebrow, Button, Row, Chip, TextLink, Stat } from '../components/UI';
import { useApp } from '../store/AppContext';
import { restore } from '../services/billing';
import { TabProps } from '../navigation';
import { SITE } from './PaywallScreen';
import { LABS, ROLES, loopFor } from '../content/loops';
import { LabId } from '../logic/types';
import { readiness, streak, daysUntil } from '../logic';

export default function MeScreen({ navigation }: TabProps<'Me'>) {
  const { state, isPro, setPro, setProfile, resetAll } = useApp();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);
  const p = state.profile;
  const r = readiness(state);

  const onRestore = async () => {
    try {
      const ok = await restore();
      if (ok) {
        setPro(true);
        Alert.alert('Restored', 'Onsite Pro is active on this device.');
      } else Alert.alert('Nothing to restore', 'No active subscription was found for this Apple ID.');
    } catch {
      Alert.alert('Restore failed', 'Please try again in a moment.');
    }
  };

  const onReset = () =>
    Alert.alert('Erase everything?', 'Your plan, mocks, drills and stories are deleted from this device. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Erase', style: 'destructive', onPress: () => resetAll() },
    ]);

  const toggleLab = (id: LabId) => setProfile({ labs: p.labs.includes(id) ? p.labs.filter((l) => l !== id) : [...p.labs, id] });

  return (
    <Screen scroll>
      <Header title="Me" right={isPro ? <Text style={[type.caption, { color: colors.accent }]}>PRO</Text> : null} />

      <Card accent>
        <Eyebrow>Where you stand</Eyebrow>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <Stat label="Readiness" value={`${r.overall}`} color={r.overall >= 70 ? colors.good : colors.accent} />
          <Stat label="Streak" value={`${streak(state.activeDays)}d`} />
          <Stat label="Days out" value={daysUntil(p.interviewDate) === null ? '—' : `${daysUntil(p.interviewDate)}`} />
        </View>
        <Text style={[type.caption, { marginTop: 12, lineHeight: 17 }]}>
          Readiness moves when you do the work, not when you read about it. It is your own scorecards and grades, averaged.
        </Text>
      </Card>

      <Card style={{ marginTop: 14 }}>
        <Eyebrow>Targets</Eyebrow>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {LABS.map((l) => (
            <Chip key={l.id} text={loopFor(l.id).short} selected={p.labs.includes(l.id)} onPress={() => toggleLab(l.id)} small />
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {ROLES.map((role) => (
            <Chip key={role.id} text={role.name} selected={p.role === role.id} onPress={() => setProfile({ role: role.id })} small />
          ))}
        </View>
        <View style={{ marginTop: 16 }}>
          <Row label="中文解析 Chinese notes" value={p.zh ? 'On' : 'Off'} onPress={() => setProfile({ zh: !p.zh })} />
        </View>
      </Card>

      {!isPro && (
        <Card style={{ marginTop: 14 }}>
          <Eyebrow>Onsite Pro</Eyebrow>
          <Text style={[type.bodySoft, { marginTop: 8 }]}>Unlimited mocks and scorecards, the full drill bank with grading, and story sharpening.</Text>
          <Button title="See Pro" onPress={() => navigation.navigate('Paywall')} style={{ marginTop: 14 }} />
        </Card>
      )}

      <View style={{ marginTop: 14 }}>
        <Row label="Your plan" onPress={() => navigation.navigate('Plan')} />
        <Row label="Restore purchases" onPress={onRestore} />
        <Row label="How Onsite works" onPress={() => setAboutOpen(true)} />
        <Row label="Terms of use" onPress={() => Linking.openURL(`${SITE}/terms.html`)} />
        <Row label="Privacy" onPress={() => Linking.openURL(`${SITE}/privacy.html`)} />
        <Row label="Support" onPress={() => Linking.openURL('mailto:tryformaapp@gmail.com?subject=Onsite')} />
        <Row label="Erase everything" onPress={onReset} danger />
      </View>

      <Text style={[type.caption, { textAlign: 'center', marginTop: 20, lineHeight: 17 }]}>
        Onsite is independent and not affiliated with Anthropic, OpenAI, Google DeepMind, Meta or any company named in the app. No offer is guaranteed.
      </Text>

      <Modal visible={aboutOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setAboutOpen(false)}>
        <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
          <View style={{ alignItems: 'flex-end' }}>
            <TextLink title="Close" onPress={() => setAboutOpen(false)} />
          </View>
          <Text style={type.h1}>How Onsite works.</Text>
          <Text style={[type.body, { marginTop: 16 }]}>
            The loops are compiled from published interview guides, company engineering posts, and candidate reports on forums like 1point3acres and Xiaohongshu. Formats change; treat them as a strong prior, not gospel.
          </Text>
          <Text style={[type.body, { marginTop: 14 }]}>
            The mock interviewer is a language model given the round format, the lab's bar, and your background. It asks follow-ups and then writes a debrief on the four-point scale real interviewers use. It is a simulation, not a prediction, and it has no connection to any company's hiring.
          </Text>
          <Text style={[type.body, { marginTop: 14 }]}>
            Drills use spaced repetition: cards you answer weakly come back tomorrow, cards you nail come back in weeks. Stories are yours; the coach tightens wording and never invents facts.
          </Text>
          <Text style={[type.body, { marginTop: 14 }]}>
            One honest thing: no app gets you an offer. The reps get you the offer. What Onsite can do is make sure the reps are the right ones, and tell you the truth about where you are.
          </Text>
          <Text style={[type.zh, { marginTop: 16 }]}>
            所有轮次信息来自公开面经与公司资料，格式随时会变。模拟面试由大模型扮演面试官，按真实 debrief 的四档打分，仅供练习，与任何公司的招聘无关。刷题卡用间隔重复：答得差的明天再来，答得好的几周后再见。没有任何 app 能给你 offer，能给你 offer 的是你自己的练习量。我们只能保证你练的是对的东西，并且对你说实话。
          </Text>
        </ScrollView>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({});
