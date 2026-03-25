"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon, Add01Icon, PencilEdit01Icon, Delete01Icon } from "@hugeicons/core-free-icons";

const MOCK_ADDRESSES = [
    {
        id: 1,
        tag: "Home",
        name: "Raj Kumar",
        line1: "A-42, Sector 18, Noida",
        line2: "Gautam Buddha Nagar",
        city: "Uttar Pradesh",
        pincode: "201301",
        phone: "+91 98765 43210",
        isDefault: true,
    },
    {
        id: 2,
        tag: "Office",
        name: "Raj Kumar",
        line1: "Tower B, Cyber City, DLF Phase 2",
        line2: "DLF Phase 2",
        city: "Gurugram, Haryana",
        pincode: "122002",
        phone: "+91 98765 43210",
        isDefault: false,
    },
];

export default function AddressClient() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-white text-[22px] font-bold tracking-tight">My Address</h1>
                <button className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#49A5A2]/[0.12] border border-[#49A5A2]/30 text-[#49A5A2] text-[13px] font-semibold hover:bg-[#49A5A2]/[0.2] transition-all duration-200 cursor-pointer">
                    <HugeiconsIcon icon={Add01Icon} size={16} />
                    Add New Address
                </button>
            </div>

            <div className="space-y-4">
                {MOCK_ADDRESSES.map((addr) => (
                    <div
                        key={addr.id}
                        className={`rounded-xl border p-5 bg-[#1a1a1a]/60 transition-all duration-200 ${addr.isDefault ? "border-[#49A5A2]/30" : "border-white/[0.08]"}`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full border border-white/[0.1] bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                                    <HugeiconsIcon icon={Location01Icon} size={16} className="text-[#49A5A2]" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-white text-[14px] font-semibold">{addr.tag}</span>
                                        {addr.isDefault && (
                                            <span className="text-[10px] font-medium bg-[#49A5A2]/15 text-[#49A5A2] px-2 py-0.5 rounded-full border border-[#49A5A2]/20">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white/60 text-[13px] leading-relaxed">
                                        {addr.name}, {addr.line1},<br />
                                        {addr.line2}, {addr.city} — {addr.pincode}
                                    </p>
                                    <p className="text-white/40 text-[12px] mt-1">{addr.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center hover:border-[#49A5A2]/30 hover:text-[#49A5A2] text-white/40 transition-all cursor-pointer">
                                    <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                                </button>
                                <button className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center hover:border-red-500/30 hover:text-red-400 text-white/40 transition-all cursor-pointer">
                                    <HugeiconsIcon icon={Delete01Icon} size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
