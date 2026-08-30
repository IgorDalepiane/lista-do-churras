import { type ReactNode, useEffect } from 'react';
import { Pressable, type PressableProps, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  appearMs,
  easeOut,
  enterAppear,
  enterCheck,
  playHaptic,
  pressMs,
  pressOpacity,
  pressScale,
  useReduceMotion,
  type HapticKind,
} from './motion';
import { C } from './theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressScaleProps = PressableProps & {
  haptic?: HapticKind;
  extraStyle?: object;
};

export function PressScale({
  haptic,
  extraStyle,
  style,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressScaleProps) {
  const reduce = useReduceMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      style={[style, extraStyle, pressStyle]}
      onPressIn={(e) => {
        if (!disabled && !reduce) {
          scale.value = withTiming(pressScale, { duration: pressMs, easing: easeOut });
          opacity.value = withTiming(pressOpacity, { duration: pressMs, easing: easeOut });
        }
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, { duration: pressMs, easing: easeOut });
        opacity.value = withTiming(1, { duration: pressMs, easing: easeOut });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) playHaptic(haptic);
        onPress?.(e);
      }}
    >
      {children}
    </AnimatedPressable>
  );
}

export function CtaPressable({
  enabled,
  success = false,
  haptic,
  style,
  children,
  onPress,
  ...rest
}: PressScaleProps & { enabled: boolean; success?: boolean }) {
  const reduce = useReduceMotion();
  const fill = useSharedValue(enabled ? 1 : 0);
  const ok = useSharedValue(success ? 1 : 0);

  useEffect(() => {
    fill.value = reduce
      ? enabled
        ? 1
        : 0
      : withTiming(enabled ? 1 : 0, { duration: pressMs, easing: easeOut });
  }, [enabled, fill, reduce]);

  useEffect(() => {
    ok.value = reduce
      ? success
        ? 1
        : 0
      : withTiming(success ? 1 : 0, { duration: appearMs, easing: easeOut });
  }, [ok, reduce, success]);

  const fillStyle = useAnimatedStyle(() => {
    const idle = interpolateColor(fill.value, [0, 1], [C.ctaOff, C.ink]);
    return { backgroundColor: interpolateColor(ok.value, [0, 1], [idle, C.ok]) };
  });

  return (
    <PressScale
      {...rest}
      disabled={!enabled}
      haptic={haptic}
      onPress={onPress}
      style={style}
      extraStyle={fillStyle}
    >
      {children}
    </PressScale>
  );
}

export function Screen({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>{sub}</Text>
      {children}
    </View>
  );
}

export function Grid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

export function GroupLabel({ children }: { children: string }) {
  return <Text style={styles.groupLabel}>{children}</Text>;
}

export function SelectCard({
  icon,
  label,
  tint,
  on,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  tint: string;
  on: boolean;
  onPress: () => void;
}) {
  const reduce = useReduceMotion();
  return (
    <PressScale
      haptic="selection"
      onPress={onPress}
      style={[styles.tile, on && styles.tileOn]}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      accessibilityLabel={label}
    >
      {on ? (
        <Animated.View entering={reduce ? undefined : enterCheck} style={styles.check}>
          <Text style={styles.checkTxt}>✓</Text>
        </Animated.View>
      ) : null}
      <View style={[styles.iconBox, { backgroundColor: tint }]}>{icon}</View>
      <Text style={[styles.tileLabel, !on && styles.tileLabelOff]}>{label}</Text>
    </PressScale>
  );
}

export function Radio({
  label,
  hint,
  on,
  onPress,
}: {
  label: string;
  hint?: string;
  on: boolean;
  onPress: () => void;
}) {
  const reduce = useReduceMotion();
  return (
    <PressScale haptic="selection" onPress={onPress} style={[styles.radio, on && styles.radioOn]}>
      <View style={[styles.dot, on && styles.dotOn]}>
        {on ? (
          <Animated.View entering={reduce ? undefined : enterAppear} style={styles.dotCore} />
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.radioTxt}>{label}</Text>
        {hint ? <Text style={styles.radioHint}>{hint}</Text> : null}
      </View>
    </PressScale>
  );
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <View style={styles.seg}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <PressScale
            key={o.id}
            haptic="selection"
            onPress={() => onChange(o.id)}
            style={[styles.segItem, on && styles.segOn]}
          >
            <Text style={[styles.segTxt, on && styles.segTxtOn]}>{o.label}</Text>
          </PressScale>
        );
      })}
    </View>
  );
}

export function Counter({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max?: number;
}) {
  const clamp = (n: number) => Math.max(min, max == null ? n : Math.min(max, n));
  return (
    <View style={styles.counter}>
      <PressScale haptic="light" style={styles.roundBtn} onPress={() => onChange(clamp(value - 1))}>
        <Text style={styles.roundBtnTxt}>−</Text>
      </PressScale>
      <TextInput
        style={styles.counterInput}
        keyboardType="number-pad"
        value={String(value)}
        onChangeText={(t) => {
          const n = parseInt(t.replace(/\D/g, ''), 10);
          onChange(clamp(Number.isFinite(n) ? n : min));
        }}
      />
      <PressScale haptic="light" style={styles.roundBtn} onPress={() => onChange(clamp(value + 1))}>
        <Text style={styles.roundBtnTxt}>+</Text>
      </PressScale>
    </View>
  );
}

export const styles = StyleSheet.create({
  title: { color: C.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.7, marginTop: 8 },
  sub: { color: C.muted, fontSize: 16, marginTop: 8, marginBottom: 22, lineHeight: 22 },
  groupLabel: {
    color: C.muted,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 8,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: C.card,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tileOn: { borderColor: C.ink, backgroundColor: '#FFFaf6' },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkTxt: { color: C.card, fontSize: 12, fontWeight: '800' },
  iconBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tileLabel: { color: C.ink, fontWeight: '700', textAlign: 'center' },
  tileLabelOff: { color: C.muted, fontWeight: '600' },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: C.card,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radioOn: { borderColor: C.accent, backgroundColor: C.accentSoft },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: { borderColor: C.accent },
  dotCore: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.accent },
  radioTxt: { color: C.navy, fontSize: 16, fontWeight: '700' },
  radioHint: { color: C.muted, fontSize: 13, marginTop: 2 },
  seg: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  segItem: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  segOn: { backgroundColor: C.ink },
  segTxt: { color: C.muted, fontWeight: '700' },
  segTxtOn: { color: C.card },
  counter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  roundBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnTxt: { color: C.card, fontSize: 24, fontWeight: '600' },
  counterInput: {
    width: 72,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.bg,
    color: C.ink,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
});
