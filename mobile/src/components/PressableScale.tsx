import { forwardRef } from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
} from "react-native-reanimated";
import { springPress } from "../design/motion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, "style"> {
  style?: ViewStyle | ViewStyle[];
  /** How far down it presses. 0.97 for cards, 0.93 for small buttons. */
  activeScale?: number;
  spring?: WithSpringConfig;
}

/**
 * Press feedback that a plain opacity change can't give: the element physically
 * gives under the finger and springs back. Runs on the UI thread, so it stays
 * smooth even while a list is fetching.
 *
 * The spring config carries ReduceMotion.System, so this degrades to an instant
 * state change when the OS asks for reduced motion.
 */
export const PressableScale = forwardRef<
  React.ComponentRef<typeof AnimatedPressable>,
  PressableScaleProps
>(function PressableScale(
  { style, activeScale = 0.97, spring = springPress, onPressIn, onPressOut, disabled, ...rest },
  ref
) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - pressed.get() * (1 - activeScale), spring) }],
  }));

  return (
    <AnimatedPressable
      ref={ref}
      disabled={disabled}
      onPressIn={(e) => {
        pressed.set(1);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.set(0);
        onPressOut?.(e);
      }}
      style={[style, animatedStyle]}
      {...rest}
    />
  );
});
