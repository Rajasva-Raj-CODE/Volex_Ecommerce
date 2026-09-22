import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Haptics are an iOS/Android affordance with no web equivalent — part of what
 * makes a tap feel native. Every call is fire-and-forget: a device without a
 * taptic engine, or one with system haptics disabled, simply rejects, and that
 * must never surface as an error.
 */
function fire(run: () => Promise<void>) {
  if (Platform.OS === "web") return;
  run().catch(() => {});
}

/** Tapping into a detail screen, selecting a row. */
export function tapFeedback() {
  fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** Changing a segmented control / variant selection. */
export function selectionFeedback() {
  fire(() => Haptics.selectionAsync());
}

/** A failed action — out of stock, request error. */
export function errorFeedback() {
  fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}
