"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, LockPasswordIcon, Notification03Icon, EyeIcon, Delete01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// ─── Config ───────────────────────────────────────────────────────────────────

const SETTING_SECTIONS = [
    {
        icon: Notification03Icon,
        title: "Notification Preferences",
        items: [
            { id: "notif-email",  label: "Order updates via Email",      defaultOn: true },
            { id: "notif-sms",    label: "Order updates via SMS",         defaultOn: true },
            { id: "notif-promo",  label: "Promotional offers via Email",  defaultOn: false },
            { id: "notif-price",  label: "Price drop alerts",             defaultOn: true },
        ],
    },
    {
        icon: EyeIcon,
        title: "Privacy",
        items: [
            { id: "privacy-wishlist", label: "Show my wishlist publicly",          defaultOn: false },
            { id: "privacy-reco",     label: "Allow personalised recommendations", defaultOn: true },
        ],
    },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SettingsClient() {
    return (
        <div className="space-y-6">
            <h1 className="text-white text-[22px] font-bold tracking-tight">Settings</h1>

            {/* Toggle sections */}
            {SETTING_SECTIONS.map((section) => (
                <div key={section.title} className="rounded-xl border border-white/8 bg-[#1a1a1a]/60 p-5 space-y-4">
                    <div className="flex items-center gap-2.5">
                        <HugeiconsIcon icon={section.icon} size={17} className="text-[#49A5A2]" />
                        <h2 className="text-white text-[14px] font-semibold">{section.title}</h2>
                    </div>
                    <Separator className="bg-white/6" />
                    <div className="space-y-4">
                        {section.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-4">
                                <Label htmlFor={item.id} className="text-white/60 text-[13px] cursor-pointer">
                                    {item.label}
                                </Label>
                                <Switch
                                    id={item.id}
                                    defaultChecked={item.defaultOn}
                                    className="data-checked:bg-[#49A5A2]"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Change Password */}
            <div className="rounded-xl border border-white/8 bg-[#1a1a1a]/60 p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                    <HugeiconsIcon icon={LockPasswordIcon} size={17} className="text-[#49A5A2]" />
                    <h2 className="text-white text-[14px] font-semibold">Change Password</h2>
                </div>
                <Separator className="bg-white/6" />
                <div className="space-y-3">
                    {[
                        { id: "cur-pass",  label: "Current Password" },
                        { id: "new-pass",  label: "New Password" },
                        { id: "conf-pass", label: "Confirm New Password" },
                    ].map(({ id, label }) => (
                        <div key={id} className="space-y-1.5">
                            <Label htmlFor={id} className="text-white/40 text-[11px] uppercase tracking-wider">
                                {label}
                            </Label>
                            <Input
                                id={id}
                                type="password"
                                placeholder="••••••••"
                                className="h-11 bg-white/4 border-white/10 text-white placeholder:text-white/20 focus-visible:border-[#49A5A2]/60 focus-visible:ring-[#49A5A2]/20"
                            />
                        </div>
                    ))}
                    <Button className="mt-2 bg-linear-to-r from-[#49A5A2] to-[#3d8d8a] text-white hover:from-[#5ab5b2] hover:to-[#49A5A2] shadow-[0_4px_14px_rgba(73,165,162,0.25)] cursor-pointer">
                        Update Password
                    </Button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/4 p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                    <HugeiconsIcon icon={Delete01Icon} size={17} className="text-red-400" />
                    <h2 className="text-red-400 text-[14px] font-semibold">Danger Zone</h2>
                </div>
                <p className="text-white/40 text-[12.5px] leading-relaxed">
                    Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button
                    variant="outline"
                    className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/60 cursor-pointer"
                >
                    Delete Account
                </Button>
            </div>
        </div>
    );
}
