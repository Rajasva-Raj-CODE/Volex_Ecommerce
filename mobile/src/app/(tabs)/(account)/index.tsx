import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";
import { PressableScale } from "../../../components/PressableScale";
import { useAuth } from "../../../context/AuthProvider";
import { useWishlist } from "../../../context/WishlistProvider";
import { Icon, type IconName } from "../../../design/Icon";
import { selectionFeedback, tapFeedback } from "../../../design/haptics";
import { color, radius, shadow, space, type } from "../../../design/tokens";

function Row({
  icon,
  label,
  value,
  onPress,
  destructive,
}: {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const tint = destructive ? color.destructive : color.label;

  return (
    <PressableScale
      accessibilityRole="button"
      activeScale={0.98}
      disabled={!onPress}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: space.lg,
        paddingVertical: space.lg,
        paddingHorizontal: space.xl,
      }}
    >
      <Icon name={icon} size={18} color={destructive ? color.destructive : color.secondaryLabel} />
      <Text style={{ ...type.body, color: tint, flex: 1 }}>{label}</Text>
      {value ? <Text style={{ ...type.meta, color: color.secondaryLabel }}>{value}</Text> : null}
      {onPress && !destructive ? (
        <Icon name="chevronRight" size={12} color={color.tertiaryLabel} />
      ) : null}
    </PressableScale>
  );
}

export default function AccountScreen() {
  const router = useRouter();
  const { user, signedIn, signOut } = useAuth();
  const { wishlist } = useWishlist();

  if (!signedIn) {
    return (
      <View style={{ flex: 1, padding: space.xl, gap: space.xl, backgroundColor: color.canvas }}>
        <View style={{ gap: space.sm, paddingTop: space.xxl }}>
          <Text style={{ ...type.hero, color: color.label }}>You&apos;re browsing as a guest</Text>
          <Text style={{ ...type.body, color: color.secondaryLabel }}>
            Sign in to use your cart, save items and track orders.
          </Text>
        </View>

        <PressableScale
          activeScale={0.97}
          onPress={() => {
            tapFeedback();
            router.push("/sign-in");
          }}
          style={{
            height: 48,
            borderRadius: radius.md,
            backgroundColor: color.brand,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ ...type.action, color: color.onBrand }}>Sign in or create account</Text>
        </PressableScale>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: color.canvas }}
      contentContainerStyle={{ padding: space.xl, gap: space.xl }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space.lg,
          backgroundColor: color.card,
          borderRadius: radius.lg,
          padding: space.xl,
          ...shadow,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: radius.pill,
            backgroundColor: color.brandWash,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ ...type.title, color: color.brand }}>
            {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ ...type.section, color: color.label }}>{user?.name ?? "VolteX customer"}</Text>
          <Text style={{ ...type.meta, color: color.secondaryLabel }}>{user?.email}</Text>
        </View>
      </View>

      <View style={{ backgroundColor: color.card, borderRadius: radius.lg, ...shadow }}>
        <Row
          icon="heart"
          label="Wishlist"
          value={wishlist.itemCount ? String(wishlist.itemCount) : undefined}
          onPress={() => {
            tapFeedback();
            router.push("/(tabs)/(account)/wishlist");
          }}
        />
        <View style={{ height: 1, backgroundColor: color.separator, marginLeft: 50 }} />
        <Row icon="signOut" label="Sign out" destructive onPress={() => {
          selectionFeedback();
          Alert.alert("Sign out?", "You'll need to sign in again to use your cart.", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign out", style: "destructive", onPress: () => void signOut() },
          ]);
        }} />
      </View>

      <Text style={{ ...type.micro, color: color.tertiaryLabel, fontWeight: "400", textAlign: "center" }}>
        Orders, addresses and profile editing land with checkout.
      </Text>
    </ScrollView>
  );
}
