import { FlatList, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { ProductCard } from "../../../components/ProductCard";
import { EmptyState, LoadingState } from "../../../components/States";
import { useWishlist } from "../../../context/WishlistProvider";
import { duration } from "../../../design/motion";
import { color, space } from "../../../design/tokens";
import type { ApiProduct } from "../../../lib/catalog-api";

export default function WishlistScreen() {
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const { wishlist, loading } = useWishlist();
  const cardWidth = (width - space.xl * 2 - space.lg) / 2;

  if (loading && wishlist.items.length === 0) return <LoadingState />;

  if (wishlist.items.length === 0) {
    return <EmptyState title="Nothing saved yet" hint="Tap the heart on a product to keep it here." />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.canvas }}>
      <FlatList
        data={wishlist.items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: space.lg, paddingHorizontal: space.xl }}
        contentContainerStyle={{ gap: space.lg, paddingVertical: space.lg }}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={reduced ? undefined : FadeIn.duration(duration.quick).delay(Math.min(index, 7) * 40)}
          >
            {/*
              The wishlist endpoint returns a trimmed product (no rating, specs
              or delivery date), so it's widened to the card's shape with the
              fields it actually reads.
            */}
            <ProductCard product={item.product as unknown as ApiProduct} width={cardWidth} />
          </Animated.View>
        )}
      />
    </View>
  );
}
