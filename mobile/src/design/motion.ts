import { Easing, ReduceMotion, type WithSpringConfig, type WithTimingConfig } from "react-native-reanimated";

/**
 * Motion tokens.
 *
 * Two rules keep animation from becoming decoration:
 *
 * 1. **Motion explains, it doesn't perform.** Things move to show where they
 *    came from or that a tap registered — never to be noticed on their own.
 * 2. **Everything respects Reduce Motion.** Every config below carries
 *    `ReduceMotion.System`, so the OS setting disables it without call sites
 *    having to remember. Entering animations are gated separately with
 *    `useReducedMotion()`, since a builder can't opt out on its own.
 */

export const duration = {
  /** Press feedback — must feel instant. */
  instant: 120,
  /** The default for fades and small moves. */
  quick: 220,
  /** Content entering the screen. */
  entrance: 320,
} as const;

/** Standard ease — decelerate in, matching both platforms' system curves. */
export const easing = Easing.bezier(0.22, 1, 0.36, 1);

export const timing: WithTimingConfig = {
  duration: duration.quick,
  easing,
  reduceMotion: ReduceMotion.System,
};

export const timingFast: WithTimingConfig = {
  duration: duration.instant,
  easing,
  reduceMotion: ReduceMotion.System,
};

/** Press/release spring — tight, no visible bounce. */
export const springPress: WithSpringConfig = {
  damping: 18,
  stiffness: 320,
  mass: 0.6,
  reduceMotion: ReduceMotion.System,
};

/** Playful pop for a confirming action (ADD). */
export const springPop: WithSpringConfig = {
  damping: 10,
  stiffness: 380,
  mass: 0.5,
  reduceMotion: ReduceMotion.System,
};

/** How far apart staggered siblings start, in ms. */
export const STAGGER_STEP = 55;

/** Scroll offset at which the compact sticky header has fully appeared. */
export const HEADER_COLLAPSE_DISTANCE = 90;
