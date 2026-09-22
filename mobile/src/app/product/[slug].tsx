import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, ScrollView, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableScale } from "../../components/PressableScale";
import { ErrorState, LoadingState } from "../../components/States";
import { Icon } from "../../design/Icon";
import { selectionFeedback } from "../../design/haptics";
import { STAGGER_STEP, duration, timing } from "../../design/motion";
import { color, radius, shadow, space, type } from "../../design/tokens";
import { useAsync } from "../../hooks/useAsync";
import { getProduct, listProductReviews } from "../../lib/catalog-api";
import { discountPercent, formatPrice, ratingValue } from "../../lib/format";

/**
 * White card block on the light canvas — the quick-commerce grouping unit.
 * Cards rise in sequence so the page assembles downward instead of snapping in.
 */
function Card({
  title,
  index,
  reduced,
  children,
}: {
  title?: string;
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
      style={{
        backgroundColor: color.card,
        borderRadius: radius.lg,
        padding: space.xl,
        gap: space.lg,
        ...shadow,
      }}
    >
      {title ? <Text style={{ ...type.section, color: color.label }}>{title}</Text> : null}
      {children}
    </Animated.View>
  );
}

/**
 * Gallery page indicator. The active dot stretches into a pill rather than the
 * set hard-cutting, so the swipe reads as continuous.
 */
function GalleryDot({ active }: { active: boolean }) {
  const style = useAnimatedStyle(() => ({
    width: withTiming(active ? 16 : 5, timing),
    backgroundColor: withTiming(active ? color.brand : color.border, timing),
  }));

  return <Animated.View style={[{ height: 5, borderRadius: radius.pill }, style]} />;
}

