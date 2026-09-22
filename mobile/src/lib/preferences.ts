import * as SecureStore from "expo-secure-store";

/**
 * Small durable flags that aren't credentials but do need to survive restarts.
 *
 * Uses SecureStore rather than adding AsyncStorage as a second storage
 * dependency for one boolean. Every read and write is failure-tolerant: a
 * locked or wiped keystore must degrade to "not set", never throw at boot.
 */

const GUEST_ACK_KEY = "voltex_guest_browsing_ack";

/** True once the customer has chosen to browse without an account. */
export async function hasAcceptedGuestBrowsing() {
  try {
    return (await SecureStore.getItemAsync(GUEST_ACK_KEY)) === "1";
  } catch {
    return false;
  }
}

export async function acceptGuestBrowsing() {
  try {
    await SecureStore.setItemAsync(GUEST_ACK_KEY, "1");
  } catch {
    // The choice still applies this launch; it just won't be remembered.
  }
}
