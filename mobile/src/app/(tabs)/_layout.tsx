import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useCart } from "../../context/CartProvider";
import { TAB_SYMBOLS } from "../../design/Icon";
import { color } from "../../design/tokens";

/**
 * A real UITabBarController on iOS and Material bottom navigation on Android.
 * Each tab is a route group with its own Stack, so every tab keeps an
 * independent history — the native model.
 */
export default function TabsLayout() {
  const { cart } = useCart();

  // The native tab bar renders the badge itself, so it gets the platform's
  // own placement and animation rather than an overlay we position by hand.
  const cartBadge = cart.itemCount > 0 ? String(cart.itemCount) : undefined;

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

      <NativeTabs.Trigger name="(cart)">
        <NativeTabs.Trigger.Icon sf={TAB_SYMBOLS.cart.ios} drawable={TAB_SYMBOLS.cart.android} />
        <NativeTabs.Trigger.Label>Cart</NativeTabs.Trigger.Label>
        {cartBadge ? <NativeTabs.Trigger.Badge>{cartBadge}</NativeTabs.Trigger.Badge> : null}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(account)">
        <NativeTabs.Trigger.Icon sf={TAB_SYMBOLS.account.ios} drawable={TAB_SYMBOLS.account.android} />
        <NativeTabs.Trigger.Label>Account</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
