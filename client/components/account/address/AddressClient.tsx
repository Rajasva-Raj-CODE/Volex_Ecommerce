"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon, Add01Icon, PencilEdit01Icon, Delete01Icon, Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";
import {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    type ApiAddress,
    type CreateAddressInput,
} from "@/lib/address-api";
import { ApiError } from "@/lib/api";

const EMPTY_FORM: CreateAddressInput = {
    label: "Home",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
};

export default function AddressClient() {
    const { isLoggedIn, isReady } = useAuth();
    const [addresses, setAddresses] = useState<ApiAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<ApiAddress | null>(null);
    const [form, setForm] = useState<CreateAddressInput>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [formError, setFormError] = useState("");

    const fetchAddresses = useCallback(async () => {
        if (!isLoggedIn) { setLoading(false); return; }
        setLoading(true);
        setError("");
        try {
            const data = await getAddresses();
            setAddresses(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to load addresses");
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isReady) void fetchAddresses();
    }, [isReady, fetchAddresses]);

    const openAdd = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setFormError("");
        setShowForm(true);
    };

    const openEdit = (addr: ApiAddress) => {
        setEditing(addr);
        setForm({
            label: addr.label,
            line1: addr.line1,
            line2: addr.line2 ?? "",
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            isDefault: addr.isDefault,
        });
        setFormError("");
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
        setForm(EMPTY_FORM);
        setFormError("");
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError("");
        setSaving(true);
        try {
            const payload: CreateAddressInput = {
                label: form.label || "Home",
                line1: form.line1,
                line2: form.line2 || undefined,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
                isDefault: form.isDefault,
            };
            if (editing) {
                await updateAddress(editing.id, payload);
            } else {
                await createAddress(payload);
            }
            closeForm();
            void fetchAddresses();
        } catch (err) {
            setFormError(err instanceof ApiError ? err.message : "Failed to save address");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this address?")) return;
        setDeletingId(id);
        try {
            await deleteAddress(id);
            setAddresses((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to delete address");
        } finally {
            setDeletingId(null);
        }
    };

    if (!isReady || loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-white text-[22px] font-bold tracking-tight">My Address</h1>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-5 h-28 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-white text-[22px] font-bold tracking-tight">My Address</h1>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#49A5A2]/[0.12] border border-[#49A5A2]/30 text-[#49A5A2] text-[13px] font-semibold hover:bg-[#49A5A2]/[0.2] transition-all duration-200 cursor-pointer"
                >
                    <HugeiconsIcon icon={Add01Icon} size={16} />
                    Add New Address
                </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="rounded-xl border border-[#49A5A2]/30 bg-[#1a1a1a]/80 p-5 space-y-4">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-white text-[15px] font-semibold">
                            {editing ? "Edit Address" : "Add New Address"}
                        </h2>
                        <button onClick={closeForm} className="text-white/30 hover:text-white/60 cursor-pointer">
                            <HugeiconsIcon icon={Cancel01Icon} size={18} />
                        </button>
                    </div>

                    {formError && (
                        <p className="text-red-400 text-xs">{formError}</p>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">Label</label>
                            <input
                                value={form.label}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                                placeholder="Home, Office, etc."
                                className="w-full h-10 rounded-lg border border-white/[0.1] bg-white/[0.04] text-white text-[13px] px-3 outline-none focus:border-[#49A5A2]/60 transition-all"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">Address Line 1 *</label>
                            <input
                                required
                                value={form.line1}
                                onChange={(e) => setForm({ ...form, line1: e.target.value })}
                                placeholder="House/Flat no., Street"
                                className="w-full h-10 rounded-lg border border-white/[0.1] bg-white/[0.04] text-white text-[13px] px-3 outline-none focus:border-[#49A5A2]/60 transition-all"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">Address Line 2</label>
                            <input
                                value={form.line2}
                                onChange={(e) => setForm({ ...form, line2: e.target.value })}
                                placeholder="Landmark, Area (optional)"
                                className="w-full h-10 rounded-lg border border-white/[0.1] bg-white/[0.04] text-white text-[13px] px-3 outline-none focus:border-[#49A5A2]/60 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">City *</label>
                            <input
                                required
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                placeholder="Mumbai"
                                className="w-full h-10 rounded-lg border border-white/[0.1] bg-white/[0.04] text-white text-[13px] px-3 outline-none focus:border-[#49A5A2]/60 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">State *</label>
                            <input
                                required
                                value={form.state}
                                onChange={(e) => setForm({ ...form, state: e.target.value })}
                                placeholder="Maharashtra"
                                className="w-full h-10 rounded-lg border border-white/[0.1] bg-white/[0.04] text-white text-[13px] px-3 outline-none focus:border-[#49A5A2]/60 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">Pincode *</label>
                            <input
                                required
                                pattern="\d{6}"
                                value={form.pincode}
                                onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                                placeholder="400001"
                                className="w-full h-10 rounded-lg border border-white/[0.1] bg-white/[0.04] text-white text-[13px] px-3 outline-none focus:border-[#49A5A2]/60 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2.5 sm:col-span-2">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, isDefault: !form.isDefault })}
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 cursor-pointer ${form.isDefault ? "bg-[#49A5A2] border-[#49A5A2]" : "border-white/20 bg-white/[0.04]"}`}
                            >
                                {form.isDefault && <HugeiconsIcon icon={Tick02Icon} size={12} className="text-white" />}
                            </button>
                            <span className="text-white/50 text-[13px]">Set as default address</span>
                        </div>

                        <div className="sm:col-span-2 flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 h-10 rounded-lg bg-gradient-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[13px] font-semibold hover:from-[#5ab5b2] hover:to-[#49A5A2] transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {saving ? "Saving…" : editing ? "Update Address" : "Save Address"}
                            </button>
                            <button type="button" onClick={closeForm} className="px-6 h-10 rounded-lg border border-white/[0.1] text-white/50 text-[13px] hover:border-white/30 transition-all cursor-pointer">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Address list */}
            {addresses.length === 0 && !showForm ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center">
                        <HugeiconsIcon icon={Location01Icon} size={28} className="text-white/20" />
                    </div>
                    <p className="text-white/40 text-[14px]">No saved addresses</p>
                    <button onClick={openAdd} className="text-[#49A5A2] text-[13px] hover:underline cursor-pointer">Add your first address</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map((addr) => (
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
                                            <span className="text-white text-[14px] font-semibold">{addr.label}</span>
                                            {addr.isDefault && (
                                                <span className="text-[10px] font-medium bg-[#49A5A2]/15 text-[#49A5A2] px-2 py-0.5 rounded-full border border-[#49A5A2]/20">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white/60 text-[13px] leading-relaxed">
                                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                                            {addr.city}, {addr.state} — {addr.pincode}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => openEdit(addr)}
                                        className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center hover:border-[#49A5A2]/30 hover:text-[#49A5A2] text-white/40 transition-all cursor-pointer"
                                    >
                                        <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        disabled={deletingId === addr.id}
                                        className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center hover:border-red-500/30 hover:text-red-400 text-white/40 transition-all cursor-pointer disabled:opacity-40"
                                    >
                                        <HugeiconsIcon icon={Delete01Icon} size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
