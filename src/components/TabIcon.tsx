import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

export type TabName = 'today' | 'loops' | 'drill' | 'stories' | 'me';

export default function TabIcon({ name, color, size }: { name: TabName; color: string; size: number }) {
  const s = size;
  return (
    <View style={{ width: s, height: s }}>
      <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        {name === 'today' && (
          <>
            <Path d="M5 15l7-8 7 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="12" cy="4" r="1.6" fill={color} />
          </>
        )}
        {name === 'loops' && (
          <>
            <Rect x="3" y="5" width="18" height="14" rx="3" stroke={color} strokeWidth={1.8} />
            <Path d="M7 12h10M7 9h6M7 15h8" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
          </>
        )}
        {name === 'drill' && (
          <>
            <Rect x="4" y="4" width="12" height="15" rx="2.5" stroke={color} strokeWidth={1.8} />
            <Path d="M8 4V3m0 17v-1M16 7l4 2v10l-4 2" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
          </>
        )}
        {name === 'stories' && (
          <>
            <Path d="M5 4h11l3 3v13H5z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
            <Path d="M8 10h8M8 14h6" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
          </>
        )}
        {name === 'me' && (
          <>
            <Circle cx="12" cy="8" r="3.6" stroke={color} strokeWidth={1.8} />
            <Path d="M4.5 20c1-4 4-6 7.5-6s6.5 2 7.5 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          </>
        )}
      </Svg>
    </View>
  );
}
