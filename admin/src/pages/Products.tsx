import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon, Add02Icon, Edit02Icon, Trash, MoreVerticalIcon, Package01Icon, Copy01Icon, Tag01Icon, Money02Icon, DeliveryPackageIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
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

const MOCK_PRODUCTS = [
  { id: "1", name: "iPhone 16 Pro Max 256GB", category: "Phones", subcategory: "iPhone", price: 159900, stock: 12, status: "Active" },
  { id: "2", name: "Samsung Galaxy S24 Ultra", category: "Phones", subcategory: "Samsung Galaxy", price: 129999, stock: 18, status: "Active" },
  { id: "3", name: "OnePlus 12 256GB", category: "Phones", subcategory: "OnePlus", price: 64999, stock: 14, status: "Active" },
  { id: "4", name: "MacBook Air M3 13 inch", category: "Laptops", subcategory: "MacBook", price: 114900, stock: 6, status: "Active" },
  { id: "5", name: "Sony WH-1000XM5", category: "Audio", subcategory: "Headphones", price: 29990, stock: 20, status: "Active" },
  { id: "6", name: "Canon EOS R50", category: "Cameras", subcategory: "Mirrorless", price: 62990, stock: 5, status: "Low Stock" },
  { id: "7", name: "iPad Air M2 11 inch", category: "Tablets", subcategory: "iPad", price: 59900, stock: 10, status: "Active" },
  { id: "8", name: "JBL Flip 6", category: "Audio", subcategory: "Speakers", price: 8999, stock: 40, status: "Active" },
  { id: "9", name: "Apple Watch Series 9", category: "Wearables", subcategory: "Smartwatch", price: 44900, stock: 15, status: "Active" },
  { id: "10", name: "Samsung Galaxy S24+", category: "Phones", subcategory: "Samsung Galaxy", price: 99999, stock: 0, status: "Out of Stock" },
];

const STATUS_STYLES: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string; icon?: typeof MoreVerticalIcon }> = {
  Active: { variant: "outline", className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" },
  "Low Stock": { variant: "secondary", className: "bg-amber-50 text-amber-700 hover:bg-amber-50" },
  "Out of Stock": { variant: "destructive", className: "bg-red-50 text-red-700 hover:bg-red-50" },
};

const CATEGORY_COLORS: Record<string, string> = {
  Phones: "bg-blue-100 text-blue-700",
  Laptops: "bg-purple-100 text-purple-700",
  Audio: "bg-pink-100 text-pink-700",
  Cameras: "bg-orange-100 text-orange-700",
  Tablets: "bg-indigo-100 text-indigo-700",
  Wearables: "bg-green-100 text-green-700",
};

export default function Products() {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const filtered = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={Package01Icon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Products</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} of {MOCK_PRODUCTS.length} products</p>
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
            placeholder="Search products, categories..."
            className="pl-9 h-9"
          />
        </div>
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
                  <HugeiconsIcon icon={DeliveryPackageIcon} size={14} className="text-blue-600 hidden sm:flex" />
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
            {filtered.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <span className="font-medium">{product.name}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={`${CATEGORY_COLORS[product.category] || "bg-gray-100 text-gray-700"} text-[10px] font-medium border-0`}>
                      {product.category}
                    </Badge>
                    <HugeiconsIcon icon={MoreVerticalIcon} size={10} className="text-muted-foreground rotate-90" />
                    <span className="text-xs text-muted-foreground">{product.subcategory}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">₹{product.price.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-right">
                  <span className={`tabular-nums ${product.stock === 0 ? "text-red-600 font-medium" : product.stock < 10 ? "text-amber-600" : "text-muted-foreground"}`}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_STYLES[product.status]?.className || ""} variant={STATUS_STYLES[product.status]?.variant || "secondary"}>
                    {product.status}
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
                      <DropdownMenuItem className="gap-2">
                        <HugeiconsIcon icon={Copy01Icon} size={14} />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" className="gap-2">
                        <HugeiconsIcon icon={Trash} size={14} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
