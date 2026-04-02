import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  ViewIcon,
  ViewOffIcon,
  Mail01Icon,
  LockPasswordIcon,
  ShoppingCart01Icon,
  Package01Icon,
  UserGroupIcon,
  DollarCircleIcon,
  ArrowUpRight01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { ZapIcon } from "lucide-react";

/* ─── mock data ─────────────────────────────────── */
const STATS = [
  { label: "Revenue",   value: "₹12.4L", change: "+12.5%", icon: DollarCircleIcon,  iconCls: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Orders",    value: "1,284",  change: "+8.2%",  icon: ShoppingCart01Icon, iconCls: "text-blue-400",    bg: "bg-blue-400/10"   },
  { label: "Customers", value: "3,421",  change: "+15.3%", icon: UserGroupIcon,       iconCls: "text-violet-400", bg: "bg-violet-400/10" },
];

const ORDERS = [
  { id: "ORD-1284", name: "Amit Patel",   amt: "₹69,999", status: "Processing", dot: "bg-blue-400"    },
  { id: "ORD-1283", name: "Sneha Reddy",  amt: "₹22,990", status: "Shipped",    dot: "bg-violet-400"  },
  { id: "ORD-1282", name: "Rohit Singh",  amt: "₹9,990",  status: "Delivered",  dot: "bg-emerald-400" },
  { id: "ORD-1281", name: "Meera Iyer",   amt: "₹89,990", status: "Pending",    dot: "bg-amber-400"   },
];

/* simple SVG sparkline */
const Spark = () => (
  <svg viewBox="0 0 160 36" className="w-full h-9" preserveAspectRatio="none">
    <defs>
      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4ade80" stopOpacity=".25" />
        <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M0,28 C15,24 25,14 40,16 C55,18 65,6 80,9 C95,12 105,22 120,16 C135,10 145,3 160,5"
      fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M0,28 C15,24 25,14 40,16 C55,18 65,6 80,9 C95,12 105,22 120,16 C135,10 145,3 160,5 L160,36 L0,36Z"
      fill="url(#sg)" />
  </svg>
);

export default function Login() {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPwd, setShowPwd]       = useState(false);
  const [error, setError]           = useState("");
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!login(email, password)) setError("Invalid email or password.");
    else navigate("/", { replace: true });
  };

  const fill = (e: string, p: string) => { setEmail(e); setPassword(p); setError(""); };

  return (
    <div className="flex min-h-svh" style={{ background: "oklch(0.13 0 0)" }}>

      {/* ════════ LEFT ════════ */}
      <div
        className="relative flex w-full flex-col lg:w-[44%]"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.28 0 0) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {/* subtle vignette so dots fade near center */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, oklch(0.13 0 0 / 0) 30%, oklch(0.13 0 0 / .85) 100%)" }} />

        <div className="relative flex flex-1 flex-col justify-between p-8 lg:p-12">

          {/* logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <ZapIcon className="size-4" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white">VolteX</span>
            <span className="ml-0.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/40 uppercase tracking-widest">
              Admin
            </span>
          </div>

          {/* form area */}
          <div className="mx-auto w-full max-w-[360px] space-y-7">

            <div className="space-y-1.5">
              <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-white">
                Welcome back<span className="text-primary">.</span>
              </h1>
              <p className="text-sm text-white/40">Sign in to your admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* error */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5">
                  <HugeiconsIcon icon={AlertCircleIcon} size={14} className="shrink-0 text-red-400" />
                  <span className="text-xs text-red-400">{error}</span>
                </div>
              )}

              {/* email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                  Email
                </label>
                <div className="relative group">
                  <HugeiconsIcon icon={Mail01Icon} size={14}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-primary/70" />
                  <Input id="email" type="email" value={email} required
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@voltex.com"
                    className="h-11 rounded-xl border-white/8 bg-white/4 pl-9 text-sm text-white placeholder:text-white/20 focus-visible:border-primary/40 focus-visible:bg-white/6 focus-visible:ring-0 transition-all"
                  />
                </div>
              </div>

              {/* password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                  Password
                </label>
                <div className="relative group">
                  <HugeiconsIcon icon={LockPasswordIcon} size={14}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-primary/70" />
                  <Input id="password" type={showPwd ? "text" : "password"} value={password} required
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-white/8 bg-white/4 pl-9 pr-10 text-sm text-white placeholder:text-white/20 focus-visible:border-primary/40 focus-visible:bg-white/6 focus-visible:ring-0 transition-all"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                    <HugeiconsIcon icon={showPwd ? ViewOffIcon : ViewIcon} size={14} />
                  </button>
                </div>
              </div>

              {/* submit */}
              <Button type="submit"
                className="mt-1 h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 transition-all gap-2">
                Sign In
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
              </Button>
            </form>

            {/* quick-fill */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/6" />
                <span className="text-[11px] text-white/25 uppercase tracking-widest">Quick fill</span>
                <div className="h-px flex-1 bg-white/6" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button type="button"
                  onClick={() => fill("admin@voltex.com", "admin123")}
                  className="group flex flex-col rounded-xl border border-white/8 bg-white/3 p-3 text-left hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-primary/60 transition-colors">Super Admin</span>
                  <span className="mt-1 text-xs text-white/55">admin@voltex.com</span>
                </button>
                <button type="button"
                  onClick={() => fill("pm@voltex.com", "pm123")}
                  className="group flex flex-col rounded-xl border border-white/8 bg-white/3 p-3 text-left hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-primary/60 transition-colors">Product Mgr</span>
                  <span className="mt-1 text-xs text-white/55">pm@voltex.com</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-white/20">© 2026 VolteX. All rights reserved.</p>
        </div>
      </div>

      {/* ════════ RIGHT ════════ */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[56%] flex-col items-center justify-center"
        style={{ background: "linear-gradient(145deg, oklch(0.30 0.13 175) 0%, oklch(0.20 0.09 178) 55%, oklch(0.16 0.06 188) 100%)" }}>

        {/* dot grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* glow orbs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "oklch(0.65 0.18 175 / 0.22)" }} />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "oklch(0.65 0.18 175 / 0.16)" }} />

        {/* corner zap badge */}
        <div className="absolute top-8 right-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/8 backdrop-blur-md shadow-xl">
          <ZapIcon className="size-5 text-white/80" />
        </div>

        {/* ── main dashboard card (3-D tilt) ── */}
        <div className="relative w-full max-w-[500px] px-8"
          style={{ perspective: "1200px" }}>
          <div className="rounded-2xl border border-white/12 bg-white/6 backdrop-blur-md shadow-2xl overflow-hidden"
            style={{ transform: "rotateX(4deg) rotateY(-3deg)", transformStyle: "preserve-3d" }}>

            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-white/8 bg-white/4 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/8 px-3 py-1">
                <ZapIcon className="size-3 text-primary/80" />
                <span className="text-[11px] font-medium text-white/60">voltex.admin</span>
              </div>
            </div>

            {/* stat cards row */}
            <div className="grid grid-cols-3 gap-2.5 p-4">
              {STATS.map(s => (
                <div key={s.label} className="rounded-xl border border-white/8 bg-white/4 p-3">
                  <div className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg ${s.bg}`}>
                    <HugeiconsIcon icon={s.icon} size={14} className={s.iconCls} />
                  </div>
                  <p className="text-[10px] text-white/40 mb-0.5">{s.label}</p>
                  <p className="text-sm font-bold text-white">{s.value}</p>
                  <div className="mt-1 flex items-center gap-0.5">
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={10} className="text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-medium">{s.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* sparkline */}
            <div className="mx-4 mb-3 rounded-xl border border-white/8 bg-white/3 px-3 pt-3 pb-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-white/50">Revenue · Last 7 days</span>
                <span className="text-[10px] font-bold text-emerald-400">₹12.4L</span>
              </div>
              <Spark />
            </div>

            {/* orders table */}
            <div className="mx-4 mb-4 rounded-xl border border-white/8 bg-white/3 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/6 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={ShoppingCart01Icon} size={12} className="text-primary/70" />
                  <span className="text-[10px] font-semibold text-white/60">Recent Orders</span>
                </div>
                <span className="text-[10px] text-white/30">Today</span>
              </div>
              {ORDERS.map(o => (
                <div key={o.id} className="flex items-center gap-2.5 border-b border-white/4 last:border-0 px-3 py-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <span className="text-[9px] font-bold text-white/60">
                      {o.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-white/80 truncate">{o.name}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-white/70">{o.amt}</span>
                  <div className="flex items-center gap-1">
                    <div className={`h-1.5 w-1.5 rounded-full ${o.dot}`} />
                    <span className="text-[10px] text-white/45">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* floating notification card */}
          <div className="absolute -bottom-5 -right-2 w-52 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-xl shadow-2xl"
            style={{ transform: "rotateX(2deg) rotateY(-1deg)" }}>
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white">Order Delivered</p>
                <p className="text-[10px] text-white/45 mt-0.5">ORD-1282 · Rohit Singh</p>
                <p className="text-[10px] text-emerald-400 mt-1 font-medium">₹9,990</p>
              </div>
            </div>
          </div>

          {/* floating products pill */}
          <div className="absolute -top-4 -left-3 flex items-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-3.5 py-2.5 backdrop-blur-xl shadow-xl">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
              <HugeiconsIcon icon={Package01Icon} size={13} className="text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white">486 Products</p>
              <p className="text-[10px] text-white/40">23 low stock</p>
            </div>
          </div>
        </div>

        {/* tagline */}
        <div className="relative mt-12 text-center px-8">
          <p className="text-xl font-bold text-white leading-snug">
            Run your store.<br />
            <span className="text-primary">Own the numbers.</span>
          </p>
          <p className="mt-2 text-xs text-white/35">Full-stack ecommerce management for VolteX</p>
        </div>
      </div>

    </div>
  );
}
