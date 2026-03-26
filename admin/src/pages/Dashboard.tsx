import { useAuth } from "@/lib/auth-context";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const SUPER_ADMIN_STATS = [
  { label: "Total Revenue", value: "₹12,45,890", change: "+12.5%", up: true, icon: TrendingUp },
  { label: "Total Orders", value: "1,284", change: "+8.2%", up: true, icon: ShoppingCart },
  { label: "Total Customers", value: "3,421", change: "+15.3%", up: true, icon: Users },
  { label: "Total Products", value: "486", change: "-2.1%", up: false, icon: Package },
];

const PM_STATS = [
  { label: "Total Products", value: "486", change: "-2.1%", up: false, icon: Package },
  { label: "Low Stock Items", value: "23", change: "+5", up: false, icon: AlertTriangle },
  { label: "New This Month", value: "18", change: "+6", up: true, icon: TrendingUp },
];

const RECENT_ORDERS = [
  { id: "ORD-1284", customer: "Amit Patel", total: "₹69,999", status: "Processing", date: "26 Mar 2026" },
  { id: "ORD-1283", customer: "Sneha Reddy", total: "₹22,990", status: "Shipped", date: "25 Mar 2026" },
  { id: "ORD-1282", customer: "Rohit Singh", total: "₹9,990", status: "Delivered", date: "25 Mar 2026" },
  { id: "ORD-1281", customer: "Meera Iyer", total: "₹89,990", status: "Pending", date: "24 Mar 2026" },
  { id: "ORD-1280", customer: "Vikram Shah", total: "₹36,900", status: "Delivered", date: "24 Mar 2026" },
];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-400",
  Processing: "bg-blue-500/10 text-blue-400",
  Shipped: "bg-purple-500/10 text-purple-400",
  Delivered: "bg-green-500/10 text-green-400",
};

export default function Dashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const stats = isSuperAdmin ? SUPER_ADMIN_STATS : PM_STATS;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-sm text-white/40">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-white/50">
                  {stat.label}
                </span>
                <Icon size={18} className="text-white/30" />
              </div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <div className="mt-1 flex items-center gap-1">
                {stat.up ? (
                  <ArrowUpRight size={14} className="text-green-400" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-400" />
                )}
                <span
                  className={`text-xs font-semibold ${stat.up ? "text-green-400" : "text-red-400"}`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-white/30">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders (Super Admin only) */}
      {isSuperAdmin && (
        <div className="rounded-xl border border-white/10 bg-[#1a1a1a]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-base font-bold text-white">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-white/40">Order ID</th>
                  <th className="px-5 py-3 text-xs font-semibold text-white/40">Customer</th>
                  <th className="px-5 py-3 text-xs font-semibold text-white/40">Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-white/40">Total</th>
                  <th className="px-5 py-3 text-xs font-semibold text-white/40">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 last:border-none">
                    <td className="px-5 py-3 text-sm font-semibold text-[#49A5A2]">{order.id}</td>
                    <td className="px-5 py-3 text-sm text-white">{order.customer}</td>
                    <td className="px-5 py-3 text-sm text-white/50">{order.date}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-white">{order.total}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
