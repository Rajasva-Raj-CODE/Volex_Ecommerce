"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, Camera01Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileClient() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);

    const displayName = user?.name ?? "My Account";
    const initial = (user?.name ?? user?.email ?? "?").charAt(0).toUpperCase();

    return (
        <div className="space-y-6">
            <h1 className="text-white text-[22px] font-bold tracking-tight">My Profile</h1>

            {/* Avatar section */}
            <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#49A5A2] to-[#3d8d8a] flex items-center justify-center shadow-[0_4px_20px_rgba(73,165,162,0.4)]">
                            <span className="text-white text-[28px] font-bold">{initial}</span>
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#49A5A2] flex items-center justify-center shadow-lg hover:bg-[#5ab5b2] transition-colors cursor-pointer">
                            <HugeiconsIcon icon={Camera01Icon} size={14} className="text-white" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-white text-[18px] font-semibold">{displayName}</p>
                        <p className="text-white/40 text-[13px] mt-1">{user?.email ?? ""}</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-6 space-y-5">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-white text-[15px] font-semibold">Personal Information</h2>
                    <button
                        onClick={() => setEditing(!editing)}
                        className="flex items-center gap-1.5 text-[#49A5A2] text-[13px] font-medium hover:text-[#5ab5b2] transition-colors cursor-pointer"
                    >
                        <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                        {editing ? "Cancel" : "Edit"}
                    </button>
                </div>

                {[
                    { label: "Full Name", value: user?.name ?? "—" },
                    { label: "Email Address", value: user?.email ?? "—" },
                ].map((field) => (
                    <div key={field.label}>
                        <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">
                            {field.label}
                        </label>
                        <div className="h-11 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 flex items-center">
                            <span className="text-white/70 text-[14px]">{field.value}</span>
                        </div>
                    </div>
                ))}

                {editing && (
                    <button className="w-full sm:w-auto px-8 h-11 rounded-lg bg-gradient-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[14px] font-semibold hover:from-[#5ab5b2] hover:to-[#49A5A2] transition-all duration-200 shadow-[0_4px_16px_rgba(73,165,162,0.25)] cursor-pointer">
                        Save Changes
                    </button>
                )}
            </div>
        </div>
    );
}
