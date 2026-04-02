import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon, ShoppingCart01Icon, CheckmarkCircle02Icon, HashtagIcon, UserIcon, Calendar02Icon, ArrowDown01Icon, WalletIcon, Package01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const STATUS_STYLES: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  Pending: { variant: "outline", className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50" },
  Processing: { variant: "secondary", className: "bg-blue-50 text-blue-700 hover:bg-blue-50" },
  Shipped: { variant: "default", className: "bg-purple-50 text-purple-700 hover:bg-purple-50" },
  Delivered: { variant: "outline", className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" },
  Cancelled: { variant: "destructive", className: "bg-red-50 text-red-700 hover:bg-red-50" },
};

const PAYMENT_COLORS: Record<string, string> = {
  "Credit Card": "bg-blue-100 text-blue-700",
  "Debit Card": "bg-indigo-100 text-indigo-700",
  "UPI": "bg-green-100 text-green-700",
  "EMI": "bg-purple-100 text-purple-700",
};

const STATUS_TABS = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = activeStatus === "All" || o.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={ShoppingCart01Icon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Orders</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} of {MOCK_ORDERS.length} orders</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon icon={Search02Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders, customers..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const count = tab === "All" ? MOCK_ORDERS.length : MOCK_ORDERS.filter((o) => o.status === tab).length;
          return (
            <Button
              key={tab}
              variant={activeStatus === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveStatus(tab)}
              className="h-8 gap-1.5 text-xs"
            >
              {tab}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${activeStatus === tab ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={HashtagIcon} size={14} className="text-purple-600 hidden sm:flex" />
                  <span>Order ID</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={UserIcon} size={14} className="text-blue-600 hidden sm:flex" />
                  <span>Customer</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Calendar02Icon} size={14} className="text-amber-600 hidden sm:flex" />
                  <span>Date</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <HugeiconsIcon icon={Package01Icon} size={14} className="text-indigo-600 hidden sm:flex" />
                  <span>Items</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-emerald-600 hidden sm:flex" />
                  <span>Total</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={WalletIcon} size={14} className="text-rose-600 hidden sm:flex" />
                  <span>Payment</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-cyan-600 hidden sm:flex" />
                  <span>Status</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-primary">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{order.items}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">₹{order.total.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge className={`${PAYMENT_COLORS[order.payment] || "bg-gray-100 text-gray-700"} text-[10px] font-medium border-0`}>
                      {order.payment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_STYLES[order.status]?.className || ""} variant={STATUS_STYLES[order.status]?.variant || "secondary"}>
                      {order.status === "Delivered" && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={10} className="mr-1" />}
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
