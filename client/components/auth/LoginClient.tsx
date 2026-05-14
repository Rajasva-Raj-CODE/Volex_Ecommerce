"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  LockPasswordIcon,
  ViewIcon,
  ViewOffIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { useAuth, ApiError } from "@/contexts/AuthContext";

type Tab = "login" | "register";

export default function LoginClient() {
  const router = useRouter();
  const { login, register, continueAsGuest } = useAuth();

  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState("");

  function switchTab(t: Tab) {
    setTab(t);
    setError("");
    setPassword("");
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await register(email, password, name.trim() || undefined);
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setGuestLoading(true);
    try {
      await continueAsGuest();
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not continue as guest. Please try again.");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center px-4 py-12 lg:py-20">
      <div className="w-full max-w-[460px]">

        {/* ── Card ── */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-[#1a1a1a]/95 backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden">

          {/* Right glow border */}
          <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-[#49A5A2] via-[#49A5A2]/60 to-transparent" />

          <div className="p-7 sm:p-9">

            {/* ── Tab Toggle ── */}
            <div className="relative flex items-center rounded-lg border border-white/[0.1] bg-white/[0.03] p-1 mb-8">
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md bg-[#49A5A2]/15 border border-[#49A5A2]/25 transition-all duration-300 ${tab === "login" ? "left-1" : "left-[calc(50%+3px)]"}`}
              />
              <button
                type="button"
                onClick={() => switchTab("login")}
                className={`relative flex-1 py-2.5 text-[13.5px] font-semibold rounded-md transition-colors duration-200 cursor-pointer ${tab === "login" ? "text-[#49A5A2]" : "text-white/40 hover:text-white/70"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchTab("register")}
                className={`relative flex-1 py-2.5 text-[13.5px] font-semibold rounded-md transition-colors duration-200 cursor-pointer ${tab === "register" ? "text-[#49A5A2]" : "text-white/40 hover:text-white/70"}`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-white text-[17px] font-semibold mb-1">
                {tab === "login" ? "Welcome back!" : "Create your account"}
              </h2>
              <p className="text-white/45 text-[13px]">
                {tab === "login" ? "Sign in to continue shopping" : "Join VolteX for the best deals"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-xs text-red-400">
                  {error}
                </div>
              )}

              {/* Name — register only */}
              {tab === "register" && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">
                    Full Name <span className="text-white/20 normal-case tracking-normal font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={UserIcon}
                      size={14}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Raj Kumar"
                      autoComplete="name"
                      className="w-full h-[50px] rounded-xl border border-white/[0.1] bg-white/[0.04] text-white text-[14px] placeholder:text-white/25 pl-9 pr-4 outline-none focus:border-[#49A5A2]/60 focus:ring-1 focus:ring-[#49A5A2]/20 transition-all"
                    />
                  </div>
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
                    className="w-full h-[50px] rounded-xl border border-white/[0.1] bg-white/[0.04] text-white text-[14px] placeholder:text-white/25 pl-9 pr-4 outline-none focus:border-[#49A5A2]/60 focus:ring-1 focus:ring-[#49A5A2]/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">
                  Password {tab === "register" && <span className="text-white/20 normal-case tracking-normal font-normal">(min. 8 characters)</span>}
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
                    minLength={tab === "register" ? 8 : 1}
                    placeholder="••••••••"
                    autoComplete={tab === "login" ? "current-password" : "new-password"}
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

              <button
                type="submit"
                disabled={loading || guestLoading}
                className="w-full h-[52px] rounded-xl bg-gradient-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[15px] font-bold hover:from-[#5ab5b2] hover:to-[#49A5A2] transition-all duration-200 shadow-[0_6px_24px_rgba(73,165,162,0.35)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading
                  ? (tab === "login" ? "Signing in…" : "Creating account…")
                  : (tab === "login" ? "Sign In" : "Create Account")
                }
              </button>

              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading || guestLoading}
                className="w-full h-[50px] rounded-xl border border-white/[0.12] bg-white/[0.04] text-white/85 text-[14px] font-semibold hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {guestLoading ? "Entering…" : "Continue as Guest"}
              </button>
            </form>

            <p className="text-white/30 text-[12px] text-center mt-6 leading-relaxed">
              By continuing you agree to our{" "}
              <Link href="/terms" className="text-[#49A5A2] hover:underline">Terms of Use</Link>
              {" & "}
              <Link href="/privacy" className="text-[#49A5A2] hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>

        <p className="text-white/20 text-center text-[12px] mt-6">
          Having trouble?{" "}
          <Link href="/help" className="text-[#49A5A2]/60 hover:text-[#49A5A2]">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}
