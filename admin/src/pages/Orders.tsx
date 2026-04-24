import { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon, ShoppingCart01Icon, CheckmarkCircle02Icon, HashtagIcon, UserIcon, Calendar02Icon, ArrowDown01Icon, Package01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { listAllOrders, updateOrderStatus, type ApiOrder, type OrderStatus } from "@/lib/orders-api";
import { ApiError } from "@/lib/api";

const STATUS_STYLES: Record<OrderStatus, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  PENDING: { variant: "outline", className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50" },
  CONFIRMED: { variant: "secondary", className: "bg-blue-50 text-blue-700 hover:bg-blue-50" },
  SHIPPED: { variant: "default", className: "bg-purple-50 text-purple-700 hover:bg-purple-50" },
  DELIVERED: { variant: "outline", className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" },
  CANCELLED: { variant: "destructive", className: "bg-red-50 text-red-700 hover:bg-red-50" },
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_TABS: Array<"All" | OrderStatus> = ["All", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const NEXT_STATUSES: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Orders() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<"All" | OrderStatus>("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listAllOrders({ limit: 100 });
      setOrders(result.orders);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.user.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      o.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = activeStatus === "All" || o.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  async function handleStatusUpdate(order: ApiOrder, status: OrderStatus) {
    setUpdatingId(order.id);
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      toast.success(`Order ${order.id} marked as ${STATUS_LABEL[status]}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={ShoppingCart01Icon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Orders</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading…" : `${filtered.length} of ${orders.length} orders`}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon icon={Search02Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders, customers…"
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const count = tab === "All"
            ? orders.length
            : orders.filter((o) => o.status === tab).length;
          return (
            <Button
              key={tab}
              variant={activeStatus === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveStatus(tab)}
              className="h-8 gap-1.5 text-xs"
            >
              {tab === "All" ? "All" : STATUS_LABEL[tab]}
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
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-cyan-600 hidden sm:flex" />
                  <span>Status</span>
                </div>
              </TableHead>
              <TableHead className="w-24 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Loading orders…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  {orders.length === 0 ? "No orders yet." : "No orders match your filters."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => {
                const nextStatuses = NEXT_STATUSES[order.status];
                return (
                  <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-primary font-mono text-sm">
                      {order.id.slice(0, 8)}…
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.user.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{order.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{order.items.length}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_STYLES[order.status]?.className || ""} variant={STATUS_STYLES[order.status]?.variant || "secondary"}>
                        {order.status === "DELIVERED" && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={10} className="mr-1" />}
                        {STATUS_LABEL[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {nextStatuses && nextStatuses.length > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                disabled={updatingId === order.id}
                              />
                            }
                          >
                            {updatingId === order.id ? "Updating…" : "Update"}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {nextStatuses.map((s) => (
                              <DropdownMenuItem
                                key={s}
                                onClick={() => handleStatusUpdate(order, s)}
                                className={s === "CANCELLED" ? "text-destructive" : ""}
                              >
                                Mark as {STATUS_LABEL[s]}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
