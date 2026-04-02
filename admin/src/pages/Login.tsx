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
} from "@hugeicons/core-free-icons";
import { ZapIcon } from "lucide-react";

const METRICS = [
  { value: "₹12.4L", label: "Revenue",   sub: "+12.5% this month" },
  { value: "1,284",  label: "Orders",    sub: "+8.2% this month"  },
  { value: "3,421",  label: "Customers", sub: "+15.3% this month" },
];

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!login(email, password)) setError("Wrong email or password.");
    else navigate("/", { replace: true });
  };

  const quickFill = (e: string, p: string) => {
    setEmail(e); setPassword(p); setError("");
  };

  return (
    <div className="flex min-h-svh" style={{ backgroundColor: "oklch(0.13 0 0)" }}>

      {/* ── LEFT  brand panel ───────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[52%] flex-col justify-between overflow-hidden px-16 py-14"
        style={{ backgroundColor: "oklch(0.185 0.065 175)" }}>

        {/* big tinted "V" watermark */}
        <div
          className="pointer-events-none absolute -bottom-10 -left-8 select-none font-black leading-none text-white"
          style={{ fontSize: "clamp(260px,28vw,400px)", opacity: 0.04, letterSpacing: "-0.05em" }}
          aria-hidden
        >
          V
        </div>

        {/* top logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ backgroundColor: "oklch(0.685 0.135 175)" }}>
            <ZapIcon className="size-4" style={{ color: "oklch(0.13 0 0)" }} />
          </div>
          <span className="text-base font-bold tracking-tight text-white">VolteX</span>
        </div>

        {/* metrics — no cards, just numbers */}
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

        {/* tagline */}
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

        {/* form */}
        <div className="mx-auto w-full max-w-[360px]">

          <div className="mb-8 space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Sign in</h1>
            <p className="text-sm text-white/40">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/8 px-3.5 py-2.5 text-xs text-red-400">
                {error}
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

            <Button type="submit"
              className="h-11 w-full rounded-xl font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Continue
              <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
            </Button>
          </form>

          {/* quick fill */}
          <div className="mt-8 space-y-3">
            <p className="text-[11px] uppercase tracking-widest text-white/20">Demo accounts</p>
            <div className="space-y-2">
              {[
                { role: "Super Admin", email: "admin@voltex.com", pwd: "admin123" },
                { role: "Product Manager", email: "pm@voltex.com", pwd: "pm123" },
              ].map(acc => (
                <button key={acc.role} type="button"
                  onClick={() => quickFill(acc.email, acc.pwd)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/6 px-4 py-3 text-left transition-colors hover:border-primary/25 hover:bg-primary/5 group">
                  <div>
                    <p className="text-xs font-semibold text-white/60 group-hover:text-white/80 transition-colors">{acc.role}</p>
                    <p className="text-[11px] text-white/25 mt-0.5">{acc.email}</p>
                  </div>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={13} className="text-white/15 group-hover:text-primary/60 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-white/15">© 2026 VolteX</p>
      </div>
    </div>
  );
}
