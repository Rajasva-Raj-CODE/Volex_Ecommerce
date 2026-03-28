import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, EllipsisVerticalIcon } from "lucide-react";
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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Active: "outline",
  "Low Stock": "secondary",
  "Out of Stock": "destructive",
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
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">{MOCK_PRODUCTS.length} products total</p>
        </div>
        <Button onClick={() => navigate("/products/add")}>
          <Plus /> Add Product
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, categories..."
            className="h-8 pl-8"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <span className="font-medium">{product.name}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
                    <span className="text-xs">&rarr;</span>
                    <Badge variant="outline" className="text-[10px]">{product.subcategory}</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">₹{product.price.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{product.stock}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[product.status] ?? "secondary"}>
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
                      <EllipsisVerticalIcon />
                      <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => navigate(`/products/edit/${product.id}`)}>
                        <Pencil /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>Make a copy</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <Trash2 /> Delete
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
