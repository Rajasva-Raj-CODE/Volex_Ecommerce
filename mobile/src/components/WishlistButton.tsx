import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useWishlist } from "../context/WishlistProvider";
import { Icon } from "../design/Icon";
import { errorFeedback, selectionFeedback } from "../design/haptics";
import { color, radius, space } from "../design/tokens";
import { PressableScale } from "./PressableScale";

/** Heart toggle. Fills when saved; routes to sign-in when there's no session. */
export function WishlistButton({ productId, size = 46 }: { productId: string; size?: number }) {
  const router = useRouter();
  const { signedIn } = useAuth();
  const { has, toggle } = useWishlist();
  const [busy, setBusy] = useState(false);

  const saved = has(productId);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? "Remove from wishlist" : "Save to wishlist"}
      activeScale={0.88}
      disabled={busy}
      onPress={async () => {
        if (!signedIn) {
          selectionFeedback();
          router.push("/sign-in");
          return;
        }
        selectionFeedback();
        setBusy(true);
        try {
          await toggle(productId);
        } catch {
          errorFeedback();
        } finally {
          setBusy(false);
        }
      }}
      style={{
        width: size,
        height: size,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: saved ? color.brand : color.border,
        backgroundColor: saved ? color.brandWash : color.card,
        alignItems: "center",
        justifyContent: "center",
        marginRight: space.sm,
      }}
    >
      <Icon
        name={saved ? "heartFilled" : "heart"}
        size={19}
        color={saved ? color.brand : color.secondaryLabel}
      />
    </PressableScale>
  );
}
