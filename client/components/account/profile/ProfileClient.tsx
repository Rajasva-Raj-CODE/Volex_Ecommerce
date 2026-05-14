"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, Camera01Icon, ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile, changePassword } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function ProfileClient() {
    const { user, refreshUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Profile form state
    const [name, setName] = useState(user?.name ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const displayName = user?.name ?? "My Account";
    const initial = (user?.name ?? user?.email ?? "?").charAt(0).toUpperCase();

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await updateProfile({
                name: name.trim() || undefined,
                phone: phone.trim() || undefined,
            });
            await refreshUser();
            setEditing(false);
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }
        setChangingPassword(true);
        try {
            await changePassword(currentPassword, newPassword);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password changed successfully");
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Failed to change password");
        } finally {
            setChangingPassword(false);
        }
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setName(user?.name ?? "");
        setPhone(user?.phone ?? "");
    };

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
                        {user?.phone && <p className="text-white/40 text-[13px] mt-0.5">{user.phone}</p>}
                    </div>
                </div>
            </div>

            {/* Personal Information Form */}
            <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-6 space-y-5">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-white text-[15px] font-semibold">Personal Information</h2>
                    <button
                        onClick={() => editing ? handleCancelEdit() : setEditing(true)}
                        className="flex items-center gap-1.5 text-[#49A5A2] text-[13px] font-medium hover:text-[#5ab5b2] transition-colors cursor-pointer"
                    >
                        <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                        {editing ? "Cancel" : "Edit"}
                    </button>
                </div>

                <div>
                    <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">
                        Full Name
                    </label>
                    {editing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-11 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 text-white text-[14px] outline-none focus:border-[#49A5A2] transition-colors"
                            placeholder="Enter your name"
                        />
                    ) : (
                        <div className="h-11 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 flex items-center">
                            <span className="text-white/70 text-[14px]">{user?.name ?? "—"}</span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">
                        Email Address
                    </label>
                    <div className="h-11 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 flex items-center">
                        <span className="text-white/70 text-[14px]">{user?.email ?? "—"}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">
                        Phone Number
                    </label>
                    {editing ? (
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-11 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 text-white text-[14px] outline-none focus:border-[#49A5A2] transition-colors"
                            placeholder="Enter your phone number"
                        />
                    ) : (
                        <div className="h-11 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 flex items-center">
                            <span className="text-white/70 text-[14px]">{user?.phone ?? "—"}</span>
                        </div>
                    )}
                </div>

                {editing && (
                    <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="w-full sm:w-auto px-8 h-11 rounded-lg bg-gradient-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[14px] font-semibold hover:from-[#5ab5b2] hover:to-[#49A5A2] transition-all duration-200 shadow-[0_4px_16px_rgba(73,165,162,0.25)] cursor-pointer disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                )}
            </div>

            {/* Change Password */}
            <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-6 space-y-5">
                <h2 className="text-white text-[15px] font-semibold mb-2">Change Password</h2>

                <div>
                    <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">
                        Current Password
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full h-11 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 pr-11 text-white text-[14px] outline-none focus:border-[#49A5A2] transition-colors"
                            placeholder="Enter current password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                        >
                            <HugeiconsIcon icon={showCurrent ? ViewOffIcon : ViewIcon} size={16} />
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full h-11 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 pr-11 text-white text-[14px] outline-none focus:border-[#49A5A2] transition-colors"
                            placeholder="Enter new password (min 8 characters)"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                        >
                            <HugeiconsIcon icon={showNew ? ViewOffIcon : ViewIcon} size={16} />
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-11 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 text-white text-[14px] outline-none focus:border-[#49A5A2] transition-colors"
                        placeholder="Confirm new password"
                    />
                </div>

                <button
                    onClick={handleChangePassword}
                    disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                    className="w-full sm:w-auto px-8 h-11 rounded-lg border border-white/[0.08] text-white text-[14px] font-semibold hover:bg-white/[0.04] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {changingPassword ? "Updating..." : "Update Password"}
                </button>
            </div>
        </div>
    );
}
