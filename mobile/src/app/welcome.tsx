import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableScale } from "../components/PressableScale";
import { useOnboarding } from "../context/OnboardingProvider";
import { Icon, type IconName } from "../design/Icon";
import { tapFeedback } from "../design/haptics";
import { STAGGER_STEP, duration } from "../design/motion";
import { brandGradient, color, radius, shadowRaised, space, type } from "../design/tokens";

const MARK = require("../../assets/splash-icon.png");

const PITCH: { icon: IconName; title: string; body: string }[] = [
  { icon: "delivery", title: "Fast delivery", body: "Electronics at your door by tomorrow." },
  { icon: "offer", title: "Bank offers", body: "Extra savings on every major card." },
  { icon: "heart", title: "Save for later", body: "Build a wishlist and pick up where you left off." },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const { continueAsGuest } = useOnboarding();

  return (
    <LinearGradient
      colors={brandGradient}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar style="light" />

      <View
        style={{
          flex: 1,
          paddingTop: insets.top + space.xxl,
          paddingHorizontal: space.xxl,
          gap: space.xl,
          justifyContent: "center",
        }}
      >
        <Animated.View
          entering={reduced ? undefined : FadeIn.duration(duration.entrance)}
          style={{ gap: space.lg }}
        >
          <Image source={MARK} style={{ width: 64, height: 64 }} contentFit="contain" />
          <Text style={{ ...type.hero, color: color.onBrand }}>
            Electronics,{"\n"}delivered fast.
          </Text>
        </Animated.View>

        <View style={{ gap: space.xl, paddingTop: space.md }}>
          {PITCH.map((item, i) => (
            <Animated.View
              key={item.title}
              entering={
                reduced
                  ? undefined
                  : FadeInDown.duration(duration.entrance).delay(120 + i * STAGGER_STEP)
              }
              style={{ flexDirection: "row", gap: space.xl, alignItems: "center" }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.md,
                  backgroundColor: "rgba(255,255,255,0.18)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={item.icon} size={18} color={color.onBrand} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ ...type.action, color: color.onBrand }}>{item.title}</Text>
                <Text style={{ ...type.meta, color: color.onBrand, opacity: 0.8 }}>
                  {item.body}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      <Animated.View
        entering={reduced ? undefined : FadeInDown.duration(duration.entrance).delay(320)}
        style={{
          gap: space.lg,
          paddingHorizontal: space.xxl,
          paddingBottom: insets.bottom + space.xxl,
        }}
      >
        <PressableScale
          accessibilityRole="button"
          activeScale={0.97}
          onPress={() => {
            tapFeedback();
            router.push("/sign-in");
          }}
          style={{
            height: 50,
            borderRadius: radius.md,
            backgroundColor: color.card,
            alignItems: "center",
            justifyContent: "center",
            ...shadowRaised,
          }}
        >
          <Text style={{ ...type.action, color: color.brand }}>Sign in or create account</Text>
        </PressableScale>

        {/*
          The escape hatch. A hard auth wall on a storefront stops people
          seeing what's for sale, so browsing stays open and the cart is what
          actually requires an account.
        */}
        <PressableScale
          accessibilityRole="button"
          activeScale={0.97}
          onPress={() => {
            tapFeedback();
            void continueAsGuest();
          }}
          style={{
            height: 50,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.45)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ ...type.action, color: color.onBrand }}>Continue browsing</Text>
        </PressableScale>
      </Animated.View>
    </LinearGradient>
  );
}
