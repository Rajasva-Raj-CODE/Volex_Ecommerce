import { useState } from "react";
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
  { id: "1", name: "Croma 80 cm HD Ready LED TV", category: "TV & Entertainment", price: 9990, stock: 45, status: "Active", image: "📺" },
  { id: "2", name: "Croma 5.1 Channel 340W Soundbar", category: "Audio", price: 10990, stock: 12, status: "Active", image: "🔊" },
  { id: "3", name: "Samsung Galaxy S24 Ultra 5G", category: "Mobiles", price: 69999, stock: 28, status: "Active", image: "📱" },
  { id: "4", name: "Apple MacBook Air M3 13 inch", category: "Laptops", price: 89990, stock: 8, status: "Low Stock", image: "💻" },
  { id: "5", name: "Sony WH-1000XM5 Headphones", category: "Audio", price: 22990, stock: 34, status: "Active", image: "🎧" },
  { id: "6", name: "Canon EOS R50 Mirrorless Camera", category: "Cameras", price: 62990, stock: 5, status: "Low Stock", image: "📷" },
  { id: "7", name: "Apple iPad Air 11 inch M2", category: "Tablets", price: 49900, stock: 19, status: "Active", image: "📱" },
  { id: "8", name: "JBL Flip 6 Bluetooth Speaker", category: "Audio", price: 8999, stock: 52, status: "Active", image: "🔊" },
  { id: "9", name: "Apple Watch Series 9 GPS 45mm", category: "Wearables", price: 36900, stock: 15, status: "Active", image: "⌚" },
  { id: "10", name: "Samsung 253L Frost Free Fridge", category: "Appliances", price: 24990, stock: 0, status: "Out of Stock", image: "🧊" },
];

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Active: "outline",
  "Low Stock": "secondary",
  "Out of Stock": "destructive",
};

export default function Products() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">{MOCK_PRODUCTS.length} products total</p>
        </div>
        <Button>
          <Plus />
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
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
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-sm">
                      {product.image}
                    </span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{product.category}</TableCell>
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
                      <DropdownMenuItem>
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
