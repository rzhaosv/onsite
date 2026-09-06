import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { colors } from './src/theme';
import { AppProvider, useApp } from './src/store/AppContext';
import { RootStackParamList, TabParamList } from './src/navigation';
import TabIcon, { TabName } from './src/components/TabIcon';
import OnboardingScreen from './src/screens/OnboardingScreen';
import TodayScreen from './src/screens/TodayScreen';
import LoopsScreen from './src/screens/LoopsScreen';
import LoopScreen from './src/screens/LoopScreen';
import DrillScreen from './src/screens/DrillScreen';
import DrillCardScreen from './src/screens/DrillCardScreen';
import StoriesScreen from './src/screens/StoriesScreen';
import StoryScreen from './src/screens/StoryScreen';
import MeScreen from './src/screens/MeScreen';
import MockSetupScreen from './src/screens/MockSetupScreen';
import MockScreen from './src/screens/MockScreen';
import ScorecardScreen from './src/screens/ScorecardScreen';
import PlanScreen from './src/screens/PlanScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import { demo } from './src/dev/demo';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.bg, text: colors.ink, primary: colors.accent, border: colors.line },
};

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName={demo?.tab ?? 'Today'}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
        sceneStyle: { backgroundColor: colors.bg },
        tabBarIcon: ({ color, size }) => <TabIcon name={route.name.toLowerCase() as TabName} color={color} size={size - 1} />,
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Loops" component={LoopsScreen} />
      <Tab.Screen name="Drill" component={DrillScreen} />
      <Tab.Screen name="Stories" component={StoriesScreen} />
      <Tab.Screen name="Me" component={MeScreen} />
    </Tab.Navigator>
  );
}

function Root() {
  const { ready, state, completeOnboarding } = useApp();
  const [justOnboarded, setJustOnboarded] = useState(false);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  if (!state.onboarded) return <OnboardingScreen initialStep={demo?.onboardStep} still={!!demo?.snap} onDone={(p) => { completeOnboarding(p); setJustOnboarded(true); }} />;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName={demo?.screen ?? 'Tabs'} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Loop" component={LoopScreen} initialParams={demo?.name === 'loop' ? { lab: 'anthropic' } : undefined} />
        <Stack.Screen name="MockSetup" component={MockSetupScreen} />
        <Stack.Screen name="Mock" component={MockScreen} initialParams={demo?.mockId ? { id: demo.mockId } : undefined} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Scorecard" component={ScorecardScreen} initialParams={demo?.mockId ? { id: demo.mockId } : undefined} />
        <Stack.Screen name="DrillCard" component={DrillCardScreen} initialParams={demo?.drillId ? { id: demo.drillId } : undefined} />
        <Stack.Screen name="Story" component={StoryScreen} initialParams={demo?.name === 'stories' ? { id: 'demo-story-1' } : undefined} />
        <Stack.Screen name="Plan" component={PlanScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Web-only: pin to a phone-sized frame when capturing screenshots.
const webFrame =
  Platform.OS === 'web'
    ? demo
      ? ({ width: 430, height: 932, overflow: 'hidden', backgroundColor: colors.bg } as const)
      : ({ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: colors.bg } as const)
    : null;
const demoInsets = demo ? { paddingTop: 59, paddingBottom: 34 } : null;

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppProvider>
        <View style={[{ flex: 1, backgroundColor: colors.bg }, webFrame as any, demoInsets]}>
          <Root />
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}
