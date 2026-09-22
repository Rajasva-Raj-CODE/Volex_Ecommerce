import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { FlatList, RefreshControl, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
} from "react-native-reanimated";
import { PressableScale } from "../../../components/PressableScale";
import { ProductCard } from "../../../components/ProductCard";
import {
  CategoryGridSkeleton,
  ProductRailSkeleton,
} from "../../../components/Skeleton";
import { EmptyState, ErrorState } from "../../../components/States";
import { CompactHeader, StoreHeader } from "../../../components/StoreHeader";
import { Icon } from "../../../design/Icon";
import { tapFeedback } from "../../../design/haptics";
import { STAGGER_STEP, duration } from "../../../design/motion";
import { color, radius, space, type } from "../../../design/tokens";
import { useAsync } from "../../../hooks/useAsync";
import { listCategories, listProducts, type ApiProduct } from "../../../lib/catalog-api";

const RAIL_CARD_WIDTH = 152;
const CATEGORY_COLUMNS = 4;

/** Section header: title left, "See all" affordance right. */
function SectionHeader({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <View
      style={{ paddingHorizontal: space.xl, marginBottom: space.lg }}
      className="flex-row items-center justify-between"
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
        <View
          style={{
            width: 3,
            height: 16,
            borderRadius: radius.pill,
            backgroundColor: color.brand,
          }}
        />
        <Text style={{ ...type.section, color: color.label }}>{title}</Text>
      </View>
      {onPress ? (
        <PressableScale
          onPress={onPress}
          activeScale={0.94}
          hitSlop={space.lg}
          style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
        >
          <Text style={{ ...type.action, color: color.brand }}>See all</Text>
          <Icon name="chevronRight" size={11} color={color.brand} />
        </PressableScale>
      ) : null}
    </View>
  );
}

/**
 * Sections rise into place one after another, so the page reads top-to-bottom
 * instead of appearing all at once. `index` sets the stagger offset.
 *
 * Gated on Reduce Motion: entering builders can't opt out on their own the way
 * the spring configs in motion.ts do, so the caller has to check.
 */
function Section({
  index,
  reduced,
  children,
}: {
  index: number;
  reduced: boolean;
  children: React.ReactNode;
}) {
  return (
    <Animated.View
      entering={
        reduced
          ? undefined
          : FadeInDown.duration(duration.entrance).delay(index * STAGGER_STEP)
      }
    >
      {children}
    </Animated.View>
  );
}

