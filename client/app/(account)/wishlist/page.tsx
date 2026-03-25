import type { Metadata } from "next";
import WishlistClient from "@/components/account/wishlist/WishlistClient";

export const metadata: Metadata = {
    title: "My Wishlist — VolteX",
    description: "Have a look at your favourite products saved for later.",
};

export default function WishlistPage() {
    return <WishlistClient />;
}
