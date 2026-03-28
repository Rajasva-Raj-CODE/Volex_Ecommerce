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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "outline",
  Processing: "secondary",
  Shipped: "default",
  Delivered: "outline",
};

export default function Dashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const stats = isSuperAdmin ? SUPER_ADMIN_STATS : PM_STATS;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </span>
                  <Icon size={18} className="text-muted-foreground" />
                </div>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
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
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isSuperAdmin && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_ORDERS.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-semibold text-primary">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell className="font-semibold">{order.total}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[order.status] ?? "secondary"}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
