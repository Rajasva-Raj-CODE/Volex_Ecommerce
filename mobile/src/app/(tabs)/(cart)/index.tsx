import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Text, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddToCartControl } from "../../../components/AddToCartControl";
import { PressableScale } from "../../../components/PressableScale";
import { EmptyState, ErrorState, LoadingState } from "../../../components/States";
import { useAuth } from "../../../context/AuthProvider";
import { useCart } from "../../../context/CartProvider";
import { Icon } from "../../../design/Icon";
import { tapFeedback } from "../../../design/haptics";
import { duration } from "../../../design/motion";
import { color, radius, shadow, space, type } from "../../../design/tokens";
import { formatPrice } from "../../../lib/format";
import type { CartItem } from "../../../lib/cart-api";

function Row({ item }: { item: CartItem }) {
  const router = useRouter();
  const image = item.product.images?.[0];

  return (
    <PressableScale
      activeScale={0.98}
      onPress={() => {
        tapFeedback();
        router.push(`/product/${item.product.slug}`);
      }}
      style={{
        flexDirection: "row",
        gap: space.lg,
        backgroundColor: color.card,
        borderRadius: radius.lg,
        padding: space.lg,
        ...shadow,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: radius.md,
          backgroundColor: color.well,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {image ? (
          <Image source={image} contentFit="contain" transition={200} style={{ width: "100%", height: "100%" }} />
        ) : (
          <Icon name="photo" size={18} color={color.tertiaryLabel} />
        )}
      </View>

      <View style={{ flex: 1, gap: space.sm, justifyContent: "space-between" }}>
        <View style={{ gap: 2 }}>
          {item.product.brand ? (
            <Text style={{ ...type.micro, color: color.tertiaryLabel, fontWeight: "400" }}>
              {item.product.brand}
            </Text>
          ) : null}
          <Text numberOfLines={2} style={{ ...type.cardTitle, color: color.label }}>
            {item.product.name}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text style={{ ...type.price, color: color.label }}>
            {formatPrice(Number(item.product.price) * item.quantity)}
          </Text>
          <AddToCartControl productId={item.productId} stock={item.product.stock} />
        </View>
      </View>
    </PressableScale>
  );
}

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const { signedIn } = useAuth();
  const { cart, loading, error, reload } = useCart();

  if (!signedIn) {
    return (
      <View style={{ flex: 1, gap: space.xl, backgroundColor: color.canvas }} className="items-center justify-center">
        <EmptyState title="Your cart is waiting" hint="Sign in to add items and check out." />
        <PressableScale
          activeScale={0.96}
          onPress={() => router.push("/sign-in")}
          style={{
            paddingHorizontal: space.xxl,
            paddingVertical: space.lg,
            borderRadius: radius.md,
            backgroundColor: color.brand,
          }}
        >
          <Text style={{ ...type.action, color: color.onBrand }}>Sign in</Text>
        </PressableScale>
      </View>
    );
  }

  if (loading && cart.items.length === 0) return <LoadingState label="Loading your cart…" />;
  if (error && cart.items.length === 0) return <ErrorState message={error} onRetry={reload} />;

  if (cart.items.length === 0) {
    return <EmptyState title="Your cart is empty" hint="Browse the store and tap ADD on anything you like." />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.canvas }}>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: space.xl, gap: space.lg, paddingBottom: 140 }}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={reduced ? undefined : FadeIn.duration(duration.quick).delay(Math.min(index, 7) * 40)}
          >
            <Row item={item} />
          </Animated.View>
        )}
        ListFooterComponent={
          error ? (
            <Text style={{ ...type.meta, color: color.destructive, textAlign: "center" }}>{error}</Text>
          ) : null
        }
      />

      {/* Checkout isn't built — the bar shows the real total but says so. */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          gap: space.lg,
          paddingHorizontal: space.xl,
          paddingTop: space.lg,
          paddingBottom: insets.bottom + space.lg,
          backgroundColor: color.card,
          borderTopWidth: 1,
          borderTopColor: color.separator,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Text style={{ ...type.meta, color: color.secondaryLabel }}>
            Subtotal · {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
          </Text>
          <Text style={{ ...type.title, color: color.label }}>{formatPrice(cart.subtotal)}</Text>
        </View>

        <View
          style={{
            height: 48,
            borderRadius: radius.md,
            backgroundColor: color.well,
            flexDirection: "row",
            gap: space.md,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="delivery" size={15} color={color.tertiaryLabel} />
          <Text style={{ ...type.action, color: color.tertiaryLabel }}>Checkout — coming soon</Text>
        </View>
      </View>
    </View>
  );
}
