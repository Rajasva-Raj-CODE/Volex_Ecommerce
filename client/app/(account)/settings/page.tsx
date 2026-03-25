import type { Metadata } from "next";
import SettingsClient from "@/components/account/settings/SettingsClient";

export const metadata: Metadata = {
    title: "Settings — VolteX",
    description: "Manage your account preferences, privacy, and security settings.",
};

export default function SettingsPage() {
    return <SettingsClient />;
}
