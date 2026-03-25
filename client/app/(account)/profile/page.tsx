import type { Metadata } from "next";
import ProfileClient from "@/components/account/profile/ProfileClient";

export const metadata: Metadata = {
    title: "My Profile — VolteX",
    description: "Edit your basic details, name, phone, and account information.",
};

export default function ProfilePage() {
    return <ProfileClient />;
}
