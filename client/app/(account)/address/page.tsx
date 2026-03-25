import type { Metadata } from "next";
import AddressClient from "@/components/account/address/AddressClient";

export const metadata: Metadata = {
    title: "My Address — VolteX",
    description: "Manage your saved delivery addresses.",
};

export default function AddressPage() {
    return <AddressClient />;
}
