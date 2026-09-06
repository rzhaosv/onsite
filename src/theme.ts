import { Platform, TextStyle } from 'react-native';

/** Ink navy ground, paper text, one gold signal. Serious, warm, expensive. */
export const colors = {
  bg: '#0B0F14',
  surface: '#121820',
  surface2: '#1A222C',
  ink: '#F4F6F8',
  text: '#F4F6F8',
  soft: '#C3CAD3',
  muted: '#7F8A97',
  dim: '#3A4652',
  line: 'rgba(244,246,248,0.10)',
  lineStrong: 'rgba(244,246,248,0.24)',
  accent: '#F5C451',
  accentSoft: 'rgba(245,196,81,0.16)',
  onAccent: '#0B0F14',
  good: '#3DDC97',
  goodSoft: 'rgba(61,220,151,0.16)',
  warn: '#F59E5B',
  danger: '#F06565',
  info: '#6EA8FE',
  overlay: 'rgba(0,0,0,0.6)',
};

export const radius = { sm: 10, md: 14, lg: 18, pill: 999 };
export const space = (n: number) => n * 4;

export const mono = Platform.select({
  ios: 'Menlo',
  web: 'Menlo, "SF Mono", Consolas, "Courier New", monospace',
  default: 'monospace',
}) as string;

const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

export const type: Record<string, TextStyle> = {
  display: { fontSize: 34, fontWeight: '800', color: colors.ink, letterSpacing: -0.9, lineHeight: 38 },
  h1: { fontSize: 26, fontWeight: '800', color: colors.ink, letterSpacing: -0.6, lineHeight: 30 },
  h2: { fontSize: 20, fontWeight: '700', color: colors.ink, letterSpacing: -0.3, lineHeight: 25 },
  h3: { fontSize: 16, fontWeight: '700', color: colors.ink },
  body: { fontSize: 16, fontWeight: '400', color: colors.ink, lineHeight: 23 },
  bodySoft: { fontSize: 15, fontWeight: '400', color: colors.soft, lineHeight: 22 },
  sub: { fontSize: 13, fontWeight: '500', color: colors.muted, lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '500', color: colors.muted },
  eyebrow: { fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 1.6, textTransform: 'uppercase' },
  label: { fontSize: 12, fontWeight: '700', color: colors.ink, letterSpacing: 0.4 },
  mono: { fontFamily: mono, fontSize: 13, color: colors.soft, lineHeight: 19, ...tabular },
  num: { fontSize: 28, fontWeight: '800', color: colors.ink, letterSpacing: -1, ...tabular },
  big: { fontSize: 56, fontWeight: '800', color: colors.ink, letterSpacing: -2.5, lineHeight: 58, ...tabular },
  zh: { fontSize: 15, fontWeight: '400', color: colors.soft, lineHeight: 24 },
};
