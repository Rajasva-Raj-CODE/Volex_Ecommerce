import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MOCK_CATEGORIES = [
  { id: "1", name: "Mobiles, Tablets & Accessories", slug: "mobiles-tablets-accessories", products: 124, status: "Active" },
  { id: "2", name: "Laptops & Accessories", slug: "laptops-accessories", products: 89, status: "Active" },
  { id: "3", name: "TV & Entertainment", slug: "tv-entertainment", products: 67, status: "Active" },
  { id: "4", name: "Home Appliances", slug: "home-appliances", products: 145, status: "Active" },
  { id: "5", name: "Kitchen Appliances", slug: "kitchen-appliances", products: 98, status: "Active" },
  { id: "6", name: "Headphones & Speakers", slug: "headphones-speakers", products: 56, status: "Active" },
  { id: "7", name: "Cameras", slug: "cameras", products: 34, status: "Active" },
  { id: "8", name: "Personal Care", slug: "personal-care", products: 42, status: "Inactive" },
];

export default function Categories() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">{MOCK_CATEGORIES.length} categories</p>
        </div>
        <Button>
          <Plus />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {MOCK_CATEGORIES.map((cat) => (
          <Card key={cat.id} className="@container/card">
            <CardHeader>
              <CardTitle className="text-base">{cat.name}</CardTitle>
              <CardDescription>/{cat.slug}</CardDescription>
              <CardAction>
                <Badge variant={cat.status === "Active" ? "outline" : "secondary"}>
                  {cat.status}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="gap-2">
              <span className="text-sm font-medium tabular-nums">{cat.products} products</span>
              <div className="ml-auto flex gap-1">
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                  <Pencil />
                </Button>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive">
                  <Trash2 />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
