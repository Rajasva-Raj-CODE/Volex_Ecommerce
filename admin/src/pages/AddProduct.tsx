import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, Upload, Trash2 } from "lucide-react";
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

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
}

export default function AddProduct() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" });
  const [images, setImages] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(generateSlug(value));
  };

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
    setVariants([
      ...variants,
      { id: Date.now().toString(), name: "", sku: "", price: "", stock: "" },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleVariantChange = (id: string, field: keyof ProductVariant, value: string) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const handleAddImage = () => {
    setImages([...images, `placeholder-${images.length + 1}.jpg`]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const subcategories = selectedCategory ? CATEGORY_DATA[selectedCategory]?.subcategories || [] : [];

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="size-8" onClick={() => navigate("/products")}>
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Add Product</h1>
          <p className="text-sm text-muted-foreground">Create a new product listing</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/products")}>Cancel</Button>
          <Button variant="secondary">Save Draft</Button>
          <Button>Publish Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* General Info */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic product details and description</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. iPhone 16 Pro Max 256GB"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="slug">
                  Slug <span className="text-muted-foreground">(auto-generated)</span>
                </Label>
                <div className="flex items-center gap-0">
                  <span className="flex h-8 items-center rounded-l-lg border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                    /products/
                  </span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="shortDesc">Short Description</Label>
                <Textarea
                  id="shortDesc"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Brief product summary shown in listings..."
                  rows={2}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullDesc">Full Description</Label>
                <Textarea
                  id="fullDesc"
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Detailed product description with features, specs..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Hierarchy */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
              <CardDescription>
                Organize products into Category &rarr; Subcategory hierarchy
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Visual Hierarchy Preview */}
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(v) => {
                      if (v) {
                        setSelectedCategory(v);
                        setSelectedSubcategory("");
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {Object.entries(CATEGORY_DATA).map(([key, cat]) => (
                          <SelectItem key={key} value={key}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Subcategory</Label>
                  <Select
                    value={selectedSubcategory}
                    onValueChange={(v) => { if (v) setSelectedSubcategory(v); }}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={selectedCategory ? "Select subcategory" : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Subcategories</SelectLabel>
                        {subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Show existing products in selected subcategory */}
              {selectedCategory && selectedSubcategory && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Existing products in {selectedSubcategory}:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs">iPhone 16 Pro Max 256GB</Badge>
                    <Badge variant="secondary" className="text-xs">iPhone 16 Pro 128GB</Badge>
                    <Badge variant="secondary" className="text-xs">iPhone 15 128GB</Badge>
                    <Badge variant="outline" className="text-xs">+ 12 more</Badge>
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Apple"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. IP16PM-256-BLK"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set product pricing and cost information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">Selling Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="comparePrice">
                    Compare at Price (₹) <span className="text-muted-foreground">(MRP)</span>
                  </Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="costPrice">
                    Cost Price (₹) <span className="text-muted-foreground">(internal)</span>
                  </Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              {price && comparePrice && Number(comparePrice) > Number(price) && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-green-400">
                    {Math.round(((Number(comparePrice) - Number(price)) / Number(comparePrice)) * 100)}% OFF
                  </Badge>
                  <span className="text-muted-foreground">
                    Customer saves ₹{(Number(comparePrice) - Number(price)).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>
                Add product variants like color, storage, size etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {variants.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                    <div className="col-span-4">Variant Name</div>
                    <div className="col-span-2">SKU</div>
                    <div className="col-span-2">Price (₹)</div>
                    <div className="col-span-2">Stock</div>
                    <div className="col-span-2"></div>
                  </div>
                  {variants.map((variant) => (
                    <div key={variant.id} className="grid grid-cols-12 items-center gap-2">
                      <Input
                        className="col-span-4 h-8"
                        placeholder="e.g. 256GB Black"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(variant.id, "name", e.target.value)}
                      />
                      <Input
                        className="col-span-2 h-8"
                        placeholder="SKU"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(variant.id, "sku", e.target.value)}
                      />
                      <Input
                        className="col-span-2 h-8"
                        type="number"
                        placeholder="0"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(variant.id, "price", e.target.value)}
                      />
                      <Input
                        className="col-span-2 h-8"
                        type="number"
                        placeholder="0"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(variant.id, "stock", e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="col-span-2 size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveVariant(variant.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleAddVariant}>
                <Plus /> Add Variant
              </Button>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Upload product images (first image is the main image)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                {images.map((_img, i) => (
                  <div key={i} className="group relative aspect-square rounded-lg border bg-muted">
                    <div className="flex h-full items-center justify-center text-2xl text-muted-foreground">
                      📷
                    </div>
                    {i === 0 && (
                      <Badge className="absolute left-1.5 top-1.5 text-[10px]">Main</Badge>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-1 top-1 size-5 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => handleRemoveImage(i)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
                <button
                  onClick={handleAddImage}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Upload className="size-5" />
                  <span className="text-xs font-medium">Upload</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add tags to help customers find this product</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="Type a tag and press Enter"
                  className="h-8 max-w-xs"
                />
                <Button variant="outline" size="sm" onClick={handleAddTag}>
                  <Plus /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="seoTitle">Meta Title</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={name || "Product page title"}
                />
                <p className="text-xs text-muted-foreground">{(seoTitle || name).length}/60 characters</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="seoDesc">Meta Description</Label>
                <Textarea
                  id="seoDesc"
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder={shortDesc || "Brief description for search results"}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">{(seoDesc || shortDesc).length}/160 characters</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">Visible on storefront</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Featured</p>
                  <p className="text-xs text-muted-foreground">Show on homepage</p>
                </div>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Draft</p>
                  <p className="text-xs text-muted-foreground">Save without publishing</p>
                </div>
                <Switch checked={isDraft} onCheckedChange={setIsDraft} />
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lowStock">Low Stock Threshold</Label>
                <Input
                  id="lowStock"
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  placeholder="10"
                />
                <p className="text-xs text-muted-foreground">
                  Alert when stock falls below this number
                </p>
              </div>
              {stock && Number(stock) <= Number(lowStockThreshold) && (
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-400">
                  ⚠️ Stock is at or below the low stock threshold
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label className="mb-2 block">Dimensions (cm)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    placeholder="L"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                    className="h-8"
                  />
                  <Input
                    type="number"
                    placeholder="W"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                    className="h-8"
                  />
                  <Input
                    type="number"
                    placeholder="H"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                    className="h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How this product appears</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="mb-3 flex aspect-square items-center justify-center rounded-lg bg-muted text-4xl">
                  {images.length > 0 ? "📷" : "🖼️"}
                </div>
                <p className="font-medium">{name || "Product Name"}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedSubcategory || "Subcategory"} / {CATEGORY_DATA[selectedCategory]?.name || "Category"}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-semibold">₹{price ? Number(price).toLocaleString("en-IN") : "0"}</span>
                  {comparePrice && Number(comparePrice) > 0 && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{Number(comparePrice).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex gap-1">
                  {isActive && <Badge variant="outline" className="text-[10px]">Active</Badge>}
                  {isFeatured && <Badge variant="outline" className="text-[10px]">Featured</Badge>}
                  {isDraft && <Badge variant="secondary" className="text-[10px]">Draft</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
