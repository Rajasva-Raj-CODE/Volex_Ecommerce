import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon, FolderOpenIcon, Edit02Icon, Trash, Add02Icon, Link02Icon, Package01Icon, GridIcon, Money02Icon, CheckmarkCircle02Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_CATEGORIES = [
  { id: 1, name: "Smartphones", slug: "smartphones", products: 156, subcategories: 8, revenue: "₹45.2L", status: "Active", icon: "📱" },
  { id: 2, name: "Laptops", slug: "laptops", products: 89, subcategories: 5, revenue: "₹32.8L", status: "Active", icon: "💻" },
  { id: 3, name: "Accessories", slug: "accessories", products: 234, subcategories: 12, revenue: "₹18.5L", status: "Active", icon: "🎧" },
  { id: 4, name: "Wearables", slug: "wearables", products: 67, subcategories: 4, revenue: "₹12.3L", status: "Active", icon: "⌚" },
  { id: 5, name: "Audio", slug: "audio", products: 123, subcategories: 6, revenue: "₹28.9L", status: "Active", icon: "🔊" },
  { id: 6, name: "Cameras", slug: "cameras", products: 45, subcategories: 3, revenue: "₹15.6L", status: "Active", icon: "📷" },
  { id: 7, name: "Gaming", slug: "gaming", products: 98, subcategories: 7, revenue: "₹22.1L", status: "Active", icon: "🎮" },
  { id: 8, name: "Storage", slug: "storage", products: 34, subcategories: 2, revenue: "₹8.4L", status: "Active", icon: "💾" },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Smartphones: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Laptops: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Accessories: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Wearables: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  Audio: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  Cameras: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  Gaming: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  Storage: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
};

export default function Categories() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={FolderOpenIcon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Categories</h1>
            <p className="text-sm text-muted-foreground">{MOCK_CATEGORIES.length} categories</p>
          </div>
        </div>
        <Button className="gap-2">
          <HugeiconsIcon icon={Add02Icon} size={16} />
          Add Category
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon icon={Search02Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search categories..." className="pl-9 h-9" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={FolderOpenIcon} size={14} className="text-blue-600 hidden sm:flex" />
                  <span>Category</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Link02Icon} size={14} className="text-purple-600 hidden sm:flex" />
                  <span>Slug</span>
                </div>
              </TableHead>
              <TableHead className="text-center font-semibold">
                <div className="flex items-center justify-center gap-2">
                  <HugeiconsIcon icon={Package01Icon} size={14} className="text-amber-600 hidden sm:flex" />
                  <span>Products</span>
                </div>
              </TableHead>
              <TableHead className="text-center font-semibold">
                <div className="flex items-center justify-center gap-2">
                  <HugeiconsIcon icon={GridIcon} size={14} className="text-indigo-600 hidden sm:flex" />
                  <span>Subcategories</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <HugeiconsIcon icon={Money02Icon} size={14} className="text-emerald-600 hidden sm:flex" />
                  <span>Revenue</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-cyan-600 hidden sm:flex" />
                  <span>Status</span>
                </div>
              </TableHead>
              <TableHead className="w-20 font-semibold">
                <div className="flex items-center justify-center gap-2">
                  <HugeiconsIcon icon={Settings01Icon} size={14} className="text-muted-foreground hidden sm:flex" />
                  <span>Actions</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_CATEGORIES.map((category) => (
              <TableRow key={category.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${CATEGORY_COLORS[category.name]?.bg || "bg-gray-50"} ${CATEGORY_COLORS[category.name]?.border || "border-gray-200"} border`}>
                      <span className="text-lg">{category.icon}</span>
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="tabular-nums font-medium">
                    {category.products}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="tabular-nums">
                    {category.subcategories}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium text-emerald-600">
                  {category.revenue}
                </TableCell>
                <TableCell>
                  <Badge className={`${CATEGORY_COLORS[category.name]?.bg || "bg-gray-50"} ${CATEGORY_COLORS[category.name]?.text || "text-gray-700"} text-[10px] font-medium border-0`}>
                    {category.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600">
                      <HugeiconsIcon icon={Edit02Icon} size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600">
                      <HugeiconsIcon icon={Trash} size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
