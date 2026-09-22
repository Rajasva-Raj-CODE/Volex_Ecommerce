import "../../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { color, type } from "../design/tokens";

/** Native stack — real platform transitions and swipe-back, light chrome. */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: color.card },
          headerTintColor: color.brand,
          headerTitleStyle: { color: color.label, fontSize: type.section.fontSize },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: color.canvas },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[slug]"
          options={{ title: "", headerBackButtonDisplayMode: "minimal" }}
        />
        <Stack.Screen name="category/[slug]" options={{ title: "" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
