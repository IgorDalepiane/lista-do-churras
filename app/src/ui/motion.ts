import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Easing, FadeIn, FadeInLeft, FadeInRight, ZoomIn } from 'react-native-reanimated';

export const pressMs = 100;
export const stepMs = 200;
export const appearMs = 240;
export const pressScale = 0.97;
export const pressOpacity = 0.92;
export const stepSlidePx = 10;

export const easeOut = Easing.out(Easing.cubic);

export const enterStepForward = FadeInRight.duration(stepMs)
  .easing(easeOut)
  .withInitialValues({ opacity: 0, translateX: stepSlidePx });

export const enterStepBack = FadeInLeft.duration(stepMs)
  .easing(easeOut)
  .withInitialValues({ opacity: 0, translateX: -stepSlidePx });

export const enterAppear = FadeIn.duration(appearMs).easing(easeOut);

export const enterCheck = ZoomIn.duration(pressMs).easing(easeOut);

export const enterHero = ZoomIn.duration(appearMs).easing(easeOut).withInitialValues({ scale: 0.98 });

export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (alive) setReduce(value);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  return reduce;
}

export type HapticKind = 'selection' | 'light' | 'success';

export function playHaptic(kind: HapticKind): void {
  if (Platform.OS === 'web') return;
  void (async () => {
    try {
      if (kind === 'success') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      }
      if (kind === 'light') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      }
      await Haptics.selectionAsync();
    } catch {
      // Native module missing (Expo Go / web) — visual motion still runs.
    }
  })();
}
