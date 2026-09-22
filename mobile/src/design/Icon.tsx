import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolView } from "expo-symbols";
import { Platform, type ColorValue } from "react-native";
import { color } from "./tokens";

/**
 * One icon vocabulary, two native renderings: SF Symbols on iOS, Material
 * Symbols on Android. Naming icons by role keeps call sites platform-agnostic.
 */
const ICONS = {
  home: { ios: "house.fill", android: "home" },
  search: { ios: "magnifyingglass", android: "search" },
  chevronRight: { ios: "chevron.right", android: "chevron-right" },
  chevronDown: { ios: "chevron.down", android: "keyboard-arrow-down" },
  star: { ios: "star.fill", android: "star" },
  cart: { ios: "cart.fill", android: "shopping-cart" },
  plus: { ios: "plus", android: "add" },
  clock: { ios: "clock.fill", android: "schedule" },
  warning: { ios: "exclamationmark.triangle.fill", android: "warning" },
  empty: { ios: "tray", android: "inbox" },
  photo: { ios: "photo", android: "image" },
  offer: { ios: "creditcard.fill", android: "credit-card" },
  delivery: { ios: "shippingbox.fill", android: "local-shipping" },
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorValue;
}

export function Icon({ name, size = 18, color: tint = color.label }: IconProps) {
  const glyph = ICONS[name];

  if (Platform.OS === "ios") {
    return <SymbolView name={glyph.ios} size={size} tintColor={tint} resizeMode="scaleAspectFit" />;
  }

  return <MaterialIcons name={glyph.android} size={size} color={tint as string} />;
}

/** SF Symbol names for the native tab bar, which takes symbols directly. */
export const TAB_SYMBOLS = {
  home: { ios: ICONS.home.ios, android: ICONS.home.android },
  search: { ios: ICONS.search.ios, android: ICONS.search.android },
} as const;
