import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { LabId, RoundType } from './logic/types';

export type TabParamList = {
  Today: undefined;
  Loops: undefined;
  Drill: undefined;
  Stories: undefined;
  Me: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Loop: { lab: LabId };
  MockSetup: { lab?: LabId; round?: RoundType } | undefined;
  Mock: { id: string };
  Scorecard: { id: string };
  DrillCard: { id: string };
  Story: { id?: string } | undefined;
  Plan: undefined;
  Paywall: { reason?: 'mock' | 'grade' | 'plan' } | undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
export type TabProps<T extends keyof TabParamList> = CompositeScreenProps<BottomTabScreenProps<TabParamList, T>, NativeStackScreenProps<RootStackParamList>>;
