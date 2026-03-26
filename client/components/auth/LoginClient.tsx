"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    SmartPhone01Icon,
    ArrowLeft01Icon,
    Tick02Icon,
    Cancel01Icon,
} from "@hugeicons/core-free-icons";

type Step = "phone" | "otp";
type Tab = "login" | "register";

export default function LoginClient() {
    const [tab, setTab] = useState<Tab>("login");
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [keepSignedIn, setKeepSignedIn] = useState(true);
    const [agreed, setAgreed] = useState(false);

    // OTP input refs
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const next = [...otp];
        next[index] = value.slice(-1);
        setOtp(next);
        // Auto-focus next
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prev = document.getElementById(`otp-${index - 1}`);
            prev?.focus();
        }
    };

    const handlePhoneContinue = () => {
        if (phone.length >= 10) setStep("otp");
    };

    const handleBack = () => {
        setStep("phone");
        setOtp(["", "", "", "", "", ""]);
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
                        {step === "phone" && (
                            <div className="relative flex items-center rounded-lg border border-white/[0.1] bg-white/[0.03] p-1 mb-8">
                                {/* Active pill */}
                                <div
                                    className={`absolute top-1 bottom-1 w-[calc(50%-12px)] rounded-md bg-[#49A5A2]/15 border border-[#49A5A2]/25 transition-all duration-300 ${tab === "login" ? "left-1" : "left-[calc(50%+8px)]"}`}
                                />
                                <button
                                    id="tab-login"
                                    onClick={() => setTab("login")}
                                    className={`relative flex-1 py-2.5 text-[13.5px] font-semibold rounded-md transition-colors duration-200 cursor-pointer ${tab === "login" ? "text-[#49A5A2]" : "text-white/40 hover:text-white/70"}`}
                                >
                                    Login
                                </button>

                                {/* OR divider */}
                                <div className="relative z-10 flex items-center justify-center w-8 shrink-0">
                                    <div className="absolute inset-x-0 h-px bg-white/10" />
                                    <span className="relative bg-[#1a1a1a] text-white/30 text-[10px] font-bold px-1">OR</span>
                                </div>

                                <button
                                    id="tab-register"
                                    onClick={() => setTab("register")}
                                    className={`relative flex-1 py-2.5 text-[13.5px] font-semibold rounded-md transition-colors duration-200 cursor-pointer ${tab === "register" ? "text-[#49A5A2]" : "text-white/40 hover:text-white/70"}`}
                                >
                                    Create Account
                                </button>
                            </div>
                        )}

                        {/* ── OTP Back header ── */}
                        {step === "otp" && (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-white/50 text-[13px] hover:text-white mb-7 transition-colors cursor-pointer"
                            >
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                                Change number
                            </button>
                        )}

                        {/* ── Step: Phone ── */}
                        {step === "phone" && (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-white text-[17px] font-semibold text-center mb-1">
                                        {tab === "login" ? "Welcome back!" : "Create your account"}
                                    </h2>
                                    <p className="text-white/45 text-[13px] text-center">
                                        Please enter your mobile number to continue
                                    </p>
                                </div>

                                {/* Phone input */}
                                <div className="relative mb-5">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2.5 pointer-events-none">
                                        <HugeiconsIcon icon={SmartPhone01Icon} size={18} className="text-white/30" />
                                        <span className="text-white/50 text-[14px] font-medium border-r border-white/10 pr-3">+91</span>
                                    </div>
                                    <input
                                        id="phone-input"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                        placeholder="Enter your mobile number"
                                        className="w-full h-[52px] rounded-xl border border-white/[0.1] bg-white/[0.04] text-white text-[14px] placeholder:text-white/25 pl-[88px] pr-4 outline-none focus:border-[#49A5A2]/60 focus:ring-1 focus:ring-[#49A5A2]/20 transition-all"
                                    />
                                    {/* Clear */}
                                    {phone.length > 0 && (
                                        <button
                                            onClick={() => setPhone("")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                                        >
                                            <HugeiconsIcon icon={Cancel01Icon} size={15} />
                                        </button>
                                    )}
                                </div>

                                {/* Keep signed in */}
                                <label className="flex items-center gap-3 mb-7 cursor-pointer group w-fit">
                                    <div
                                        onClick={() => setKeepSignedIn(!keepSignedIn)}
                                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0 ${keepSignedIn
                                            ? "bg-[#49A5A2] border-[#49A5A2]"
                                            : "border-white/20 bg-white/[0.04] group-hover:border-white/40"
                                            }`}
                                    >
                                        {keepSignedIn && (
                                            <HugeiconsIcon icon={Tick02Icon} size={12} className="text-white" />
                                        )}
                                    </div>
                                    <span className="text-white/50 text-[13px] select-none">Keep me signed in</span>
                                </label>

                                {/* Terms */}
                                <p className="text-white/30 text-[12px] text-center mb-6 leading-relaxed">
                                    By continuing you agree to our{" "}
                                    <Link href="/terms" className="text-[#49A5A2] hover:underline">Terms of Use</Link>
                                    {" & "}
                                    <Link href="/privacy" className="text-[#49A5A2] hover:underline">Privacy Policy</Link>
                                </p>

                                {/* Continue Button */}
                                <button
                                    id="continue-btn"
                                    onClick={handlePhoneContinue}
                                    disabled={phone.length < 10}
                                    className="w-full h-[52px] rounded-xl bg-gradient-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[15px] font-bold hover:from-[#5ab5b2] hover:to-[#49A5A2] transition-all duration-200 shadow-[0_6px_24px_rgba(73,165,162,0.35)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
                                >
                                    Continue
                                </button>
                            </>
                        )}

                        {/* ── Step: OTP ── */}
                        {step === "otp" && (
                            <>
                                <div className="mb-8 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-[#49A5A2]/[0.1] border border-[#49A5A2]/20 flex items-center justify-center mx-auto mb-4">
                                        <HugeiconsIcon icon={SmartPhone01Icon} size={24} className="text-[#49A5A2]" />
                                    </div>
                                    <h2 className="text-white text-[17px] font-semibold mb-1">
                                        Verify your number
                                    </h2>
                                    <p className="text-white/40 text-[13px]">
                                        OTP sent to{" "}
                                        <span className="text-white/70 font-medium">+91 {phone}</span>
                                    </p>
                                </div>

                                {/* OTP 6-digit boxes */}
                                <div className="flex items-center justify-center gap-2.5 mb-6">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            className={`w-11 h-13 rounded-xl border text-center text-white text-[18px] font-bold bg-white/[0.04] outline-none transition-all duration-200 ${digit
                                                ? "border-[#49A5A2]/60 bg-[#49A5A2]/[0.08]"
                                                : "border-white/[0.1] focus:border-[#49A5A2]/50 focus:ring-1 focus:ring-[#49A5A2]/20"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Timer / Resend */}
                                <div className="flex items-center justify-center gap-1 mb-8">
                                    <span className="text-white/30 text-[13px]">Didn't receive OTP?</span>
                                    <button className="text-[#49A5A2] text-[13px] font-medium hover:underline cursor-pointer">
                                        Resend OTP
                                    </button>
                                </div>

                                {/* Verify Button */}
                                <button
                                    id="verify-btn"
                                    disabled={otp.join("").length < 6}
                                    className="w-full h-[52px] rounded-xl bg-gradient-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[15px] font-bold hover:from-[#5ab5b2] hover:to-[#49A5A2] transition-all duration-200 shadow-[0_6px_24px_rgba(73,165,162,0.35)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
                                >
                                    Verify & Continue
                                </button>

                                {/* Terms reminder */}
                                <p className="text-white/20 text-[11.5px] text-center mt-5 leading-relaxed">
                                    By verifying, you agree to our{" "}
                                    <Link href="/terms" className="text-[#49A5A2]/70 hover:text-[#49A5A2]">Terms</Link>
                                    {" & "}
                                    <Link href="/privacy" className="text-[#49A5A2]/70 hover:text-[#49A5A2]">Privacy Policy</Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom note */}
                <p className="text-white/20 text-center text-[12px] mt-6">
                    Having trouble?{" "}
                    <Link href="/help" className="text-[#49A5A2]/60 hover:text-[#49A5A2]">Contact Support</Link>
                </p>
            </div>
        </div>
    );
}
