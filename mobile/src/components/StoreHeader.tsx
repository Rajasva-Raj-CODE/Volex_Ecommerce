import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../design/Icon";
import { tapFeedback } from "../design/haptics";
import { HEADER_COLLAPSE_DISTANCE } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";
import { PressableScale } from "./PressableScale";

/** Shared search field, so the tall and compact headers can't drift apart. */
function SearchField({ height = 44 }: { height?: number }) {
  const router = useRouter();

  return (
    <PressableScale
      accessibilityRole="search"
      accessibilityLabel="Search products"
      activeScale={0.98}
      onPress={() => {
        tapFeedback();
        router.push("/(tabs)/(search)");
      }}
      android_ripple={{ color: color.well }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: space.md,
        backgroundColor: color.card,
        borderRadius: radius.md,
        paddingHorizontal: space.lg,
        height,
      }}
    >
      <Icon name="search" size={17} color={color.tertiaryLabel} />
      <Text style={{ ...type.body, color: color.tertiaryLabel }}>
        Search phones, laptops, TVs…
      </Text>
    </PressableScale>
  );
}

/**
 * The teal brand block on Home. It scrolls away with the content, and as it goes
 * the promise text drifts up and fades — a parallax cue that the header is
 * leaving rather than just clipping.
 *
 * `CompactHeader` below takes over once it's gone.
 */
export function StoreHeader({ scrollY }: { scrollY: SharedValue<number> }) {
  const insets = useSafeAreaInsets();

  const promiseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.get(),
      [0, HEADER_COLLAPSE_DISTANCE * 0.7],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.get(),
          [0, HEADER_COLLAPSE_DISTANCE],
          [0, -18],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <View
      style={{
        backgroundColor: color.brand,
        paddingTop: insets.top + space.md,
        paddingHorizontal: space.xl,
        paddingBottom: space.xl,
        borderBottomLeftRadius: radius.xl,
        borderBottomRightRadius: radius.xl,
        gap: space.lg,
      }}
    >
      <Animated.View style={[{ gap: space.xs }, promiseStyle]}>
        <View style={{ gap: space.sm }} className="flex-row items-center">
          <Icon name="delivery" size={15} color={color.onBrand} />
          <Text style={{ ...type.micro, color: color.onBrand, opacity: 0.85 }}>
            VOLTEX DELIVERY
          </Text>
        </View>
        <Text style={{ ...type.hero, color: color.onBrand }}>Delivery by tomorrow</Text>
      </Animated.View>

      <SearchField />
    </View>
  );
}

/**
 * The pinned bar that fades in once the tall header has scrolled past, so search
 * is always one tap away. Pointer events are disabled while it's invisible,
 * otherwise it would swallow taps meant for the header underneath.
 */
export function CompactHeader({ scrollY }: { scrollY: SharedValue<number> }) {
  const insets = useSafeAreaInsets();

  const barStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.get(),
      [HEADER_COLLAPSE_DISTANCE * 0.6, HEADER_COLLAPSE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity: progress,
      transform: [{ translateY: interpolate(progress, [0, 1], [-8, 0]) }],
      pointerEvents: progress > 0.5 ? "auto" : "none",
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: color.brand,
          paddingTop: insets.top + space.sm,
          paddingHorizontal: space.xl,
          paddingBottom: space.md,
          borderBottomLeftRadius: radius.lg,
          borderBottomRightRadius: radius.lg,
        },
        barStyle,
      ]}
    >
      <SearchField height={38} />
    </Animated.View>
  );
}
