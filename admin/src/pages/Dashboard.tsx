import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import {
  Card,

  CardFooter,
  CardHeader,
  
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { HugeiconsIcon } from "@hugeicons/react";
import { ApiError } from "@/lib/api";
import { getDashboardSummary, type DashboardSummary } from "@/lib/dashboard-api";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarCircleIcon, 
  ShoppingCart01Icon, 
  UserGroupIcon, 
  Package01Icon, 
  AlertCircleIcon,
  Add01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  SHIPPED: "default",
  DELIVERED: "outline",
  CANCELLED: "destructive",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-600 bg-amber-50",
  CONFIRMED: "text-blue-600 bg-blue-50",
  SHIPPED: "text-purple-600 bg-purple-50",
  DELIVERED: "text-emerald-600 bg-emerald-50",
  CANCELLED: "text-red-600 bg-red-50",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

function formatCurrency(value: string | number) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      setLoading(true);
      try {
        const result = await getDashboardSummary();
        if (!cancelled) setSummary(result);
      } catch (err) {
        if (!cancelled) {
          toast.error(err instanceof ApiError ? err.message : "Failed to load dashboard");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSummary();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const totals = summary?.totals;
    const allStats = [
      { label: "Total Revenue", value: totals ? formatCurrency(totals.revenue) : "—", change: totals ? formatCurrency(totals.monthlyRevenue) : "—", up: true, description: "Revenue this month", detail: "All paid order revenue", icon: DollarCircleIcon, color: "text-emerald-500" },
      { label: "Total Orders", value: totals ? totals.orders.toLocaleString("en-IN") : "—", change: totals ? `+${totals.monthlyOrders}` : "—", up: true, description: "Orders this month", detail: "Total orders processed", icon: ShoppingCart01Icon, color: "text-blue-500" },
      { label: "Total Customers", value: totals ? totals.customers.toLocaleString("en-IN") : "—", change: "Live", up: true, description: "Customer accounts", detail: "Registered customer users", icon: UserGroupIcon, color: "text-purple-500" },
      { label: "Total Products", value: totals ? totals.products.toLocaleString("en-IN") : "—", change: totals ? `+${totals.newProductsThisMonth}` : "—", up: true, description: "Catalog size", detail: "Products added this month", icon: Package01Icon, color: "text-orange-500" },
    ];

    const staffStats = [
      allStats[3],
      { label: "Low Stock Items", value: totals ? totals.lowStockItems.toLocaleString("en-IN") : "—", change: totals ? `${totals.lowStockItems}` : "—", up: false, description: "Needs attention", detail: "Active products at 5 or fewer units", icon: AlertCircleIcon, color: "text-red-500" },
      { label: "New This Month", value: totals ? totals.newProductsThisMonth.toLocaleString("en-IN") : "—", change: totals ? `+${totals.newProductsThisMonth}` : "—", up: true, description: "Growing catalog", detail: "Products added recently", icon: Add01Icon, color: "text-green-500" },
    ];

    return isAdmin ? allStats : staffStats;
  }, [isAdmin, summary]);

  return (
    <>
      {/* Section Cards */}
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="@container/card hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-background ${stat.color}`}>
                      <HugeiconsIcon icon={Icon} size={18} />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                  </div>
                  <Badge variant={stat.up ? "default" : "destructive"} className={stat.up ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                    {stat.up ? <HugeiconsIcon icon={TrendingUp} size={12} className="mr-1" /> : <HugeiconsIcon icon={TrendingDown} size={12} className="mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
              </CardHeader>
              <div className="px-6 py-2">
                <div className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {loading ? "…" : stat.value}
                </div>
              </div>
              <CardFooter className="flex-col items-start gap-1.5 pt-2 text-sm">
                <div className="line-clamp-1 flex items-center gap-2 font-medium">
                  {stat.description}
                  {stat.up ? (
                    <HugeiconsIcon icon={TrendingUp} size={16} className="text-emerald-500" />
                  ) : (
                    <HugeiconsIcon icon={TrendingDown} size={16} className="text-red-500" />
                  )}
                </div>
                <div className="text-muted-foreground">{stat.detail}</div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      {isAdmin && <ChartAreaInteractive />}

      {/* Recent Orders Table */}
      {isAdmin && (
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon icon={ShoppingCart01Icon} size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-medium">Recent Orders</h2>
              <p className="text-sm text-muted-foreground">Latest orders from customers</p>
            </div>
          </div>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary?.recentOrders.length ? summary.recentOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-primary">{order.id.slice(0, 8)}…</TableCell>
                  <TableCell className="font-medium">{order.user.name ?? order.user.email}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[order.status] ?? "secondary"} className={STATUS_COLORS[order.status]}>
                      {order.status === "DELIVERED" && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} className="mr-1" />}
                      {STATUS_LABEL[order.status] ?? order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    {loading ? "Loading recent orders…" : "No orders yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
