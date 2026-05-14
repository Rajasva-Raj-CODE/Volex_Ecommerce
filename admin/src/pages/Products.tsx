import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon, Add02Icon, Edit02Icon, Trash, MoreVerticalIcon, Package01Icon, Copy01Icon, Tag01Icon, Money02Icon, CheckmarkCircle02Icon, DeliveryDelay02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { listProducts, deleteProduct, type ApiProduct } from "@/lib/products-api";
import { ApiError } from "@/lib/api";
import { PaginationControls } from "@/components/pagination-controls";

function deriveStatus(product: ApiProduct): "Active" | "Low Stock" | "Out of Stock" | "Inactive" {
  if (!product.isActive) return "Inactive";
  if (product.stock === 0) return "Out of Stock";
  if (product.stock < 10) return "Low Stock";
  return "Active";
}

const STATUS_STYLES: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  Active: { variant: "outline", className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" },
  "Low Stock": { variant: "secondary", className: "bg-amber-50 text-amber-700 hover:bg-amber-50" },
  "Out of Stock": { variant: "destructive", className: "bg-red-50 text-red-700 hover:bg-red-50" },
  Inactive: { variant: "secondary", className: "bg-gray-50 text-gray-500 hover:bg-gray-50" },
};

const STATUS_TABS = ["All", "Active", "Low Stock", "Out of Stock", "Inactive"];
const PAGE_SIZE = 20;

export default function Products() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listProducts({
        page,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        isActive: activeStatus === "Inactive" ? false : activeStatus === "All" ? undefined : true,
        stockMin: activeStatus === "Active" ? 10 : activeStatus === "Low Stock" ? 1 : undefined,
        stockMax: activeStatus === "Low Stock" ? 9 : activeStatus === "Out of Stock" ? 0 : undefined,
      });
      setProducts(result.products);
      setTotalProducts(result.pagination.total);
      setTotalPages(result.pagination.totalPages || 1);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [activeStatus, page, search]);

  useEffect(() => {
    const timeout = setTimeout(() => void fetchProducts(), 250);
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [search, activeStatus]);

  async function handleDelete(product: ApiProduct) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      await fetchProducts();
      toast.success(`"${product.name}" deleted`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={Package01Icon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Products</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading…" : `${products.length} of ${totalProducts} products`}
            </p>
          </div>
        </div>
        <Button onClick={() => navigate("/products/add")} className="gap-2">
          <HugeiconsIcon icon={Add02Icon} size={16} />
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon icon={Search02Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, categories, brands…"
            className="pl-9 h-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => void fetchProducts()} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const count = tab === activeStatus ? totalProducts : "";
          return (
            <Button
              key={tab}
              variant={activeStatus === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveStatus(tab)}
              className="h-8 gap-1.5 text-xs"
            >
              {tab}
              {count !== "" && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${activeStatus === tab ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                  {count}
                </span>
              )}
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
                  <HugeiconsIcon icon={Package01Icon} size={14} className="text-emerald-600 hidden sm:flex" />
                  <span>Product</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Tag01Icon} size={14} className="text-purple-600 hidden sm:flex" />
                  <span>Category</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <HugeiconsIcon icon={Money02Icon} size={14} className="text-amber-600 hidden sm:flex" />
                  <span>Price</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <HugeiconsIcon icon={DeliveryDelay02Icon} size={14} className="text-blue-600 hidden sm:flex" />
                  <span>Stock</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-rose-600 hidden sm:flex" />
                  <span>Status</span>
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  Loading products…
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No products match your filters.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const status = deriveStatus(product);
                return (
                  <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div>
                        <span className="font-medium">{product.name}</span>
                        {product.brand && (
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {product.category?.name ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                      {product.mrp && Number(product.mrp) > Number(product.price) && (
                        <p className="text-xs text-muted-foreground line-through">
                          ₹{Number(product.mrp).toLocaleString("en-IN")}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`tabular-nums ${product.stock === 0 ? "text-red-600 font-medium" : product.stock < 10 ? "text-amber-600" : "text-muted-foreground"}`}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_STYLES[status]?.className || ""} variant={STATUS_STYLES[status]?.variant || "secondary"}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" className="size-8 text-muted-foreground data-open:bg-muted" size="icon" />
                          }
                        >
                          <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                          <span className="sr-only">Open menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => navigate(`/products/edit/${product.id}`)} className="gap-2">
                            <HugeiconsIcon icon={Edit02Icon} size={14} />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => {
                              navigator.clipboard.writeText(product.id);
                              toast.success("Product ID copied");
                            }}
                          >
                            <HugeiconsIcon icon={Copy01Icon} size={14} />
                            Copy ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            className="gap-2"
                            disabled={deletingId === product.id}
                            onClick={() => handleDelete(product)}
                          >
                            <HugeiconsIcon icon={Trash} size={14} />
                            {deletingId === product.id ? "Deleting…" : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
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
