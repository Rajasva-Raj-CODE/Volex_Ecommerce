import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
} from "@hugeicons/core-free-icons";
import { ZapIcon } from "lucide-react";

const STAT_CARDS = [
  { label: "Total Revenue", value: "₹12,45,890", change: "+12.5%", icon: DollarCircleIcon, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Orders", value: "1,284", change: "+8.2%", icon: ShoppingCart01Icon, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Customers", value: "3,421", change: "+15.3%", icon: UserGroupIcon, color: "text-purple-400", bg: "bg-purple-400/10" },
];

const RECENT_ORDERS = [
  { id: "ORD-1284", name: "Amit Patel", amount: "₹69,999", status: "Processing" },
  { id: "ORD-1283", name: "Sneha Reddy", amount: "₹22,990", status: "Shipped" },
  { id: "ORD-1282", name: "Rohit Singh", amount: "₹9,990", status: "Delivered" },
];

const STATUS_COLOR: Record<string, string> = {
  Processing: "text-blue-400",
  Shipped: "text-purple-400",
  Delivered: "text-emerald-400",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password);
    if (success) {
      navigate("/", { replace: true });
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-svh bg-[oklch(0.145_0_0)]">

      {/* ── Left: Login Form ── */}
      <div className="flex w-full flex-col justify-between p-8 lg:w-[45%] lg:p-14">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ZapIcon className="size-4" />
          </div>
          <span className="text-base font-semibold text-foreground">VolteX</span>
          <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Admin</span>
        </div>

        {/* Form */}
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back.
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your admin account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2.5">
                <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@voltex.com"
                  required
                  className="h-11 pl-10 bg-[oklch(0.205_0_0)] border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 pl-10 pr-10 bg-[oklch(0.205_0_0)] border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} size={15} />
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Sign In
            </Button>
          </form>

          {/* Credentials hint */}
          <div className="rounded-xl border border-border bg-[oklch(0.205_0_0)] p-4 space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Demo Credentials</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Super Admin</span>
                <span className="text-xs font-medium text-foreground">admin@voltex.com · admin123</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Product Mgr</span>
                <span className="text-xs font-medium text-foreground">pm@voltex.com · pm123</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © 2026 VolteX. All rights reserved.
        </p>
      </div>

      {/* ── Right: Branded Panel ── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[55%] flex-col"
        style={{ background: "linear-gradient(135deg, oklch(0.32 0.14 175) 0%, oklch(0.22 0.10 175) 50%, oklch(0.18 0.08 185) 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.75 0.18 175), transparent 70%)" }} />
        <div className="absolute bottom-0 -left-20 h-64 w-64 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.75 0.18 175), transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, white, transparent 70%)" }} />

        {/* Hex decoration */}
        <div className="absolute top-10 right-12 flex h-16 w-16 items-center justify-center opacity-30"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", background: "oklch(0.75 0.18 175 / 0.4)" }}>
          <ZapIcon className="size-6 text-white" />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-center px-12 py-16 gap-6">

          {/* Stat cards row */}
          <div className="flex gap-3 w-full max-w-lg">
            {STAT_CARDS.map((stat) => (
              <div key={stat.label} className="flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
                <div className={`mb-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                  <HugeiconsIcon icon={stat.icon} size={16} className={stat.color} />
                </div>
                <p className="text-[11px] text-white/50 mb-1">{stat.label}</p>
                <p className="text-base font-bold text-white">{stat.value}</p>
                <div className="mt-1 flex items-center gap-1">
                  <HugeiconsIcon icon={ArrowUpRight01Icon} size={11} className="text-emerald-400" />
                  <span className="text-[11px] text-emerald-400 font-medium">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main dashboard card */}
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/30">
                  <HugeiconsIcon icon={ShoppingCart01Icon} size={13} className="text-primary" />
                </div>
                <span className="text-xs font-semibold text-white">Recent Orders</span>
              </div>
              <span className="text-[11px] text-white/40">Today</span>
            </div>
            {/* Order rows */}
            <div className="divide-y divide-white/5">
              {RECENT_ORDERS.map((order) => (
                <div key={order.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <span className="text-[10px] font-bold text-white/70">
                      {order.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{order.name}</p>
                    <p className="text-[11px] text-white/40">{order.id}</p>
                  </div>
                  <span className="text-xs font-semibold text-white">{order.amount}</span>
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} className={STATUS_COLOR[order.status]} />
                    <span className={`text-[11px] font-medium ${STATUS_COLOR[order.status]}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products badge */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-3.5 w-full max-w-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20">
              <HugeiconsIcon icon={Package01Icon} size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">486 Products</p>
              <p className="text-[11px] text-white/40">18 added this month</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-emerald-400">23 Low Stock</p>
              <p className="text-[11px] text-white/40">needs attention</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center space-y-1.5 mt-2">
            <h2 className="text-2xl font-bold text-white leading-tight">
              Power your store.<br />Effortlessly.
            </h2>
            <p className="text-sm text-white/50">Everything you need to manage VolteX</p>
          </div>
        </div>
      </div>

    </div>
  );
}
