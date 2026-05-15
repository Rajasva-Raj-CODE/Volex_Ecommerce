import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffIcon,
  Mail01Icon,
  LockPasswordIcon,
  ArrowRight01Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { ZapIcon } from "lucide-react";
import { requestOtp, verifyOtp } from "@/lib/invitations-api";
import { forgotPassword, resetPassword } from "@/lib/auth-api";
import { ApiError, setStoredAuthTokens } from "@/lib/api";
import { toast } from "sonner";

const METRICS = [
  { value: "₹12.4L", label: "Revenue",   sub: "+12.5% this month" },
  { value: "1,284",  label: "Orders",    sub: "+8.2% this month"  },
  { value: "3,421",  label: "Customers", sub: "+15.3% this month" },
];

type LoginTab = "admin" | "staff";
type OtpStep = "email" | "otp";

export default function Login() {
  const [tab, setTab] = useState<LoginTab>("admin");
  const navigate   = useNavigate();
  const { login, isLoggingIn, refreshSession } = useAuth();

  // Admin form
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [adminError, setAdminError] = useState("");

  // Forgot password
  const [adminView, setAdminView] = useState<"login" | "forgot" | "reset">("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  const submitForgot = async (e: FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetLoading(true);
    try {
      await forgotPassword(resetEmail);
      setAdminView("reset");
      toast.success("Reset code sent to your email");
    } catch (err) {
      setResetError(err instanceof ApiError ? err.message : "Failed to send reset code");
    } finally {
      setResetLoading(false);
    }
  };

  const submitReset = async (e: FormEvent) => {
    e.preventDefault();
    setResetError("");
    if (newPassword !== confirmPw) { setResetError("Passwords do not match"); return; }
    setResetLoading(true);
    try {
      await resetPassword(resetEmail, resetOtp, newPassword);
      toast.success("Password reset successfully! Please sign in.");
      setAdminView("login");
      setResetEmail(""); setResetOtp(""); setNewPassword(""); setConfirmPw("");
    } catch (err) {
      setResetError(err instanceof ApiError ? err.message : "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  // Staff OTP form
  const [staffEmail, setStaffEmail]   = useState("");
  const [otp, setOtp]                 = useState("");
  const [otpStep, setOtpStep]         = useState<OtpStep>("email");
  const [staffError, setStaffError]   = useState("");
  const [sendingOtp, setSendingOtp]   = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const submitAdmin = async (e: FormEvent) => {
    e.preventDefault();
    setAdminError("");
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setAdminError(err instanceof Error ? err.message : "Unable to sign in.");
    }
  };

  const submitRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setStaffError("");
    setSendingOtp(true);
    try {
      await requestOtp(staffEmail);
      setOtpStep("otp");
    } catch (err) {
      setStaffError(err instanceof ApiError ? err.message : "Failed to send OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  const submitVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setStaffError("");
    setVerifyingOtp(true);
    try {
      const result = await verifyOtp(staffEmail, otp);
      setStoredAuthTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
      await refreshSession();
      navigate("/", { replace: true });
    } catch (err) {
      setStaffError(err instanceof ApiError ? err.message : "Invalid OTP.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="flex min-h-svh" style={{ backgroundColor: "oklch(0.13 0 0)" }}>

      {/* ── LEFT  brand panel ───────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[52%] flex-col justify-between overflow-hidden px-16 py-14"
        style={{ backgroundColor: "oklch(0.185 0.065 175)" }}>

        <div
          className="pointer-events-none absolute -bottom-10 -left-8 select-none font-black leading-none text-white"
          style={{ fontSize: "clamp(260px,28vw,400px)", opacity: 0.04, letterSpacing: "-0.05em" }}
          aria-hidden
        >
          V
        </div>

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ backgroundColor: "oklch(0.685 0.135 175)" }}>
            <ZapIcon className="size-4" style={{ color: "oklch(0.13 0 0)" }} />
          </div>
          <span className="text-base font-bold tracking-tight text-white">VolteX</span>
        </div>

        <div className="relative space-y-10">
          {METRICS.map((m, i) => (
            <div key={i}>
              <div className="flex items-baseline gap-5">
                <span className="tabular-nums font-black text-white" style={{ fontSize: "clamp(2.8rem,4.5vw,3.8rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
                  {m.value}
                </span>
                <span className="text-base font-semibold" style={{ color: "oklch(0.685 0.135 175)" }}>
                  {m.label}
                </span>
              </div>
              <p className="mt-1.5 text-sm" style={{ color: "oklch(0.65 0.04 175)" }}>{m.sub}</p>
              {i < METRICS.length - 1 && (
                <div className="mt-10 h-px" style={{ backgroundColor: "oklch(1 0 0 / 0.07)" }} />
              )}
            </div>
          ))}
        </div>

        <div className="relative">
          <p className="text-2xl font-bold leading-snug text-white">
            Your store.<br />
            <span style={{ color: "oklch(0.685 0.135 175)" }}>Your numbers.</span>
          </p>
          <p className="mt-2 text-sm" style={{ color: "oklch(0.60 0.04 175)" }}>
            Full control over your VolteX operations.
          </p>
        </div>
      </div>

      {/* ── RIGHT  form panel ───────────────────────── */}
      <div className="flex w-full flex-col justify-between px-8 py-12 lg:w-[48%] lg:px-16 lg:py-14">

        {/* mobile logo */}
        <div className="flex items-center gap-2.5 lg:invisible">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <ZapIcon className="size-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-white">VolteX</span>
        </div>

        <div className="mx-auto w-full max-w-[360px]">

          <div className="mb-8 space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Sign in</h1>
            <p className="text-sm text-white/40">Access your VolteX admin dashboard</p>
          </div>

          {/* Tab switcher */}
          <div className="mb-6 flex rounded-xl border border-white/8 bg-white/4 p-1">
            <button
              type="button"
              onClick={() => { setTab("admin"); setAdminError(""); }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${tab === "admin" ? "bg-primary text-primary-foreground" : "text-white/40 hover:text-white/60"}`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => { setTab("staff"); setStaffError(""); setOtpStep("email"); setOtp(""); }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${tab === "staff" ? "bg-primary text-primary-foreground" : "text-white/40 hover:text-white/60"}`}
            >
              Staff (OTP)
            </button>
          </div>

          {/* Admin login form */}
          {tab === "admin" && adminView === "login" && (
            <form onSubmit={submitAdmin} className="space-y-4">
              {adminError && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/8 px-3.5 py-2.5 text-xs text-red-400">
                  {adminError}
                </p>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">
                  Email
                </label>
                <div className="relative">
                  <HugeiconsIcon icon={Mail01Icon} size={14}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                  <Input id="email" type="email" value={email} required
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@voltex.com"
                    className="h-11 rounded-xl border-white/8 bg-white/4 pl-9 text-sm text-white placeholder:text-white/20 focus-visible:border-primary/50 focus-visible:ring-0 focus-visible:bg-white/6"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">
                  Password
                </label>
                <div className="relative">
                  <HugeiconsIcon icon={LockPasswordIcon} size={14}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                  <Input id="password" type={showPwd ? "text" : "password"} value={password} required
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-white/8 bg-white/4 pl-9 pr-10 text-sm text-white placeholder:text-white/20 focus-visible:border-primary/50 focus-visible:ring-0 focus-visible:bg-white/6"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                    <HugeiconsIcon icon={showPwd ? ViewOffIcon : ViewIcon} size={14} />
                  </button>
                </div>
              </div>

              <div className="text-right -mt-1">
                <button type="button" onClick={() => { setAdminView("forgot"); setResetError(""); setResetEmail(email); }}
                  className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>

              <Button type="submit"
                disabled={isLoggingIn}
                className="h-11 w-full rounded-xl font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                {isLoggingIn ? "Signing in…" : "Continue"}
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
              </Button>
            </form>
          )}

          {/* Admin forgot password */}
          {tab === "admin" && adminView === "forgot" && (
            <form onSubmit={submitForgot} className="space-y-4">
              <p className="text-sm text-white/50">Enter your email to receive a password reset code.</p>
              {resetError && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/8 px-3.5 py-2.5 text-xs text-red-400">{resetError}</p>
              )}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">Email</label>
                <div className="relative">
                  <HugeiconsIcon icon={Mail01Icon} size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                  <Input type="email" value={resetEmail} required onChange={e => setResetEmail(e.target.value)} placeholder="admin@voltex.com"
                    className="h-11 rounded-xl border-white/8 bg-white/4 pl-9 text-sm text-white placeholder:text-white/20 focus-visible:border-primary/50 focus-visible:ring-0" />
                </div>
              </div>
              <Button type="submit" disabled={resetLoading} className="h-11 w-full rounded-xl font-semibold bg-primary text-primary-foreground">
                {resetLoading ? "Sending…" : "Send Reset Code"}
              </Button>
              <button type="button" onClick={() => { setAdminView("login"); setResetError(""); }} className="w-full text-center text-xs text-white/30 hover:text-white/50">
                ← Back to sign in
              </button>
            </form>
          )}

          {/* Admin reset password */}
          {tab === "admin" && adminView === "reset" && (
            <form onSubmit={submitReset} className="space-y-4">
              <p className="text-sm text-white/50">Enter the code sent to <span className="text-white/80">{resetEmail}</span></p>
              {resetError && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/8 px-3.5 py-2.5 text-xs text-red-400">{resetError}</p>
              )}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">Reset Code</label>
                <Input type="text" inputMode="numeric" maxLength={6} value={resetOtp} required
                  onChange={e => setResetOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000"
                  className="h-11 rounded-xl border-white/8 bg-white/4 text-center text-xl tracking-[0.5em] font-bold text-white placeholder:text-white/20 focus-visible:border-primary/50 focus-visible:ring-0" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">New Password</label>
                <Input type="password" value={newPassword} required minLength={8} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 8 characters"
                  className="h-11 rounded-xl border-white/8 bg-white/4 text-sm text-white placeholder:text-white/20 focus-visible:border-primary/50 focus-visible:ring-0" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">Confirm Password</label>
                <Input type="password" value={confirmPw} required minLength={8} onChange={e => setConfirmPw(e.target.value)} placeholder="Confirm new password"
                  className="h-11 rounded-xl border-white/8 bg-white/4 text-sm text-white placeholder:text-white/20 focus-visible:border-primary/50 focus-visible:ring-0" />
              </div>
              <Button type="submit" disabled={resetLoading || resetOtp.length < 6} className="h-11 w-full rounded-xl font-semibold bg-primary text-primary-foreground">
                {resetLoading ? "Resetting…" : "Reset Password"}
              </Button>
              <button type="button" onClick={() => { setAdminView("forgot"); setResetError(""); setResetOtp(""); }} className="w-full text-center text-xs text-white/30 hover:text-white/50">
                Resend code
              </button>
            </form>
          )}

          {/* Staff OTP form */}
          {tab === "staff" && otpStep === "email" && (
            <form onSubmit={submitRequestOtp} className="space-y-4">
              {staffError && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/8 px-3.5 py-2.5 text-xs text-red-400">
                  {staffError}
                </p>
              )}
              <div className="space-y-1">
                <label htmlFor="staff-email" className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">
                  Email
                </label>
                <div className="relative">
                  <HugeiconsIcon icon={Mail01Icon} size={14}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                  <Input id="staff-email" type="email" value={staffEmail} required
                    onChange={e => setStaffEmail(e.target.value)}
                    placeholder="staff@voltex.com"
                    className="h-11 rounded-xl border-white/8 bg-white/4 pl-9 text-sm text-white placeholder:text-white/20 focus-visible:border-primary/50 focus-visible:ring-0 focus-visible:bg-white/6"
                  />
                </div>
              </div>
              <Button type="submit" disabled={sendingOtp}
                className="h-11 w-full rounded-xl font-semibold gap-2 bg-primary text-primary-foreground">
                {sendingOtp ? "Sending OTP…" : "Send OTP"}
                <HugeiconsIcon icon={SmartPhone01Icon} size={15} />
              </Button>
            </form>
          )}

          {tab === "staff" && otpStep === "otp" && (
            <form onSubmit={submitVerifyOtp} className="space-y-4">
              <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                <p className="text-xs text-white/50">OTP sent to <span className="text-white/80">{staffEmail}</span></p>
              </div>

              {staffError && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/8 px-3.5 py-2.5 text-xs text-red-400">
                  {staffError}
                </p>
              )}

              <div className="space-y-1">
                <label htmlFor="otp" className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">
                  6-digit OTP
                </label>
                <Input id="otp" type="text" inputMode="numeric" maxLength={6} value={otp} required
                  onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="h-11 rounded-xl border-white/8 bg-white/4 text-center text-xl tracking-[0.5em] font-bold text-white placeholder:text-white/20 focus-visible:border-primary/50 focus-visible:ring-0"
                />
              </div>

              <Button type="submit" disabled={verifyingOtp || otp.length < 6}
                className="h-11 w-full rounded-xl font-semibold gap-2 bg-primary text-primary-foreground">
                {verifyingOtp ? "Verifying…" : "Verify OTP"}
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
              </Button>

              <button type="button"
                onClick={() => { setOtpStep("email"); setOtp(""); setStaffError(""); }}
                className="w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors">
                ← Use a different email
              </button>
            </form>
          )}
        </div>

        <p className="text-[11px] text-white/15">© 2026 VolteX</p>
      </div>
    </div>
  );
}
