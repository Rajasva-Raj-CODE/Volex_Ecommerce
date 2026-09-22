import { NativeTabs } from "expo-router/unstable-native-tabs";
import { TAB_SYMBOLS } from "../../design/Icon";
import { color } from "../../design/tokens";

/**
 * A real UITabBarController on iOS and Material bottom navigation on Android.
 * Each tab is a route group with its own Stack, so every tab keeps an
 * independent history — the native model.
 */
export default function TabsLayout() {
  return (
    <NativeTabs tintColor={color.brand} backgroundColor={color.card}>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon sf={TAB_SYMBOLS.home.ios} drawable={TAB_SYMBOLS.home.android} />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(search)" role="search">
        <NativeTabs.Trigger.Icon sf={TAB_SYMBOLS.search.ios} drawable={TAB_SYMBOLS.search.android} />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
