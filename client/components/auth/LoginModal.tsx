"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { SmartPhone01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import { useAuth } from "@/contexts/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = "phone" | "otp";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { login } = useAuth();

    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [otpValue, setOtpValue] = useState("");
    const [keepSignedIn, setKeepSignedIn] = useState(true);

    const handleClose = useCallback(() => {
        onClose();
        // Reset after animation settles
        setTimeout(() => {
            setStep("phone");
            setPhone("");
            setOtpValue("");
        }, 300);
    }, [onClose]);

    const handleContinue = () => {
        if (phone.length === 10) setStep("otp");
    };

    const handleBack = () => {
        setStep("phone");
        setOtpValue("");
    };

    // Demo: any 6 digits log you in
    const handleVerify = () => {
        if (otpValue.length < 6) return;
        login({ phone: `+91 ${phone}` });
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent
                className="w-full max-w-[440px] border-white/10 bg-[#141414] p-0 shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden"
                showCloseButton
            >
                {/* Right teal glow accent */}
                <div className="absolute top-0 right-0 w-[3px] h-full bg-linear-to-b from-[#49A5A2] via-[#49A5A2]/50 to-transparent pointer-events-none" />

                <div className="px-7 py-8 sm:px-9 sm:py-9">

                    {/* ── Step: Phone ── */}
                    {step === "phone" && (
                        <div className="space-y-6">
                            <DialogHeader className="text-center items-center">
                                <div className="w-14 h-14 rounded-2xl bg-[#49A5A2]/10 border border-[#49A5A2]/20 flex items-center justify-center mb-2">
                                    <HugeiconsIcon icon={SmartPhone01Icon} size={26} className="text-[#49A5A2]" />
                                </div>
                                <DialogTitle className="text-white text-[18px] font-bold tracking-tight">
                                    Login to VolteX
                                </DialogTitle>
                                <DialogDescription className="text-white/40 text-[13px]">
                                    Enter your mobile number to get an OTP
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                {/* Phone input */}
                                <div className="space-y-1.5">
                                    <Label className="text-white/40 text-[11px] uppercase tracking-wider">
                                        Mobile Number
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                            <HugeiconsIcon icon={SmartPhone01Icon} size={16} className="text-white/30" />
                                            <span className="text-white/50 text-[13px] font-medium border-r border-white/10 pr-2.5">+91</span>
                                        </div>
                                        <Input
                                            id="modal-phone-input"
                                            type="tel"
                                            inputMode="numeric"
                                            maxLength={10}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                                            placeholder="Enter 10-digit number"
                                            autoFocus
                                            className="h-[50px] pl-[82px] bg-white/4 border-white/10 text-white placeholder:text-white/20 focus-visible:border-[#49A5A2]/60 focus-visible:ring-[#49A5A2]/20"
                                        />
                                    </div>
                                </div>

                                {/* Keep signed in */}
                                <div className="flex items-center gap-2.5">
                                    <Checkbox
                                        id="keep-signed-in"
                                        checked={keepSignedIn}
                                        onCheckedChange={(v) => setKeepSignedIn(!!v)}
                                        className="border-white/20 data-checked:bg-[#49A5A2] data-checked:border-[#49A5A2]"
                                    />
                                    <Label htmlFor="keep-signed-in" className="text-white/45 text-[13px] cursor-pointer">
                                        Keep me signed in
                                    </Label>
                                </div>

                                {/* Terms */}
                                <p className="text-white/25 text-[11.5px] text-center leading-relaxed">
                                    By continuing you agree to our{" "}
                                    <Link href="/terms" onClick={handleClose} className="text-[#49A5A2]/80 hover:text-[#49A5A2] underline underline-offset-2">
                                        Terms of Use
                                    </Link>
                                    {" & "}
                                    <Link href="/privacy" onClick={handleClose} className="text-[#49A5A2]/80 hover:text-[#49A5A2] underline underline-offset-2">
                                        Privacy Policy
                                    </Link>
                                </p>

                                <Button
                                    id="modal-continue-btn"
                                    onClick={handleContinue}
                                    disabled={phone.length < 10}
                                    className="w-full h-[50px] rounded-xl bg-linear-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[15px] font-bold hover:from-[#5ab5b2] hover:to-[#49A5A2] shadow-[0_6px_24px_rgba(73,165,162,0.35)] cursor-pointer"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── Step: OTP ── */}
                    {step === "otp" && (
                        <div className="space-y-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBack}
                                className="text-white/40 hover:text-white/70 hover:bg-white/5 px-2 -ml-2 cursor-pointer"
                            >
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
                                Change number
                            </Button>

                            <DialogHeader className="text-center items-center">
                                <DialogTitle className="text-white text-[18px] font-bold tracking-tight">
                                    Enter OTP
                                </DialogTitle>
                                <DialogDescription className="text-white/40 text-[13px]">
                                    Sent to{" "}
                                    <span className="text-white/70 font-semibold">+91 {phone.slice(0, 5)} {phone.slice(5)}</span>
                                    <span className="block text-[#49A5A2]/60 text-[11px] mt-0.5">(Demo: any 6 digits work)</span>
                                </DialogDescription>
                            </DialogHeader>

                            {/* OTP Input — ShadCN InputOTP */}
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={6}
                                    value={otpValue}
                                    onChange={setOtpValue}
                                    pattern={REGEXP_ONLY_DIGITS}
                                    autoFocus
                                >
                                    <InputOTPGroup className="gap-2">
                                        {[0, 1, 2, 3, 4, 5].map((i) => (
                                            <InputOTPSlot
                                                key={i}
                                                index={i}
                                                className={`w-[44px] h-[52px] rounded-xl border text-[18px] font-bold bg-white/4 border-white/10 text-white
                                                    data-[active=true]:border-[#49A5A2]/60 data-[active=true]:ring-[#49A5A2]/20
                                                    ${otpValue[i] ? "border-[#49A5A2]/50 bg-[#49A5A2]/8" : ""}`}
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            {/* Resend */}
                            <div className="flex items-center justify-center gap-1.5">
                                <span className="text-white/30 text-[12.5px]">Didn&apos;t receive OTP?</span>
                                <Button variant="link" size="sm" className="text-[#49A5A2] px-0 h-auto text-[12.5px] cursor-pointer">
                                    Resend
                                </Button>
                            </div>

                            <Button
                                id="modal-verify-btn"
                                onClick={handleVerify}
                                disabled={otpValue.length < 6}
                                className="w-full h-[50px] rounded-xl bg-linear-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[15px] font-bold hover:from-[#5ab5b2] hover:to-[#49A5A2] shadow-[0_6px_24px_rgba(73,165,162,0.35)] cursor-pointer"
                            >
                                Verify & Login
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
