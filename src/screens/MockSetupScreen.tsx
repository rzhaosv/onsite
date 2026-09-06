import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { colors, type } from '../theme';
import { Screen, Header, Card, Eyebrow, Button, Chip } from '../components/UI';
import { LABS, ROUND_NAMES, ROUND_ZH, loopFor } from '../content/loops';
import { LabId, RoundType, FREE_MOCKS } from '../logic/types';
import { ScreenProps } from '../navigation';
import { useApp } from '../store/AppContext';
import { fallbackOpening, uid } from '../logic';

export default function MockSetupScreen({ navigation, route }: ScreenProps<'MockSetup'>) {
  const { state, isPro, addMock } = useApp();
  const [lab, setLab] = useState<LabId>(route.params?.lab ?? state.profile.labs[0] ?? 'anthropic');
  const [round, setRound] = useState<RoundType>(route.params?.round ?? loopFor(lab).stages[0].round);
  const loop = loopFor(lab);
  const rounds = Array.from(new Set(loop.stages.map((s) => s.round)));
  const canStart = isPro || state.freeMocksUsed < FREE_MOCKS;

  const start = () => {
    if (!canStart) {
      navigation.navigate('Paywall', { reason: 'mock' });
      return;
    }
    const id = uid();
    addMock({ id, at: new Date().toISOString(), lab, round, question: fallbackOpening(round), messages: [], scorecard: null, durationSec: 0 });
    navigation.replace('Mock', { id });
  };

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <Header title="New mock" onBack={() => navigation.goBack()} />
      <Text style={type.h1}>Which round?</Text>
      <Text style={[type.sub, { marginTop: 8 }]}>A real interviewer, real follow-ups, and a scorecard at the end. Type your answers the way you would say them.</Text>

      <Card style={{ marginTop: 18 }}>
        <Eyebrow>Company</Eyebrow>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {LABS.map((l) => (
            <Chip
              key={l.id}
              text={loopFor(l.id).short}
              selected={lab === l.id}
              onPress={() => {
                setLab(l.id);
                const rs = loopFor(l.id).stages.map((s) => s.round);
                if (!rs.includes(round)) setRound(rs[0]);
              }}
            />
          ))}
        </View>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Eyebrow>Round</Eyebrow>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {rounds.map((r) => (
            <Chip key={r} text={state.profile.zh ? `${ROUND_NAMES[r]} · ${ROUND_ZH[r]}` : ROUND_NAMES[r]} selected={round === r} onPress={() => setRound(r)} />
          ))}
        </View>
      </Card>

      <Card style={{ marginTop: 12 }} accent>
        <Eyebrow>What to expect</Eyebrow>
        <Text style={[type.bodySoft, { marginTop: 8 }]}>{loop.stages.find((s) => s.round === round)?.tests ?? ''}</Text>
        <Text style={[type.caption, { marginTop: 10 }]}>Six to eight exchanges, then End round for your scorecard. Give it real answers; a thin transcript scores like a thin interview.</Text>
      </Card>

      <Button title={canStart ? 'Begin the round' : 'Unlock unlimited mocks'} onPress={start} style={{ marginTop: 18 }} />
      {!isPro && <Text style={[type.caption, { textAlign: 'center', marginTop: 10 }]}>{state.freeMocksUsed < FREE_MOCKS ? 'Your first mock is free.' : 'Free mock used.'}</Text>}
    </Screen>
  );
}
