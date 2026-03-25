"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, LockPasswordIcon, Notification03Icon, EyeIcon, EyeOffIcon, Delete01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";

const SETTING_SECTIONS = [
    {
        icon: Notification03Icon,
        title: "Notification Preferences",
        items: [
            { label: "Order updates via Email", defaultOn: true },
            { label: "Order updates via SMS", defaultOn: true },
            { label: "Promotional offers via Email", defaultOn: false },
            { label: "Price drop alerts", defaultOn: true },
        ],
    },
    {
        icon: EyeIcon,
        title: "Privacy",
        items: [
            { label: "Show my wishlist publicly", defaultOn: false },
            { label: "Allow personalised recommendations", defaultOn: true },
        ],
    },
];

function Toggle({ defaultOn }: { defaultOn: boolean }) {
    const [on, setOn] = useState(defaultOn);
    return (
        <button
            onClick={() => setOn(!on)}
            className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 cursor-pointer flex items-center ${on ? "bg-[#49A5A2]" : "bg-white/20"}`}
        >
            <span
                className={`absolute w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0.5"}`}
            />
        </button>
    );
}

export default function SettingsClient() {
    return (
        <div className="space-y-6">
            <h1 className="text-white text-[22px] font-bold tracking-tight">Settings</h1>

            {/* Toggle sections */}
            {SETTING_SECTIONS.map((section) => (
                <div key={section.title} className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-5">
                    <div className="flex items-center gap-2.5 mb-4">
                        <HugeiconsIcon icon={section.icon} size={17} className="text-[#49A5A2]" />
                        <h2 className="text-white text-[14px] font-semibold">{section.title}</h2>
                    </div>
                    <div className="space-y-4">
                        {section.items.map((item) => (
                            <div key={item.label} className="flex items-center justify-between gap-4">
                                <span className="text-white/60 text-[13px]">{item.label}</span>
                                <Toggle defaultOn={item.defaultOn} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Password */}
            <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-5">
                <div className="flex items-center gap-2.5 mb-4">
                    <HugeiconsIcon icon={LockPasswordIcon} size={17} className="text-[#49A5A2]" />
                    <h2 className="text-white text-[14px] font-semibold">Change Password</h2>
                </div>
                <div className="space-y-4">
                    {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                        <div key={label}>
                            <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">
                                {label}
                            </label>
                            <div className="h-11 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 flex items-center">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="flex-1 bg-transparent text-white/70 text-[14px] outline-none placeholder:text-white/20"
                                />
                            </div>
                        </div>
                    ))}
                    <button className="px-8 h-10 rounded-lg bg-gradient-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[13px] font-semibold hover:from-[#5ab5b2] hover:to-[#49A5A2] transition-all duration-200 shadow-[0_4px_14px_rgba(73,165,162,0.25)] cursor-pointer">
                        Update Password
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-5">
                <div className="flex items-center gap-2.5 mb-3">
                    <HugeiconsIcon icon={Delete01Icon} size={17} className="text-red-400" />
                    <h2 className="text-red-400 text-[14px] font-semibold">Danger Zone</h2>
                </div>
                <p className="text-white/40 text-[12.5px] mb-4 leading-relaxed">
                    Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="px-6 h-10 rounded-lg border border-red-500/40 text-red-400 text-[13px] font-semibold hover:bg-red-500/10 transition-all duration-200 cursor-pointer">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
