import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Add02Icon, Cancel01Icon, Trash } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const CATEGORY_DATA: Record<string, { name: string; subcategories: string[] }> = {
  phones: { name: "Phones", subcategories: ["iPhone", "Samsung Galaxy", "OnePlus", "Xiaomi", "Google Pixel", "Nothing"] },
  laptops: { name: "Laptops", subcategories: ["MacBook", "Dell", "HP", "Lenovo", "ASUS", "Acer"] },
  tablets: { name: "Tablets", subcategories: ["iPad", "Samsung Tab", "Lenovo Tab", "OnePlus Pad"] },
  audio: { name: "Audio", subcategories: ["Headphones", "Earbuds", "Speakers", "Soundbars"] },
  cameras: { name: "Cameras", subcategories: ["DSLR", "Mirrorless", "Action Cameras", "Instant Cameras"] },
  wearables: { name: "Wearables", subcategories: ["Smartwatch", "Fitness Band", "Smart Ring"] },
  tv: { name: "TV & Entertainment", subcategories: ["Smart TV", "Streaming Device", "Projector"] },
  appliances: { name: "Appliances", subcategories: ["Refrigerator", "Washing Machine", "AC", "Microwave"] },
};

const MOCK_PRODUCT: Record<string, { name: string; category: string; subcategory: string; price: number; stock: number }> = {
  "1": { name: "iPhone 16 Pro Max 256GB", category: "phones", subcategory: "iPhone", price: 159900, stock: 12 },
  "2": { name: "Samsung Galaxy S24 Ultra", category: "phones", subcategory: "Samsung Galaxy", price: 129999, stock: 18 },
  "3": { name: "OnePlus 12 256GB", category: "phones", subcategory: "OnePlus", price: 64999, stock: 14 },
};

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
}

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = MOCK_PRODUCT[id || "1"] || MOCK_PRODUCT["1"];

  const [selectedCategory, setSelectedCategory] = useState(product.category);
  const [selectedSubcategory, setSelectedSubcategory] = useState(product.subcategory);
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  const [price, setPrice] = useState(String(product.price));
  const [comparePrice, setComparePrice] = useState("");
  const [stock, setStock] = useState(String(product.stock));
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>(["flagship", "new"]);
  const [tagInput, setTagInput] = useState("");
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: "1", name: "256GB Black Titanium", sku: "IP16PM-256-BLK", price: "159900", stock: "5" },
    { id: "2", name: "512GB Black Titanium", sku: "IP16PM-512-BLK", price: "179900", stock: "4" },
    { id: "3", name: "256GB Natural Titanium", sku: "IP16PM-256-NAT", price: "159900", stock: "3" },
  ]);
  const [_images, _setImages] = useState(["img1.jpg", "img2.jpg", "img3.jpg"]);

  const subcategories = selectedCategory ? CATEGORY_DATA[selectedCategory]?.subcategories || [] : [];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddVariant = () => {
    setVariants([...variants, { id: Date.now().toString(), name: "", sku: "", price: "", stock: "" }]);
  };

  const handleRemoveVariant = (vid: string) => {
    setVariants(variants.filter((v) => v.id !== vid));
  };

  const handleVariantChange = (vid: string, field: keyof ProductVariant, value: string) => {
    setVariants(variants.map((v) => (v.id === vid ? { ...v, [field]: value } : v)));
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="size-8" onClick={() => navigate("/products")}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Edit Product</h1>
          <p className="text-sm text-muted-foreground">Editing: {product.name}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/products")}>Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* General Info */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Product Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Short Description</Label>
                <Textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={2} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Full Description</Label>
                <Textarea value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} rows={6} />
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {selectedCategory && (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3 text-sm">
                  <Badge variant="secondary">{CATEGORY_DATA[selectedCategory]?.name}</Badge>
                  {selectedSubcategory && (
                    <>
                      <span className="text-muted-foreground">&rarr;</span>
                      <Badge variant="outline">{selectedSubcategory}</Badge>
                    </>
                  )}
                  {name && (
                    <>
                      <span className="text-muted-foreground">&rarr;</span>
                      <Badge>{name}</Badge>
                    </>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={(v) => { if (v) { setSelectedCategory(v); setSelectedSubcategory(""); } }}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {Object.entries(CATEGORY_DATA).map(([key, cat]) => (
                          <SelectItem key={key} value={key}>{cat.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Subcategory</Label>
                  <Select value={selectedSubcategory} onValueChange={(v) => { if (v) setSelectedSubcategory(v); }}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Subcategories</SelectLabel>
                        {subcategories.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Selling Price (₹)</Label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Compare at Price (₹)</Label>
                  <Input type="number" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>Color, storage, size options</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {variants.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                    <div className="col-span-4">Variant</div>
                    <div className="col-span-2">SKU</div>
                    <div className="col-span-2">Price (₹)</div>
                    <div className="col-span-2">Stock</div>
                    <div className="col-span-2"></div>
                  </div>
                  {variants.map((v) => (
                    <div key={v.id} className="grid grid-cols-12 items-center gap-2">
                      <Input className="col-span-4 h-8" value={v.name} onChange={(e) => handleVariantChange(v.id, "name", e.target.value)} />
                      <Input className="col-span-2 h-8" value={v.sku} onChange={(e) => handleVariantChange(v.id, "sku", e.target.value)} />
                      <Input className="col-span-2 h-8" type="number" value={v.price} onChange={(e) => handleVariantChange(v.id, "price", e.target.value)} />
                      <Input className="col-span-2 h-8" type="number" value={v.stock} onChange={(e) => handleVariantChange(v.id, "stock", e.target.value)} />
                      <Button variant="ghost" size="icon" className="col-span-2 size-8 hover:text-destructive" onClick={() => handleRemoveVariant(v.id)}>
                        <HugeiconsIcon icon={Trash} size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleAddVariant}>
                <HugeiconsIcon icon={Add02Icon} size={14} /> Add Variant
              </Button>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}><HugeiconsIcon icon={Cancel01Icon} size={10} /></button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())} placeholder="Add tag" className="h-8 max-w-xs" />
                <Button variant="outline" size="sm" onClick={handleAddTag}><HugeiconsIcon icon={Add02Icon} size={14} /> Add</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">Active</p></div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">Featured</p></div>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Stock Quantity</Label>
                <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="mb-3 flex aspect-square items-center justify-center rounded-lg bg-muted text-4xl">📱</div>
                <p className="font-medium">{name || "Product Name"}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedSubcategory || "Subcategory"} / {CATEGORY_DATA[selectedCategory]?.name || "Category"}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-semibold">₹{price ? Number(price).toLocaleString("en-IN") : "0"}</span>
                </div>
                <div className="mt-2 flex gap-1">
                  {isActive && <Badge variant="outline" className="text-[10px]">Active</Badge>}
                  {isFeatured && <Badge variant="outline" className="text-[10px]">Featured</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
