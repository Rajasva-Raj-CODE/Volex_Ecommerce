import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { duration, easing, springPop } from "../design/motion";
import { brandGradient, color, space, type } from "../design/tokens";

const MARK = require("../../assets/splash-icon.png");

/**
 * Bridges the native splash and the app.
 *
 * The native splash vanishes the instant it's hidden, which reads as a flicker.
 * This overlay is drawn to match it exactly — same teal, same mark — so the
 * handoff is invisible; it then animates itself away to reveal the content
 * already mounted underneath.
 *
 * Under Reduce Motion it holds briefly and cuts, rather than scaling and fading.
 */
export function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const reduced = useReducedMotion();
  const markScale = useSharedValue(1);
  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    if (reduced) {
      overlayOpacity.set(
        withDelay(
          250,
          withTiming(0, { duration: 1 }, (done) => {
            if (done) runOnJS(onFinish)();
          })
        )
      );
      return;
    }

    // A small settle, then a lift-and-fade — the mark grows as the app arrives.
    markScale.set(withSequence(withSpring(0.92, springPop), withSpring(1.35, springPop)));
    overlayOpacity.set(
      withDelay(
        260,
        withTiming(0, { duration: duration.entrance, easing }, (done) => {
          if (done) runOnJS(onFinish)();
        })
      )
    );
  }, [reduced, markScale, overlayOpacity, onFinish]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.get() }));
  const markStyle = useAnimatedStyle(() => ({ transform: [{ scale: markScale.get() }] }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, overlayStyle]}
    >
      <LinearGradient
        colors={brandGradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[
          StyleSheet.absoluteFill,
          { alignItems: "center", justifyContent: "center", gap: space.xl },
        ]}
      >
        <Animated.View style={markStyle}>
          <Image source={MARK} style={{ width: 180, height: 180 }} contentFit="contain" />
        </Animated.View>
        <Text style={{ ...type.micro, color: color.onBrand, opacity: 0.8, letterSpacing: 2 }}>
          VOLTEX
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}
