import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search02Icon,
  UserGroupIcon,
  Mail02Icon,
  UserIcon,
  Calendar02Icon,
  ArrowDown01Icon,
  HashtagIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/lib/api";
import { listCustomers, type ApiCustomer } from "@/lib/users-api";
import { PaginationControls } from "@/components/pagination-controls";

type StatusTab = "All" | "Active" | "Inactive";

const STATUS_TABS: StatusTab[] = ["All", "Active", "Inactive"];
const PAGE_SIZE = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string | null, email: string) {
  if (name?.trim()) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export default function Customers() {
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<StatusTab>("All");

  useEffect(() => {
    const timeout = setTimeout(() => {
      void (async () => {
        setLoading(true);
        try {
          const data = await listCustomers({
            page,
            limit: PAGE_SIZE,
            search: search.trim() || undefined,
            isActive:
              activeStatus === "All"
                ? undefined
                : activeStatus === "Active",
          });
          setCustomers(data.users);
          setTotalCustomers(data.pagination.total);
          setTotalPages(data.pagination.totalPages || 1);
        } catch (err) {
          toast.error(err instanceof ApiError ? err.message : "Failed to load customers");
        } finally {
          setLoading(false);
        }
      })();
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, activeStatus, page]);

  useEffect(() => {
    setPage(1);
  }, [search, activeStatus]);

  const statusCounts = useMemo(() => {
    const active = customers.filter((customer) => customer.isActive).length;
    const inactive = customers.length - active;
    return {
      All: totalCustomers,
      Active: active,
      Inactive: inactive,
    };
  }, [customers, totalCustomers]);

  async function refreshCustomers() {
    setLoading(true);
    try {
      const data = await listCustomers({
        page,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        isActive:
          activeStatus === "All"
            ? undefined
            : activeStatus === "Active",
      });
      setCustomers(data.users);
      setTotalCustomers(data.pagination.total);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={UserGroupIcon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Customers</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading…" : `${customers.length} of ${totalCustomers} customers`}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => void refreshCustomers()} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon
            icon={Search02Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab}
            variant={activeStatus === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveStatus(tab)}
            className="h-8 gap-1.5 text-xs"
          >
            {tab}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                activeStatus === tab
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {statusCounts[tab]}
            </span>
          </Button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={UserIcon} size={14} className="text-blue-600 hidden sm:flex" />
                  <span>Customer</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Mail02Icon} size={14} className="text-purple-600 hidden sm:flex" />
                  <span>Email</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Calendar02Icon} size={14} className="text-indigo-600 hidden sm:flex" />
                  <span>Joined</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <HugeiconsIcon icon={HashtagIcon} size={14} className="text-amber-600 hidden sm:flex" />
                  <span>Orders</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-emerald-600 hidden sm:flex" />
                  <span>Total Spend</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={UserGroupIcon} size={14} className="text-cyan-600 hidden sm:flex" />
                  <span>Status</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  Loading customers…
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-medium">
                          {getInitials(customer.name, customer.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name ?? "Unnamed Customer"}</p>
                        <p className="text-xs text-muted-foreground">ID: {customer.id.slice(0, 8)}…</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{customer.email}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(customer.createdAt)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{customer.ordersCount}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    ₹{customer.totalSpend.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.isActive ? "outline" : "secondary"}
                      className={
                        customer.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }
                    >
                      {customer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
        <PaginationControls page={page} totalPages={totalPages} disabled={loading} onPageChange={setPage} />
      </div>
    </>
  );
}
