import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_ORDERS = [
  { id: "ORD-1284", customer: "Amit Patel", email: "amit@email.com", items: 2, total: 69999, status: "Processing", date: "26 Mar 2026", payment: "Credit Card" },
  { id: "ORD-1283", customer: "Sneha Reddy", email: "sneha@email.com", items: 1, total: 22990, status: "Shipped", date: "25 Mar 2026", payment: "UPI" },
  { id: "ORD-1282", customer: "Rohit Singh", email: "rohit@email.com", items: 3, total: 9990, status: "Delivered", date: "25 Mar 2026", payment: "Debit Card" },
  { id: "ORD-1281", customer: "Meera Iyer", email: "meera@email.com", items: 1, total: 89990, status: "Pending", date: "24 Mar 2026", payment: "Credit Card" },
  { id: "ORD-1280", customer: "Vikram Shah", email: "vikram@email.com", items: 2, total: 36900, status: "Delivered", date: "24 Mar 2026", payment: "UPI" },
  { id: "ORD-1279", customer: "Kavita Nair", email: "kavita@email.com", items: 1, total: 49900, status: "Processing", date: "23 Mar 2026", payment: "EMI" },
  { id: "ORD-1278", customer: "Arjun Das", email: "arjun@email.com", items: 4, total: 8999, status: "Cancelled", date: "23 Mar 2026", payment: "UPI" },
  { id: "ORD-1277", customer: "Pooja Gupta", email: "pooja@email.com", items: 1, total: 62990, status: "Shipped", date: "22 Mar 2026", payment: "Credit Card" },
];

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "outline",
  Processing: "secondary",
  Shipped: "default",
  Delivered: "outline",
  Cancelled: "destructive",
};

export default function Orders() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Orders</h1>
          <p className="text-sm text-muted-foreground">{MOCK_ORDERS.length} orders</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders..." className="h-8 pl-8" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ORDERS.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-primary">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{order.date}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{order.items}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">₹{order.total.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-muted-foreground">{order.payment}</TableCell>
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
    </>
  );
}
