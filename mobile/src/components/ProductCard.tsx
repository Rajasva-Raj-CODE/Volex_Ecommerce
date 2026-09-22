import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { Icon } from "../design/Icon";
import { tapFeedback } from "../design/haptics";
import { color, radius, shadow, space, type } from "../design/tokens";
import { AddToCartControl } from "./AddToCartControl";
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

  const open = () => {
    tapFeedback();
    router.push(`/product/${product.slug}`);
  };

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
          overflow: "hidden",
        }}
        className="items-center justify-center"
      >
        {/* Product shots are mostly cut-outs on white; a flat grey square makes
            them look pasted on. A soft vertical wash seats them instead. */}
        <LinearGradient
          colors={["#FFFFFF", color.well]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        {image ? (
          <Image
            source={image}
            placeholder={BLUR_PLACEHOLDER}
            contentFit="contain"
            transition={220}
            style={{ width: "86%", height: "86%" }}
          />
        ) : (
          <Icon name="photo" size={22} color={color.tertiaryLabel} />
        )}

        {off ? (
          <View
            style={{
              position: "absolute",
              top: space.sm,
              left: space.sm,
              backgroundColor: color.ribbon,
              paddingHorizontal: space.md,
              paddingVertical: 3,
              borderRadius: radius.pill,
            }}
          >
            <Text style={{ ...type.micro, color: "#FFFFFF" }}>{off}% OFF</Text>
          </View>
        ) : null}
      </View>

      {/* Fixed height: a one-line and a two-line name would otherwise leave the
          price/ADD rows at different heights across a grid row. */}
      <View style={{ gap: space.xs, height: 74 }}>
        <View style={{ gap: space.xs }} className="flex-row items-center">
          <Icon name="clock" size={9} color={color.tertiaryLabel} />
          <Text style={{ ...type.micro, color: color.tertiaryLabel, fontWeight: "400" }}>
            {product.deliveryDate ?? "Tomorrow"}
          </Text>
        </View>

        <Text numberOfLines={2} style={{ ...type.cardTitle, color: color.label, flex: 1 }}>
          {product.name}
        </Text>

        <View style={{ gap: space.sm }} className="flex-row items-center">
          {product.brand ? (
            <Text
              style={{ ...type.meta, color: color.secondaryLabel, flexShrink: 1 }}
              numberOfLines={1}
            >
              {product.brand}
            </Text>
          ) : null}
          {rating ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
                backgroundColor: color.positiveWash,
                paddingHorizontal: space.sm,
                paddingVertical: 1,
                borderRadius: radius.sm,
              }}
            >
              <Icon name="star" size={9} color={color.positive} />
              <Text style={{ ...type.micro, color: color.positive }}>{rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Price left, action right — the row a shopper's thumb lands on. */}
      <View className="flex-row items-end justify-between">
        <View style={{ flex: 1, gap: 1 }}>
          <Text style={{ ...type.price, color: color.label }} numberOfLines={1}>
            {formatPrice(product.price)}
          </Text>
          {off ? (
            <Text
              style={{
                ...type.micro,
                fontWeight: "400",
                color: color.tertiaryLabel,
                textDecorationLine: "line-through",
              }}
              numberOfLines={1}
            >
              {formatPrice(product.mrp)}
            </Text>
          ) : null}
        </View>

        <AddToCartControl productId={product.id} stock={product.stock} />
      </View>
    </PressableScale>
  );
}
