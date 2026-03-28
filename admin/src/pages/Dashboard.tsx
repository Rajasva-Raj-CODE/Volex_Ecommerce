import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {
  TrendingUpIcon,
  TrendingDownIcon,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
} from "lucide-react";

const SUPER_ADMIN_STATS = [
  { label: "Total Revenue", value: "₹12,45,890", change: "+12.5%", up: true, description: "Trending up this month", detail: "Revenue for the last 6 months" },
  { label: "Total Orders", value: "1,284", change: "+8.2%", up: true, description: "Strong order volume", detail: "Orders processed this month" },
  { label: "Total Customers", value: "3,421", change: "+15.3%", up: true, description: "Growing customer base", detail: "Active customers on platform" },
  { label: "Total Products", value: "486", change: "-2.1%", up: false, description: "Slight decrease", detail: "Products in catalog" },
];

const PM_STATS = [
  { label: "Total Products", value: "486", change: "-2.1%", up: false, description: "Slight decrease", detail: "Products in catalog" },
  { label: "Low Stock Items", value: "23", change: "+5", up: false, description: "Needs attention", detail: "Items below threshold" },
  { label: "New This Month", value: "18", change: "+6", up: true, description: "Growing catalog", detail: "Products added recently" },
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
    <>
      {/* Section Cards */}
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="@container/card">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stat.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {stat.up ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  {stat.change}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stat.description}{" "}
                {stat.up ? (
                  <TrendingUpIcon className="size-4" />
                ) : (
                  <TrendingDownIcon className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">{stat.detail}</div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Chart */}
      {isSuperAdmin && <ChartAreaInteractive />}

      {/* Recent Orders Table */}
      {isSuperAdmin && (
        <div className="overflow-hidden rounded-lg border">
          <div className="px-4 py-3">
            <h2 className="text-base font-medium">Recent Orders</h2>
            <p className="text-sm text-muted-foreground">Latest orders from customers</p>
          </div>
          <Table>
            <TableHeader className="bg-muted">
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
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-primary">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
                  <TableCell className="text-right tabular-nums">{order.total}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[order.status] ?? "secondary"}>
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
