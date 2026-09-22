import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { Icon } from "../design/Icon";
import { selectionFeedback, tapFeedback } from "../design/haptics";
import { springPop } from "../design/motion";
import { color, radius, shadow, space, type } from "../design/tokens";
import { PressableScale } from "./PressableScale";
import type { ApiProduct } from "../lib/catalog-api";
import { discountPercent, formatPrice, ratingValue } from "../lib/format";

const BLUR_PLACEHOLDER = "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQfQfQfQfQfQfQfQ";

/**
 * Quick-commerce product card: discount ribbon, square image well, two-line
 * name, delivery hint, then a price/ADD row pinned to the bottom.
 *
 * The ADD button is the signature element — an outlined action that sits *in*
 * the card so a customer never has to open the detail page to buy. Cart isn't
 * built yet (browse-only milestone), so it currently routes into the product
 * page rather than pretending to add.
 */
export function ProductCard({ product, width }: { product: ApiProduct; width?: number }) {
  const router = useRouter();
  const off = discountPercent(product.price, product.mrp);
  const rating = ratingValue(product.rating);
  const image = product.images?.[0];
  const soldOut = product.stock <= 0;

  const open = () => {
    tapFeedback();
    router.push(`/product/${product.slug}`);
  };

  // ADD gives a quick pop on tap — a confirming beat that a colour change alone
  // doesn't provide. Runs on the UI thread, so navigation can't stutter it.
  const addScale = useSharedValue(1);
  const addStyle = useAnimatedStyle(() => ({ transform: [{ scale: addScale.get() }] }));

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}`}
      onPress={open}
      activeScale={0.97}
      android_ripple={{ color: color.well }}
      style={{
        width,
        borderRadius: radius.lg,
        backgroundColor: color.card,
        borderWidth: 1,
        borderColor: color.separator,
        padding: space.md,
        gap: space.md,
        ...shadow,
      }}
    >
      <View
        style={{
          aspectRatio: 1,
          borderRadius: radius.md,
          backgroundColor: color.well,
          overflow: "hidden",
        }}
        className="items-center justify-center"
      >
        {image ? (
          <Image
            source={image}
            placeholder={BLUR_PLACEHOLDER}
            contentFit="contain"
            transition={200}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Icon name="photo" size={22} color={color.tertiaryLabel} />
        )}

        {off ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: color.ribbon,
              paddingHorizontal: space.sm,
              paddingVertical: 2,
              borderBottomRightRadius: radius.sm,
            }}
          >
            <Text style={{ ...type.micro, color: "#FFFFFF" }}>{off}% OFF</Text>
          </View>
        ) : null}
      </View>

      <View style={{ gap: 2 }}>
        <View style={{ gap: space.xs }} className="flex-row items-center">
          <Icon name="clock" size={9} color={color.tertiaryLabel} />
          <Text style={{ ...type.micro, color: color.tertiaryLabel, fontWeight: "400" }}>
            {product.deliveryDate ?? "Tomorrow"}
          </Text>
        </View>

        <Text numberOfLines={2} style={{ ...type.cardTitle, color: color.label }}>
          {product.name}
        </Text>

        <View style={{ gap: space.sm, minHeight: 15 }} className="flex-row items-center">
          {product.brand ? (
            <Text style={{ ...type.meta, color: color.secondaryLabel }} numberOfLines={1}>
              {product.brand}
            </Text>
          ) : null}
          {rating ? (
            <View style={{ gap: 2 }} className="flex-row items-center">
              <Icon name="star" size={9} color={color.positive} />
              <Text style={{ ...type.meta, color: color.secondaryLabel }}>
                {rating.toFixed(1)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Price left, action right — the row a shopper's thumb lands on. */}
      <View className="flex-row items-end justify-between">
        <View style={{ flex: 1 }}>
          <Text style={{ ...type.price, color: color.label }} numberOfLines={1}>
            {formatPrice(product.price)}
          </Text>
          {off ? (
            <Text
              style={{
                ...type.meta,
                color: color.tertiaryLabel,
                textDecorationLine: "line-through",
              }}
              numberOfLines={1}
            >
              {formatPrice(product.mrp)}
            </Text>
          ) : null}
        </View>

        <Animated.View style={addStyle}>
          <PressableScale
            disabled={soldOut}
            accessibilityRole="button"
            accessibilityLabel={soldOut ? "Out of stock" : `View ${product.name}`}
            activeScale={0.92}
            onPress={() => {
              selectionFeedback();
              // `.set()` rather than `.value =` — the React Compiler lint treats
              // direct assignment as mutating an immutable binding.
              addScale.set(
                withSequence(withSpring(1.12, springPop), withSpring(1, springPop))
              );
              open();
            }}
            android_ripple={{ color: color.brandWash }}
            style={{
              minWidth: 62,
              height: 30,
              paddingHorizontal: space.lg,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: soldOut ? color.border : color.brand,
              backgroundColor: color.card,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ ...type.action, color: soldOut ? color.tertiaryLabel : color.brand }}
            >
              {soldOut ? "SOLD" : "ADD"}
            </Text>
          </PressableScale>
        </Animated.View>
      </View>
    </PressableScale>
  );
}
