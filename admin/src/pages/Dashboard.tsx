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

const SUPER_ADMIN_STATS = [
  { label: "Total Revenue", value: "₹12,45,890", change: "+12.5%", up: true, description: "Trending up this month", detail: "Revenue for the last 6 months", icon: DollarCircleIcon, color: "text-emerald-500" },
  { label: "Total Orders", value: "1,284", change: "+8.2%", up: true, description: "Strong order volume", detail: "Orders processed this month", icon: ShoppingCart01Icon, color: "text-blue-500" },
  { label: "Total Customers", value: "3,421", change: "+15.3%", up: true, description: "Growing customer base", detail: "Active customers on platform", icon: UserGroupIcon, color: "text-purple-500" },
  { label: "Total Products", value: "486", change: "-2.1%", up: false, description: "Slight decrease", detail: "Products in catalog", icon: Package01Icon, color: "text-orange-500" },
];

const PM_STATS = [
  { label: "Total Products", value: "486", change: "-2.1%", up: false, description: "Slight decrease", detail: "Products in catalog", icon: Package01Icon, color: "text-orange-500" },
  { label: "Low Stock Items", value: "23", change: "+5", up: false, description: "Needs attention", detail: "Items below threshold", icon: AlertCircleIcon, color: "text-red-500" },
  { label: "New This Month", value: "18", change: "+6", up: true, description: "Growing catalog", detail: "Products added recently", icon: Add01Icon, color: "text-green-500" },
];

const RECENT_ORDERS = [
  { id: "ORD-1284", customer: "Amit Patel", total: "₹69,999", status: "Processing", date: "26 Mar 2026" },
  { id: "ORD-1283", customer: "Sneha Reddy", total: "₹22,990", status: "Shipped", date: "25 Mar 2026" },
  { id: "ORD-1282", customer: "Rohit Singh", total: "₹9,990", status: "Delivered", date: "25 Mar 2026" },
  { id: "ORD-1281", customer: "Meera Iyer", total: "₹89,990", status: "Pending", date: "24 Mar 2026" },
  { id: "ORD-1280", customer: "Vikram Shah", total: "₹36,900", status: "Delivered", date: "24 Mar 2026" },
];

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "outline",
  Processing: "secondary",
  Shipped: "default",
  Delivered: "outline",
};

const STATUS_COLORS: Record<string, string> = {
  Pending: "text-amber-600 bg-amber-50",
  Processing: "text-blue-600 bg-blue-50",
  Shipped: "text-purple-600 bg-purple-50",
  Delivered: "text-emerald-600 bg-emerald-50",
};

export default function Dashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const stats = isSuperAdmin ? SUPER_ADMIN_STATS : PM_STATS;

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
                  {stat.value}
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
      {isSuperAdmin && <ChartAreaInteractive />}

      {/* Recent Orders Table */}
      {isSuperAdmin && (
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
              {RECENT_ORDERS.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-primary">{order.id}</TableCell>
                  <TableCell className="font-medium">{order.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{order.total}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[order.status] ?? "secondary"} className={STATUS_COLORS[order.status]}>
                      {order.status === "Delivered" && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} className="mr-1" />}
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
