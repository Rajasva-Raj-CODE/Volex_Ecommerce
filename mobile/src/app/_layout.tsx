import "../../global.css";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AnimatedSplash } from "../components/AnimatedSplash";
import { AuthProvider, useAuth } from "../context/AuthProvider";
import { CartProvider } from "../context/CartProvider";
import { OnboardingProvider, useOnboarding } from "../context/OnboardingProvider";
import { WishlistProvider } from "../context/WishlistProvider";
import { color, type } from "../design/tokens";

// Hold the native splash until the session and onboarding flag are read, so the
// first frame the customer sees is the right one — never a login screen that
// vanishes a beat later.
void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { restoring, signedIn } = useAuth();
  const { ready: onboardingReady, guestAccepted } = useOnboarding();

  const booted = !restoring && onboardingReady;
  const [splashDone, setSplashDone] = useState(false);

  // A signed-in customer, or one who chose to browse as a guest, goes straight in.
  const gateOpen = signedIn || guestAccepted;

  useEffect(() => {
    if (booted) void SplashScreen.hideAsync();
  }, [booted]);

  const onSplashFinish = useCallback(() => setSplashDone(true), []);

  // Nothing to draw yet — the native splash is still covering the window.
  if (!booted) return null;

  return (
    <View style={{ flex: 1, backgroundColor: color.canvas }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: color.card },
          headerTintColor: color.brand,
          headerTitleStyle: { color: color.label, fontSize: type.section.fontSize },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: color.canvas },
        }}
      >
        <Stack.Protected guard={gateOpen}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="product/[slug]"
            options={{ title: "", headerBackButtonDisplayMode: "minimal" }}
          />
          <Stack.Screen name="category/[slug]" options={{ title: "" }} />
        </Stack.Protected>

        <Stack.Protected guard={!gateOpen}>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Reachable from both sides: the gate and the in-app cart prompt. */}
        <Stack.Screen name="sign-in" options={{ presentation: "modal" }} />
      </Stack>

      {/* Drawn over the mounted app, then animates away. */}
      {splashDone ? null : <AnimatedSplash onFinish={onSplashFinish} />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <OnboardingProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RootNavigator />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}
