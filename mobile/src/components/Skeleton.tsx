import { useEffect } from "react";
import { View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { color, radius, space } from "../design/tokens";

/**
 * A pulsing placeholder in the shape of the content that's coming.
 *
 * Preferred over a spinner for the product grid: it tells the customer what
 * they're about to get and how much of it, so the layout doesn't jump when data
 * lands. Under Reduce Motion it holds a static tint instead of pulsing.
 */
function Shimmer({ style }: { style: ViewStyle | ViewStyle[] }) {
  const progress = useSharedValue(0.5);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    progress.set(
      withRepeat(withTiming(1, { duration: 750, easing: Easing.inOut(Easing.quad) }), -1, true)
    );
  }, [progress, reduced]);

  const animated = useAnimatedStyle(() => ({ opacity: progress.get() }));

  return <Animated.View style={[{ backgroundColor: color.well }, style, animated]} />;
}

/** One product card's worth of placeholder. */
export function ProductCardSkeleton({ width }: { width: number }) {
  return (
    <View
      style={{
        width,
        borderRadius: radius.lg,
        backgroundColor: color.card,
        borderWidth: 1,
        borderColor: color.separator,
        padding: space.md,
        gap: space.md,
      }}
    >
      <Shimmer style={{ width: "100%", aspectRatio: 1, borderRadius: radius.md }} />
      <View style={{ gap: space.sm }}>
        <Shimmer style={{ height: 10, width: "45%", borderRadius: radius.sm }} />
        <Shimmer style={{ height: 12, width: "90%", borderRadius: radius.sm }} />
        <Shimmer style={{ height: 12, width: "65%", borderRadius: radius.sm }} />
      </View>
      <View className="flex-row items-center justify-between">
        <Shimmer style={{ height: 14, width: 62, borderRadius: radius.sm }} />
        <Shimmer style={{ height: 30, width: 62, borderRadius: radius.md }} />
      </View>
    </View>
  );
}

/** A two-column grid of card skeletons, matching the search/category layout. */
export function ProductGridSkeleton({ width, count = 6 }: { width: number; count?: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: space.lg,
        paddingHorizontal: space.xl,
        paddingVertical: space.lg,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} width={width} />
      ))}
    </View>
  );
}

/** A horizontal rail of card skeletons, matching the home rails. */
export function ProductRailSkeleton({ width, count = 3 }: { width: number; count?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: space.lg, paddingHorizontal: space.xl }}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} width={width} />
      ))}
    </View>
  );
}

/** The 4-up category tile grid, as placeholders. */
export function CategoryGridSkeleton({ tileWidth, count = 8 }: { tileWidth: number; count?: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: space.lg,
        paddingHorizontal: space.xl,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ width: tileWidth, gap: space.sm, alignItems: "center" }}>
          <Shimmer style={{ width: tileWidth, height: tileWidth, borderRadius: radius.lg }} />
          <Shimmer style={{ height: 9, width: tileWidth * 0.7, borderRadius: radius.sm }} />
        </View>
      ))}
    </View>
  );
}
