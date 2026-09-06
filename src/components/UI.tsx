import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, type } from '../theme';

export function Screen({ children, scroll, contentStyle, edges = ['top'] }: { children: React.ReactNode; scroll?: boolean; contentStyle?: ViewStyle; edges?: ('top' | 'bottom')[] }) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.scroll, contentStyle]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.body, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Header({ title, onBack, right, sub }: { title?: string; onBack?: () => void; right?: React.ReactNode; sub?: string }) {
  return (
    <View style={styles.header}>
      <View style={{ width: 70 }}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={12}>
            <Text style={styles.back}>‹ Back</Text>
          </Pressable>
        )}
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={type.h3} numberOfLines={1}>{title ?? ''}</Text>
        {sub ? <Text style={type.caption}>{sub}</Text> : null}
      </View>
      <View style={{ width: 70, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

export function Card({ children, style, onPress, accent }: { children: React.ReactNode; style?: ViewStyle; onPress?: () => void; accent?: boolean }) {
  const inner = <View style={[styles.card, accent && styles.cardAccent, style]}>{children}</View>;
  if (!onPress) return inner;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.8 }]}>
      {inner}
    </Pressable>
  );
}

export function Eyebrow({ children, color, style }: { children: React.ReactNode; color?: string; style?: TextStyle }) {
  return <Text style={[type.eyebrow, color ? { color } : null, style]}>{children}</Text>;
}

export function Button({ title, onPress, loading, disabled, style, ghost, danger }: { title: string; onPress: () => void; loading?: boolean; disabled?: boolean; style?: ViewStyle; ghost?: boolean; danger?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.button, ghost && styles.ghost, danger && { backgroundColor: colors.danger }, (disabled || loading) && { opacity: 0.45 }, pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] }, style]}
    >
      {loading ? <ActivityIndicator color={ghost ? colors.ink : colors.onAccent} /> : <Text style={[styles.buttonText, ghost && { color: colors.ink }, danger && { color: '#fff' }]}>{title}</Text>}
    </Pressable>
  );
}

export function TextLink({ title, onPress, style, dim }: { title: string; onPress: () => void; style?: ViewStyle; dim?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.link, pressed && { opacity: 0.6 }, style]} hitSlop={8}>
      <Text style={[type.label, { color: dim ? colors.muted : colors.accent }]}>{title}</Text>
    </Pressable>
  );
}

export function Chip({ text, selected, onPress, small }: { text: string; selected?: boolean; onPress?: () => void; small?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={[styles.chip, small && { paddingHorizontal: 10, paddingVertical: 6 }, selected && styles.chipActive]}>
      <Text style={[styles.chipText, small && { fontSize: 12 }, selected && { color: colors.onAccent }]}>{text}</Text>
    </Pressable>
  );
}

export function Row({ label, value, onPress, danger, pro }: { label: string; value?: string; onPress: () => void; danger?: boolean; pro?: boolean }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        <Text style={[type.body, { fontWeight: '600' }, danger && { color: colors.danger }]}>{label}</Text>
        {pro && <ProBadge />}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {value ? <Text style={type.sub}>{value}</Text> : null}
        <Text style={{ color: colors.muted, fontSize: 18 }}>›</Text>
      </View>
    </Pressable>
  );
}

export function ProBadge() {
  return (
    <View style={styles.proBadge}>
      <Text style={styles.proBadgeText}>PRO</Text>
    </View>
  );
}

export function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <View style={styles.tile}>
      <Text style={type.caption}>{label}</Text>
      <Text style={[type.num, { marginTop: 4, fontSize: 24 }, color ? { color } : null]} numberOfLines={1}>{value}</Text>
      {sub ? <Text style={[type.caption, { marginTop: 2 }]}>{sub}</Text> : null}
    </View>
  );
}

export function Bar({ value, color }: { value: number; color?: string }) {
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${Math.max(2, Math.min(100, value))}%` as any, backgroundColor: color ?? colors.accent }]} />
    </View>
  );
}

export function Steps({ count, index }: { count: number; index: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= index ? colors.accent : colors.dim }} />
      ))}
    </View>
  );
}

export function Zh({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <View style={styles.zh}>
      <Text style={[type.caption, { color: colors.accent, marginBottom: 4 }]}>中文解析</Text>
      <Text style={type.zh}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, paddingHorizontal: 20 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  back: { color: colors.accent, fontSize: 17, fontWeight: '600' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 18, borderWidth: 1, borderColor: colors.line },
  cardAccent: { borderColor: 'rgba(245,196,81,0.45)', backgroundColor: '#161b1a' },
  button: { backgroundColor: colors.accent, borderRadius: radius.md, height: 54, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  ghost: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.lineStrong },
  buttonText: { color: colors.onAccent, fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
  link: { height: 44, alignItems: 'center', justifyContent: 'center' },
  chip: { backgroundColor: colors.surface2, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: colors.line },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.ink, fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  proBadge: { backgroundColor: colors.accent, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 2 },
  proBadgeText: { color: colors.onAccent, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
  tile: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.line },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: colors.surface2, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  zh: { marginTop: 12, padding: 12, borderRadius: radius.md, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: 'rgba(245,196,81,0.3)' },
});
