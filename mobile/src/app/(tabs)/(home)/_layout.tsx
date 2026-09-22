import { Stack } from "expo-router";

/**
 * No platform header on home — StoreHeader is the brand block and replaces it,
 * quick-commerce style.
 */
export default function HomeStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
