"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, LockPasswordIcon, ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";

import { useAuth, ApiError } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEmail("");
      setPassword("");
      setError("");
    }, 300);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="w-full max-w-[420px] border-white/10 bg-[#141414] p-0 shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden"
        showCloseButton
      >
        {/* Right teal glow accent */}
        <div className="absolute top-0 right-0 w-[3px] h-full bg-linear-to-b from-[#49A5A2] via-[#49A5A2]/50 to-transparent pointer-events-none" />

        <div className="px-7 py-8 sm:px-9 sm:py-9 space-y-6">

          <DialogHeader className="text-center items-center">
            <DialogTitle className="text-white text-[18px] font-bold tracking-tight">
              Sign in to VolteX
            </DialogTitle>
            <DialogDescription className="text-white/40 text-[13px]">
              Enter your email and password to continue
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-2.5 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">
                Email
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={14}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  className="w-full h-[50px] rounded-xl border border-white/[0.1] bg-white/[0.04] text-white text-[14px] placeholder:text-white/25 pl-9 pr-4 outline-none focus:border-[#49A5A2]/60 focus:ring-1 focus:ring-[#49A5A2]/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">
                Password
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  size={14}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-[50px] rounded-xl border border-white/[0.1] bg-white/[0.04] text-white text-[14px] placeholder:text-white/25 pl-9 pr-10 outline-none focus:border-[#49A5A2]/60 focus:ring-1 focus:ring-[#49A5A2]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={showPwd ? ViewOffIcon : ViewIcon} size={14} />
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] rounded-xl bg-linear-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[15px] font-bold hover:from-[#5ab5b2] hover:to-[#49A5A2] shadow-[0_6px_24px_rgba(73,165,162,0.35)] cursor-pointer"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center gap-2 text-center justify-center">
            <span className="text-white/25 text-[12px]">Don&apos;t have an account?</span>
            <Link
              href="/login"
              onClick={handleClose}
              className="text-[#49A5A2]/80 hover:text-[#49A5A2] text-[12px] underline underline-offset-2"
            >
              Create one
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
