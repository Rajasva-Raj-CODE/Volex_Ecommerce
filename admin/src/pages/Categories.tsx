import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">{MOCK_CATEGORIES.length} categories</p>
        </div>
        <Button>
          <Plus size={16} />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_CATEGORIES.map((cat) => (
          <Card key={cat.id} className="transition-colors hover:border-primary/30">
            <CardContent className="pt-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold">{cat.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">/{cat.slug}</p>
                </div>
                <Badge variant={cat.status === "Active" ? "outline" : "secondary"}>
                  {cat.status}
                </Badge>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                {cat.products} products
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Pencil size={12} /> Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 size={12} /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
