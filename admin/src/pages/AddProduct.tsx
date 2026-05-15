import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Cancel01Icon, Upload02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
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
import { createProduct } from "@/lib/products-api";
import { listCategoriesFlat, type ApiCategory } from "@/lib/categories-api";
import { uploadImage } from "@/lib/uploads-api";
import { ApiError } from "@/lib/api";

export default function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form state (fields that match the server schema)
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stock, setStock] = useState("0");
  const [brand, setBrand] = useState("");
  const [warranty, setWarranty] = useState("");
  const [rating, setRating] = useState("");
  const [ratingCount, setRatingCount] = useState("0");
  const [reviewCount, setReviewCount] = useState("0");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [specGroupsJson, setSpecGroupsJson] = useState("[]");
  const [overviewJson, setOverviewJson] = useState("[]");
  const [bankOffersJson, setBankOffersJson] = useState("[]");
  const [variantsJson, setVariantsJson] = useState("[]");
  const [relatedProductIdsText, setRelatedProductIdsText] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    listCategoriesFlat()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoadingCategories(false));
  }, []);

  function generateSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);
    setSlug(generateSlug(value));
  }

  function handleImageChange(index: number, value: string) {
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  }

  function addImageRow() {
    setImageUrls((prev) => [...prev, ""]);
  }

  function removeImageRow(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleImageUpload(index: number, file: File | undefined) {
    if (!file) return;
    setUploadingImageIndex(index);
    try {
      const image = await uploadImage(file, "products");
      handleImageChange(index, image.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to upload image");
    } finally {
      setUploadingImageIndex(null);
    }
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!price || Number(price) <= 0) errs.price = "Price must be greater than 0";
    if (!categoryId) errs.categoryId = "Category is required";
    for (const [key, value] of Object.entries({
      specGroupsJson,
      overviewJson,
      bankOffersJson,
      variantsJson,
    })) {
      try {
        const parsed = JSON.parse(value || "[]") as unknown;
        if (!Array.isArray(parsed)) errs[key] = "Must be a JSON array";
      } catch {
        errs[key] = "Invalid JSON";
      }
    }
    return errs;
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const validImages = imageUrls.map((u) => u.trim()).filter((u) => u.length > 0);
    const highlights = highlightsText
      .split("\n")
      .map((text) => text.trim())
      .filter(Boolean)
      .map((text) => ({ text }));

    setSubmitting(true);
    try {
      await createProduct({
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        mrp: mrp && Number(mrp) > 0 ? Number(mrp) : undefined,
        stock: Number(stock),
        images: validImages,
        brand: brand.trim() || undefined,
        highlights,
        specGroups: JSON.parse(specGroupsJson || "[]"),
        overview: JSON.parse(overviewJson || "[]"),
        bankOffers: JSON.parse(bankOffersJson || "[]"),
        variants: JSON.parse(variantsJson || "[]"),
        relatedProductIds: relatedProductIdsText.split(",").map((item) => item.trim()).filter(Boolean),
        warranty: warranty.trim() || undefined,
        rating: rating ? Number(rating) : undefined,
        ratingCount: Number(ratingCount || 0),
        reviewCount: Number(reviewCount || 0),
        deliveryDate: deliveryDate.trim() || undefined,
        deliveryFee: deliveryFee.trim() || undefined,
        categoryId,
        isActive,
      });
      toast.success(`"${name.trim()}" created successfully`);
      navigate("/products");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  }

  // Group categories: parents first, children indented
  const parentCategories = categories.filter((c) => !c.parentId);
  const childCategories = categories.filter((c) => c.parentId);

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="size-8" onClick={() => navigate("/products")}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Add Product</h1>
          <p className="text-sm text-muted-foreground">Create a new product listing</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/products")} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Publishing…" : "Publish Product"}
          </Button>
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
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. iPhone 16 Pro Max 256GB"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
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
                    placeholder="iphone-16-pro-max-256gb"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description with features, specs…"
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category & Brand */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Brand</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={categoryId}
                    onValueChange={(v) => {
                      if (v) {
                        setCategoryId(v);
                        if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: "" }));
                      }
                    }}
                    disabled={loadingCategories}
                  >
                    <SelectTrigger className={`w-full ${errors.categoryId ? "border-destructive" : ""}`}>
                      <SelectValue placeholder={loadingCategories ? "Loading…" : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {parentCategories.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Top-level</SelectLabel>
                          {parentCategories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                      {childCategories.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Subcategories</SelectLabel>
                          {childCategories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.parent?.name} › {c.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Apple"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set product selling price and MRP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">
                    Selling Price (₹) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
                    }}
                    placeholder="0.00"
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="mrp">
                    MRP (₹) <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="mrp"
                    type="number"
                    min="0"
                    step="0.01"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              {price && mrp && Number(mrp) > Number(price) && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                    {Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)}% OFF
                  </Badge>
                  <span className="text-muted-foreground">
                    Customer saves ₹{(Number(mrp) - Number(price)).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Add image URLs (first image is the main image)</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-16 shrink-0">
                    {i === 0 && (
                      <Badge className="text-[10px] shrink-0">Main</Badge>
                    )}
                    {i > 0 && (
                      <span className="text-xs text-muted-foreground">#{i + 1}</span>
                    )}
                  </div>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={url}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                    className="flex-1 h-8"
                  />
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={uploadingImageIndex === i}
                    onChange={(e) => void handleImageUpload(i, e.target.files?.[0])}
                    className="max-w-[190px] h-8 text-xs"
                  />
                  {imageUrls.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeImageRow(i)}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={14} />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addImageRow} className="w-fit">
                <HugeiconsIcon icon={Upload02Icon} size={14} />
                {uploadingImageIndex !== null ? "Uploading..." : "Add Image"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storefront Detail Content</CardTitle>
              <CardDescription>Data shown on the product detail page</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="warranty">Warranty</Label>
                  <Input id="warranty" value={warranty} onChange={(e) => setWarranty(e.target.value)} placeholder="1 Year Manufacturer Warranty" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="deliveryDate">Delivery Date Text</Label>
                  <Input id="deliveryDate" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} placeholder="3-5 business days" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="deliveryFee">Delivery Fee Text</Label>
                  <Input id="deliveryFee" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} placeholder="FREE" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input id="rating" type="number" min="0" max="5" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="4.5" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ratingCount">Rating Count</Label>
                  <Input id="ratingCount" type="number" min="0" value={ratingCount} onChange={(e) => setRatingCount(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reviewCount">Review Count</Label>
                  <Input id="reviewCount" type="number" min="0" value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="highlights">Highlights <span className="text-muted-foreground font-normal">(one per line)</span></Label>
                <Textarea id="highlights" value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} rows={5} placeholder="4K Ultra HD Display&#10;Dolby Atmos Sound&#10;1 Year Warranty" />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="specGroupsJson">Specifications JSON</Label>
                  <Textarea id="specGroupsJson" value={specGroupsJson} onChange={(e) => setSpecGroupsJson(e.target.value)} rows={7} className={errors.specGroupsJson ? "border-destructive font-mono text-xs" : "font-mono text-xs"} />
                  {errors.specGroupsJson && <p className="text-xs text-destructive">{errors.specGroupsJson}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="overviewJson">Overview JSON</Label>
                  <Textarea id="overviewJson" value={overviewJson} onChange={(e) => setOverviewJson(e.target.value)} rows={7} className={errors.overviewJson ? "border-destructive font-mono text-xs" : "font-mono text-xs"} />
                  {errors.overviewJson && <p className="text-xs text-destructive">{errors.overviewJson}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bankOffersJson">Bank Offers JSON</Label>
                  <Textarea id="bankOffersJson" value={bankOffersJson} onChange={(e) => setBankOffersJson(e.target.value)} rows={7} className={errors.bankOffersJson ? "border-destructive font-mono text-xs" : "font-mono text-xs"} />
                  {errors.bankOffersJson && <p className="text-xs text-destructive">{errors.bankOffersJson}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="variantsJson">Variants JSON</Label>
                  <Textarea id="variantsJson" value={variantsJson} onChange={(e) => setVariantsJson(e.target.value)} rows={7} className={errors.variantsJson ? "border-destructive font-mono text-xs" : "font-mono text-xs"} />
                  {errors.variantsJson && <p className="text-xs text-destructive">{errors.variantsJson}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="relatedProductIds">Related Product IDs <span className="text-muted-foreground font-normal">(comma separated)</span></Label>
                <Input id="relatedProductIds" value={relatedProductIdsText} onChange={(e) => setRelatedProductIdsText(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">Visible on storefront</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-muted overflow-hidden">
                  {imageUrls[0]?.trim() ? (
                    <img
                      src={imageUrls[0]}
                      alt={name}
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <span className="text-4xl">🖼️</span>
                  )}
                </div>
                <p className="font-medium">{name || "Product Name"}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    ₹{price ? Number(price).toLocaleString("en-IN") : "0"}
                  </span>
                  {mrp && Number(mrp) > 0 && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{Number(mrp).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <Separator className="my-2" />
                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                  <span>Stock: {stock}</span>
                  {!isActive && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
