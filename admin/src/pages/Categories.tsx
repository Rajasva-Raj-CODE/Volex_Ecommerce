import { useState } from "react";
import { Plus, Pencil, Trash2, Package, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  products: Product[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: Subcategory[];
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Phones",
    slug: "phones",
    icon: "📱",
    subcategories: [
      {
        id: "1-1", name: "iPhone", slug: "iphone", products: [
          { id: "p1", name: "iPhone 16 Pro Max 256GB", price: 159900, stock: 12, status: "Active" },
          { id: "p2", name: "iPhone 16 Pro 128GB", price: 139900, stock: 8, status: "Active" },
          { id: "p3", name: "iPhone 16 128GB", price: 79900, stock: 22, status: "Active" },
          { id: "p4", name: "iPhone 15 128GB", price: 69900, stock: 15, status: "Active" },
          { id: "p5", name: "iPhone SE 3rd Gen", price: 49900, stock: 0, status: "Out of Stock" },
        ],
      },
      {
        id: "1-2", name: "Samsung Galaxy", slug: "samsung-galaxy", products: [
          { id: "p6", name: "Samsung Galaxy S24 Ultra 256GB", price: 129999, stock: 18, status: "Active" },
          { id: "p7", name: "Samsung Galaxy S24+ 256GB", price: 99999, stock: 10, status: "Active" },
          { id: "p8", name: "Samsung Galaxy A55 128GB", price: 39999, stock: 30, status: "Active" },
        ],
      },
      {
        id: "1-3", name: "OnePlus", slug: "oneplus", products: [
          { id: "p9", name: "OnePlus 12 256GB", price: 64999, stock: 14, status: "Active" },
          { id: "p10", name: "OnePlus Nord CE4 128GB", price: 24999, stock: 25, status: "Active" },
        ],
      },
      { id: "1-4", name: "Google Pixel", slug: "google-pixel", products: [] },
      { id: "1-5", name: "Xiaomi", slug: "xiaomi", products: [] },
    ],
  },
  {
    id: "2",
    name: "Laptops",
    slug: "laptops",
    icon: "💻",
    subcategories: [
      {
        id: "2-1", name: "MacBook", slug: "macbook", products: [
          { id: "p11", name: "MacBook Air M3 13 inch 256GB", price: 114900, stock: 6, status: "Active" },
          { id: "p12", name: "MacBook Pro M3 Pro 14 inch 512GB", price: 199900, stock: 4, status: "Low Stock" },
        ],
      },
      {
        id: "2-2", name: "Dell", slug: "dell", products: [
          { id: "p13", name: "Dell XPS 15 Intel i7", price: 159990, stock: 5, status: "Active" },
        ],
      },
      { id: "2-3", name: "HP", slug: "hp", products: [] },
      { id: "2-4", name: "Lenovo", slug: "lenovo", products: [] },
    ],
  },
  {
    id: "3",
    name: "Audio",
    slug: "audio",
    icon: "🎧",
    subcategories: [
      {
        id: "3-1", name: "Headphones", slug: "headphones", products: [
          { id: "p14", name: "Sony WH-1000XM5", price: 29990, stock: 20, status: "Active" },
          { id: "p15", name: "AirPods Max USB-C", price: 59900, stock: 8, status: "Active" },
        ],
      },
      {
        id: "3-2", name: "Earbuds", slug: "earbuds", products: [
          { id: "p16", name: "AirPods Pro 2", price: 24900, stock: 35, status: "Active" },
          { id: "p17", name: "Samsung Galaxy Buds3 Pro", price: 17999, stock: 22, status: "Active" },
        ],
      },
      {
        id: "3-3", name: "Speakers", slug: "speakers", products: [
          { id: "p18", name: "JBL Flip 6", price: 8999, stock: 40, status: "Active" },
          { id: "p19", name: "Marshall Emberton II", price: 14999, stock: 12, status: "Active" },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Tablets",
    slug: "tablets",
    icon: "📱",
    subcategories: [
      {
        id: "4-1", name: "iPad", slug: "ipad", products: [
          { id: "p20", name: "iPad Air M2 11 inch 128GB", price: 59900, stock: 10, status: "Active" },
          { id: "p21", name: "iPad 10th Gen 64GB", price: 34900, stock: 18, status: "Active" },
        ],
      },
      { id: "4-2", name: "Samsung Tab", slug: "samsung-tab", products: [] },
    ],
  },
  {
    id: "5",
    name: "Cameras",
    slug: "cameras",
    icon: "📷",
    subcategories: [
      {
        id: "5-1", name: "Mirrorless", slug: "mirrorless", products: [
          { id: "p22", name: "Sony Alpha A7 IV", price: 199990, stock: 3, status: "Low Stock" },
        ],
      },
      { id: "5-2", name: "DSLR", slug: "dslr", products: [] },
    ],
  },
  {
    id: "6",
    name: "Wearables",
    slug: "wearables",
    icon: "⌚",
    subcategories: [
      {
        id: "6-1", name: "Smartwatch", slug: "smartwatch", products: [
          { id: "p23", name: "Apple Watch Series 9 GPS 45mm", price: 44900, stock: 15, status: "Active" },
          { id: "p24", name: "Samsung Galaxy Watch 6", price: 28999, stock: 8, status: "Active" },
        ],
      },
    ],
  },
];

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Active: "outline",
  "Low Stock": "secondary",
  "Out of Stock": "destructive",
};

function SubcategoryRow({ subcategory }: { subcategory: Subcategory }) {
  const [expanded, setExpanded] = useState(false);
  const hasProducts = subcategory.products.length > 0;

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50">
        <CollapsibleTrigger className="flex flex-1 items-center gap-2">
          {hasProducts ? (
            <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", !expanded && "-rotate-90")} />
          ) : (
            <span className="w-4" />
          )}
          <span className="text-sm font-medium">{subcategory.name}</span>
          <Badge variant="secondary" className="ml-auto mr-2 text-[10px]">
            {subcategory.products.length} products
          </Badge>
        </CollapsibleTrigger>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
            <Pencil className="size-3" />
          </Button>
          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive">
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>
      <CollapsibleContent>
        <div className="ml-6 flex flex-col gap-0.5 border-l pl-4">
          {subcategory.products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted/30"
            >
              <Package className="size-3 text-muted-foreground" />
              <span className="flex-1">{product.name}</span>
              <span className="tabular-nums text-muted-foreground">₹{product.price.toLocaleString("en-IN")}</span>
              <Badge variant={STATUS_VARIANT[product.status] ?? "secondary"} className="text-[10px]">
                {product.stock > 0 ? `${product.stock}` : "OOS"}
              </Badge>
            </div>
          ))}
          {subcategory.products.length === 0 && (
            <p className="px-3 py-2 text-xs text-muted-foreground">No products yet</p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const [expanded, setExpanded] = useState(false);
  const totalProducts = category.subcategories.reduce((sum, s) => sum + s.products.length, 0);

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <Card>
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-xl">
              {category.icon}
            </span>
            <div className="flex-1">
              <CardTitle className="text-base">{category.name}</CardTitle>
              <CardDescription>
                {category.subcategories.length} subcategories &middot; {totalProducts} products
              </CardDescription>
            </div>
            <ChevronDown
              className={cn("size-4 text-muted-foreground transition-transform", !expanded && "-rotate-90")}
            />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-1">
              {category.subcategories.map((sub) => (
                <SubcategoryRow key={sub.id} subcategory={sub} />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default function Categories() {
  const totalCategories = MOCK_CATEGORIES.length;
  const totalSubcategories = MOCK_CATEGORIES.reduce((sum, c) => sum + c.subcategories.length, 0);
  const totalProducts = MOCK_CATEGORIES.reduce(
    (sum, c) => sum + c.subcategories.reduce((s, sub) => s + sub.products.length, 0),
    0
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {totalCategories} categories &middot; {totalSubcategories} subcategories &middot; {totalProducts} products
          </p>
        </div>
        <Dialog>
          <DialogTrigger render={<Button />}>
            <Plus /> Add Category
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>Create a new product category</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="catName">Category Name</Label>
                <Input id="catName" placeholder="e.g. Gaming" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="catSlug">Slug</Label>
                <Input id="catSlug" placeholder="e.g. gaming" />
              </div>
            </div>
            <DialogFooter>
              <Button>Save Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Categories", value: totalCategories, icon: "📁" },
          { label: "Subcategories", value: totalSubcategories, icon: "📂" },
          { label: "Products", value: totalProducts, icon: "📦" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 pt-4">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Hierarchy */}
      <div className="flex flex-col gap-4">
        {MOCK_CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </>
  );
}