function ProductRail({ products }: { products: ApiProduct[] }) {
  return (
    <FlatList
      horizontal
      data={products}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: space.xl, gap: space.lg }}
      renderItem={({ item }) => <ProductCard product={item} width={RAIL_CARD_WIDTH} />}
    />
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();

  // Drives the header parallax and the pinned compact bar. A shared value keeps
  // the whole thing on the UI thread — no re-render per scroll frame.
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });

  // A fixed 4-up grid, the quick-commerce category pattern.
  const tileWidth =
    (width - space.xl * 2 - space.lg * (CATEGORY_COLUMNS - 1)) / CATEGORY_COLUMNS;

  const categories = useAsync((signal) => listCategories(signal), []);
  const newest = useAsync(
    (signal) => listProducts({ limit: 10, sortBy: "createdAt", sortOrder: "desc" }, signal),
    []
  );
  const deals = useAsync(
    (signal) => listProducts({ limit: 10, sortBy: "price", sortOrder: "asc", inStock: true }, signal),
    []
  );

  const loading = categories.loading || newest.loading || deals.loading;
  const error = categories.error ?? newest.error ?? deals.error;
  const firstLoad = loading && !newest.data;

  const reloadAll = useCallback(() => {
    categories.reload();
    newest.reload();
    deals.reload();
  }, [categories, newest, deals]);

  const topCategories = (categories.data ?? []).filter((c) => c.isActive).slice(0, 8);
  const newProducts = newest.data?.products ?? [];
  const dealProducts = deals.data?.products ?? [];

  // Built as an element, not a nested component: declaring a component inside
  // render gives it a new type every pass, which remounts the whole subtree.
  let body: React.ReactNode;

  if (firstLoad) {
    // Skeletons in the real layout, so nothing jumps when the data lands.
    body = (
      <View style={{ gap: space.xxl, paddingTop: space.xl }}>
        <View style={{ gap: space.lg }}>
          <View style={{ paddingHorizontal: space.xl }}>
            <Text style={{ ...type.section, color: color.label }}>Shop by category</Text>
          </View>
          <CategoryGridSkeleton tileWidth={tileWidth} />
        </View>
        <View style={{ gap: space.lg }}>
          <View style={{ paddingHorizontal: space.xl }}>
            <Text style={{ ...type.section, color: color.label }}>Best value</Text>
          </View>
          <ProductRailSkeleton width={RAIL_CARD_WIDTH} />
        </View>
      </View>
    );
  } else if (error && !newest.data) {
    body = <ErrorState message={error} onRetry={reloadAll} />;
  } else if (!newProducts.length && !dealProducts.length) {
    body = (
      <EmptyState
        title="Nothing to show yet"
        hint="Add some products in the admin dashboard and they'll appear here."
      />
    );
  } else {
    body = (
      <View style={{ gap: space.xxl, paddingTop: space.xl }}>
        {topCategories.length ? (
          <Section index={0} reduced={reduced}>
            <SectionHeader title="Shop by category" />
            <View
              style={{
                paddingHorizontal: space.xl,
                gap: space.lg,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {topCategories.map((item, i) => (
                <Animated.View
                  key={item.id}
                  entering={
                    reduced ? undefined : FadeIn.duration(duration.quick).delay(i * 40)
                  }
                >
                  <PressableScale
                    activeScale={0.92}
                    onPress={() => {
                      tapFeedback();
                      router.push(`/category/${item.slug}`);
                    }}
                    android_ripple={{ color: color.well }}
                    style={{ width: tileWidth, gap: space.sm, alignItems: "center" }}
                  >
                    <View
                      style={{
                        width: tileWidth,
                        height: tileWidth,
                        borderRadius: radius.lg,
                        backgroundColor: color.brandWash,
                        borderWidth: 1,
                        borderColor: color.separator,
                        overflow: "hidden",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.imageUrl ? (
                        <Image
                          source={item.imageUrl}
                          contentFit="cover"
                          transition={250}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <Text style={{ ...type.title, color: color.brand }}>
                          {item.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <Text
                      numberOfLines={2}
                      style={{
                        ...type.micro,
                        fontWeight: "500",
                        color: color.label,
                        textAlign: "center",
                        // Reserves two lines so tiles in a row bottom-align
                        // whether their label wraps or not.
                        height: 28,
                      }}
                    >
                      {item.name}
                    </Text>
                  </PressableScale>
                </Animated.View>
              ))}
            </View>
          </Section>
        ) : null}

        {dealProducts.length ? (
          <Section index={1} reduced={reduced}>
            <SectionHeader title="Best value" onPress={() => router.push("/(tabs)/(search)")} />
            <ProductRail products={dealProducts} />
          </Section>
        ) : null}

        {newProducts.length ? (
          <Section index={2} reduced={reduced}>
            <SectionHeader title="New arrivals" onPress={() => router.push("/(tabs)/(search)")} />
            <ProductRail products={newProducts} />
          </Section>
        ) : null}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.canvas }}>
      {/* White status bar text over the teal header block. */}
      <StatusBar style="light" />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: space.xxl, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading && !firstLoad}
            onRefresh={reloadAll}
            tintColor={color.brand}
            progressViewOffset={80}
          />
        }
      >
        <StoreHeader scrollY={scrollY} />
        {body}
      </Animated.ScrollView>

      <CompactHeader scrollY={scrollY} />
    </View>
  );
}
