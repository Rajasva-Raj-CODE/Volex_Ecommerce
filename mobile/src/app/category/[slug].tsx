import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { ProductCard } from "../../components/ProductCard";
import { ProductGridSkeleton } from "../../components/Skeleton";
import { EmptyState, ErrorState, LoadingState } from "../../components/States";
import { duration } from "../../design/motion";
import { color, space, type } from "../../design/tokens";
import { useAsync } from "../../hooks/useAsync";
import { getCategory, listProducts } from "../../lib/catalog-api";

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const cardWidth = (width - space.xl * 2 - space.lg) / 2;

  const category = useAsync((signal) => getCategory(slug, signal), [slug]);

  // A category shows its own products *and* its children's — that's what the
  // comma-separated `categoryIds` filter is for.
  const categoryIds = category.data
    ? [category.data.id, ...(category.data.children ?? []).map((c) => c.id)].join(",")
    : undefined;

  const products = useAsync(
    (signal) => (categoryIds ? listProducts({ categoryIds, limit: 40 }, signal) : Promise.resolve(null)),
    [categoryIds]
  );

  if (category.loading) return <LoadingState />;
  if (category.error) return <ErrorState message={category.error} onRetry={category.reload} />;

  const items = products.data?.products ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: color.canvas }}>
      <Stack.Screen options={{ title: category.data?.name ?? "Category" }} />

      {products.loading ? (
        <ProductGridSkeleton width={cardWidth} />
      ) : products.error ? (
        <ErrorState message={products.error} onRetry={products.reload} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          hint={`No products in ${category.data?.name ?? "this category"} right now.`}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: space.lg, paddingHorizontal: space.xl }}
          contentContainerStyle={{ gap: space.lg, paddingVertical: space.lg }}
          ListHeaderComponent={
            <Text
              style={{ ...type.meta, color: color.secondaryLabel, paddingHorizontal: space.xl }}
            >
              {products.data?.pagination.total ?? items.length} products
            </Text>
          }
          renderItem={({ item, index }) => (
            <Animated.View
              entering={
                reduced
                  ? undefined
                  : FadeIn.duration(duration.quick).delay(Math.min(index, 7) * 40)
              }
            >
              <ProductCard product={item} width={cardWidth} />
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}
