import { useRouter } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useAuth } from "../context/AuthProvider";
import { useCart } from "../context/CartProvider";
import { Icon } from "../design/Icon";
import { errorFeedback, selectionFeedback } from "../design/haptics";
import { springPop } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";
import { PressableScale } from "./PressableScale";

interface Props {
  productId: string;
  stock: number;
  /** "card" is the compact inline control; "bar" fills the sticky buy bar. */
  variant?: "card" | "bar";
}

/**
 * ADD, which becomes a − / quantity / + stepper once the product is in the cart.
 * The single most-tapped control in the app.
 *
 * Signed-out customers get routed to sign-in rather than a silent failure, and
 * the quantity is clamped to available stock so the server's own stock guard is
 * a backstop rather than the first line of defence.
 */
export function AddToCartControl({ productId, stock, variant = "card" }: Props) {
  const router = useRouter();
  const { signedIn } = useAuth();
  const { quantityOf, isPending, add, setQuantity } = useCart();
  const reduced = useReducedMotion();

  const quantity = quantityOf(productId);
  const busy = isPending(productId);
  const soldOut = stock <= 0;
  const atStockLimit = quantity >= stock;

  const pop = useSharedValue(1);
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.get() }] }));

  const bar = variant === "bar";
  const height = bar ? 46 : 30;
  const minWidth = bar ? undefined : 62;

  function celebrate() {
    if (reduced) return;
    pop.set(withSequence(withSpring(1.12, springPop), withSpring(1, springPop)));
  }

  async function onAdd() {
    if (!signedIn) {
      // Sign-in is required for the cart; send them there rather than failing.
      selectionFeedback();
      router.push("/sign-in");
      return;
    }
    if (soldOut || atStockLimit) {
      errorFeedback();
      return;
    }
    selectionFeedback();
    celebrate();
    try {
      await add(productId);
    } catch {
      errorFeedback();
    }
  }

  async function step(next: number) {
    if (next > stock) {
      errorFeedback();
      return;
    }
    selectionFeedback();
    try {
      await setQuantity(productId, next);
    } catch {
      errorFeedback();
    }
  }

  if (soldOut) {
    return (
      <View
        style={{
          minWidth,
          height,
          paddingHorizontal: space.lg,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: color.border,
          backgroundColor: color.card,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ ...type.action, color: color.tertiaryLabel }}>
          {bar ? "Out of stock" : "SOLD"}
        </Text>
      </View>
    );
  }

  if (quantity > 0) {
    return (
      <Animated.View
        entering={reduced ? undefined : FadeIn.duration(150)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          minWidth,
          height,
          flex: bar ? 1 : undefined,
          borderRadius: radius.md,
          backgroundColor: color.brand,
          overflow: "hidden",
        }}
      >
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={quantity === 1 ? "Remove from cart" : "Decrease quantity"}
          activeScale={0.88}
          disabled={busy}
          onPress={() => step(quantity - 1)}
          style={{ flex: 1, height: "100%", alignItems: "center", justifyContent: "center" }}
        >
          <Icon name={quantity === 1 ? "trash" : "minus"} size={bar ? 16 : 13} color={color.onBrand} />
        </PressableScale>

        <View style={{ minWidth: bar ? 40 : 22, alignItems: "center" }}>
          {busy ? (
            <ActivityIndicator size="small" color={color.onBrand} />
          ) : (
            <Text style={{ ...type.action, color: color.onBrand }}>{quantity}</Text>
          )}
        </View>

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Increase quantity"
          activeScale={0.88}
          disabled={busy || atStockLimit}
          onPress={() => step(quantity + 1)}
          style={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            opacity: atStockLimit ? 0.45 : 1,
          }}
        >
          <Icon name="plus" size={bar ? 16 : 13} color={color.onBrand} />
        </PressableScale>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[popStyle, bar ? { flex: 1 } : null]}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Add to cart"
        activeScale={0.92}
        disabled={busy}
        onPress={onAdd}
        android_ripple={{ color: color.brandWash }}
        style={{
          minWidth,
          height,
          paddingHorizontal: space.lg,
          borderRadius: radius.md,
          borderWidth: bar ? 0 : 1,
          borderColor: color.brand,
          backgroundColor: bar ? color.brand : color.card,
          flexDirection: "row",
          gap: space.md,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {busy ? (
          <ActivityIndicator size="small" color={bar ? color.onBrand : color.brand} />
        ) : (
          <>
            {bar ? <Icon name="cart" size={15} color={color.onBrand} /> : null}
            <Text style={{ ...type.action, color: bar ? color.onBrand : color.brand }}>
              {bar ? "Add to cart" : "ADD"}
            </Text>
          </>
        )}
      </PressableScale>
    </Animated.View>
  );
}