function SpecRow({ label, value, last }: { label: string; value: string; last: boolean }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: space.lg,
        paddingVertical: space.md,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: color.separator,
      }}
    >
      <Text style={{ ...type.meta, color: color.secondaryLabel, width: "40%" }}>{label}</Text>
      <Text style={{ ...type.meta, color: color.label, flex: 1 }}>{value}</Text>
    </View>
  );
}

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const [activeImage, setActiveImage] = useState(0);

  const product = useAsync((signal) => getProduct(slug, signal), [slug]);
  const productId = product.data?.id;

  const reviews = useAsync(
    (signal) => (productId ? listProductReviews(productId, signal) : Promise.resolve(null)),
    [productId]
  );

  if (product.loading) return <LoadingState />;
  if (product.error || !product.data) {
    return <ErrorState message={product.error ?? "Product not found"} onRetry={product.reload} />;
  }

  const p = product.data;
  const off = discountPercent(p.price, p.mrp);
  const rating = ratingValue(p.rating);
  const images = p.images?.length ? p.images : [];
  const soldOut = p.stock <= 0;
  const savings = off ? Number(p.mrp) - Number(p.price) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: color.canvas }}>
      <Stack.Screen options={{ title: p.name }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: space.xxl * 4, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: color.card }}>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={images.length ? images : [null]}
            keyExtractor={(item, i) => item ?? `placeholder-${i}`}
            onMomentumScrollEnd={(e) =>
              setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            renderItem={({ item }) => (
              <View style={{ width, height: width * 0.9 }} className="items-center justify-center">
                {item ? (
                  <Image
                    source={item}
                    contentFit="contain"
                    transition={200}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Icon name="photo" size={30} color={color.tertiaryLabel} />
                )}
              </View>
            )}
          />
          {images.length > 1 ? (
            <View
              style={{ gap: 5, paddingBottom: space.lg }}
              className="flex-row items-center justify-center"
            >
              {images.map((src, i) => (
                <GalleryDot key={src} active={i === activeImage} />
              ))}
            </View>
          ) : null}
        </View>

        <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
          <Card index={0} reduced={reduced}>
            {p.brand ? (
              <Text style={{ ...type.meta, color: color.secondaryLabel }}>{p.brand}</Text>
            ) : null}
            <Text style={{ ...type.title, color: color.label }}>{p.name}</Text>

            {rating || p.reviewCount ? (
              <View style={{ gap: space.md }} className="flex-row items-center">
                {rating ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                      backgroundColor: color.positiveWash,
                      paddingHorizontal: space.md,
                      paddingVertical: 3,
                      borderRadius: radius.sm,
                    }}
                  >
                    <Icon name="star" size={10} color={color.positive} />
                    <Text style={{ ...type.micro, color: color.positive }}>
                      {rating.toFixed(1)}
                    </Text>
                  </View>
                ) : null}
                {p.reviewCount ? (
                  <Text style={{ ...type.meta, color: color.secondaryLabel }}>
                    {p.reviewCount} {p.reviewCount === 1 ? "review" : "reviews"}
                  </Text>
                ) : null}
              </View>
            ) : null}

            <View style={{ gap: space.md }} className="flex-row items-baseline">
              <Text style={{ ...type.hero, color: color.label }}>{formatPrice(p.price)}</Text>
              {off ? (
                <Text
                  style={{
                    ...type.body,
                    color: color.tertiaryLabel,
                    textDecorationLine: "line-through",
                  }}
                >
                  {formatPrice(p.mrp)}
                </Text>
              ) : null}
            </View>

            {off ? (
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: color.positiveWash,
                  paddingHorizontal: space.lg,
                  paddingVertical: space.sm,
                  borderRadius: radius.sm,
                }}
              >
                <Text style={{ ...type.action, color: color.positive }}>
                  You save {formatPrice(savings)} ({off}% off)
                </Text>
              </View>
            ) : null}

            <View style={{ gap: space.md }} className="flex-row items-center">
              <Icon name="clock" size={13} color={color.secondaryLabel} />
              <Text style={{ ...type.meta, color: color.secondaryLabel }}>
                Delivery by {p.deliveryDate ?? "tomorrow"}
                {p.deliveryFee ? ` · ${p.deliveryFee}` : ""}
              </Text>
            </View>

            <Text
              style={{ ...type.meta, color: soldOut ? color.destructive : color.positive }}
            >
              {soldOut ? "Out of stock" : `In stock — ${p.stock} left`}
            </Text>
          </Card>

          {p.highlights?.length ? (
            <Card title="Highlights" index={1} reduced={reduced}>
              <View style={{ gap: space.md }}>
                {p.highlights.map((h, i) => (
                  <View key={i} style={{ gap: space.md }} className="flex-row">
                    <Text style={{ ...type.body, color: color.brand }}>•</Text>
                    <Text style={{ ...type.body, color: color.secondaryLabel, flex: 1 }}>
                      {h.text}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          ) : null}

          {p.variants?.length ? (
            <Card title="Options" index={2} reduced={reduced}>
              <View style={{ gap: space.xl }}>
                {p.variants.map((group) => (
                  <View key={group.name} style={{ gap: space.md }}>
                    <Text style={{ ...type.meta, color: color.secondaryLabel }}>{group.name}</Text>
                    <View style={{ gap: space.md }} className="flex-row flex-wrap">
                      {group.options.map((opt) => (
                        <PressableScale
                          key={opt.label}
                          onPress={selectionFeedback}
                          activeScale={0.94}
                          android_ripple={{ color: color.brandWash }}
                          style={{
                            paddingHorizontal: space.xl,
                            paddingVertical: space.md,
                            borderRadius: radius.md,
                            borderWidth: 1,
                            borderColor: opt.selected ? color.brand : color.border,
                            backgroundColor: opt.selected ? color.brandWash : color.card,
                          }}
                        >
                          <Text
                            style={{
                              ...type.meta,
                              color: opt.selected ? color.brand : color.label,
                            }}
                          >
                            {opt.label}
                          </Text>
                        </PressableScale>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          ) : null}

          {p.bankOffers?.length ? (
            <Card title="Bank offers" index={3} reduced={reduced}>
              <View style={{ gap: space.md }}>
                {p.bankOffers.map((offer) => (
                  <View
                    key={offer.id}
                    style={{
                      borderRadius: radius.md,
                      borderWidth: 1,
                      borderColor: color.separator,
                      backgroundColor: color.canvas,
                      padding: space.lg,
                      gap: space.xs,
                    }}
                  >
                    <View style={{ gap: space.md }} className="flex-row items-center">
                      <Icon name="offer" size={13} color={color.brand} />
                      <Text style={{ ...type.action, color: color.label }}>{offer.bank}</Text>
                    </View>
                    <Text style={{ ...type.meta, color: color.secondaryLabel }}>
                      {offer.description}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          ) : null}

          {p.specGroups?.length ? (
            <Card title="Specifications" index={4} reduced={reduced}>
              <View style={{ gap: space.xl }}>
                {p.specGroups.map((group) => (
                  <View key={group.groupName}>
                    <Text style={{ ...type.meta, color: color.secondaryLabel }}>
                      {group.groupName}
                    </Text>
                    {group.specs.map((spec, i) => (
                      <SpecRow
                        key={spec.label}
                        label={spec.label}
                        value={spec.value}
                        last={i === group.specs.length - 1}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </Card>
          ) : null}

          <Card
            title={`Reviews${reviews.data ? ` (${reviews.data.totalReviews})` : ""}`}
            index={5}
            reduced={reduced}
          >
            {reviews.loading ? (
              <Text style={{ ...type.meta, color: color.tertiaryLabel }}>Loading reviews…</Text>
            ) : reviews.error ? (
              <Text style={{ ...type.meta, color: color.tertiaryLabel }}>
                Couldn&apos;t load reviews.
              </Text>
            ) : !reviews.data?.reviews.length ? (
              <Text style={{ ...type.meta, color: color.tertiaryLabel }}>No reviews yet.</Text>
            ) : (
              <View style={{ gap: space.lg }}>
                {reviews.data.reviews.slice(0, 5).map((review) => (
                  <View
                    key={review.id}
                    style={{
                      borderRadius: radius.md,
                      backgroundColor: color.canvas,
                      padding: space.lg,
                      gap: space.xs,
                    }}
                  >
                    <View style={{ gap: space.md }} className="flex-row items-center">
                      <View style={{ gap: 2 }} className="flex-row items-center">
                        <Icon name="star" size={10} color={color.positive} />
                        <Text style={{ ...type.micro, color: color.label }}>{review.rating}</Text>
                      </View>
                      <Text style={{ ...type.meta, color: color.secondaryLabel }}>
                        {review.user?.name ?? "Verified buyer"}
                      </Text>
                    </View>
                    {review.comment ? (
                      <Text style={{ ...type.meta, color: color.secondaryLabel }}>
                        {review.comment}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </Card>
        </View>
      </ScrollView>

      {/*
        Sticky buy bar — the quick-commerce close. Cart isn't built yet
        (browse-only milestone), so the action is disabled rather than faked.
      */}
      <Animated.View
        // Slides up once the page has settled, so it reads as arriving rather
        // than having been there through the load.
        entering={reduced ? undefined : FadeInUp.duration(duration.entrance).delay(180)}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: "row",
          alignItems: "center",
          gap: space.xl,
          paddingHorizontal: space.xl,
          paddingTop: space.lg,
          paddingBottom: insets.bottom + space.lg,
          backgroundColor: color.card,
          borderTopWidth: 1,
          borderTopColor: color.separator,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ ...type.price, color: color.label }}>{formatPrice(p.price)}</Text>
          {off ? (
            <Text style={{ ...type.micro, color: color.positive, fontWeight: "400" }}>
              {off}% off
            </Text>
          ) : null}
        </View>

        <PressableScale
          disabled
          activeScale={0.97}
          style={{
            flex: 1.6,
            height: 46,
            borderRadius: radius.md,
            backgroundColor: color.well,
            flexDirection: "row",
            gap: space.md,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="cart" size={15} color={color.tertiaryLabel} />
          <Text style={{ ...type.action, color: color.tertiaryLabel }}>
            {soldOut ? "Out of stock" : "Add to cart"}
          </Text>
        </PressableScale>
      </Animated.View>
    </View>
  );
}
