import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getProduct, updateProduct, type ApiProduct } from "@/lib/products-api";
import { listCategoriesFlat, type ApiCategory } from "@/lib/categories-api";
import { ApiError } from "@/lib/api";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stock, setStock] = useState("0");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    void (async () => {
      try {
        const p = await getProduct(id);
        setProduct(p);
        setName(p.name);
        setSlug(p.slug);
        setDescription(p.description ?? "");
        setPrice(String(Number(p.price)));
        setMrp(p.mrp ? String(Number(p.mrp)) : "");
        setStock(String(p.stock));
        setBrand(p.brand ?? "");
        setCategoryId(p.categoryId);
        setIsActive(p.isActive);
        setImageUrls(p.images.length > 0 ? p.images : [""]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load product");
        navigate("/products");
      } finally {
        setLoadingProduct(false);
      }
    })();
  }, [id, navigate]);

  useEffect(() => {
    listCategoriesFlat()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoadingCategories(false));
  }, []);

  function handleImageChange(index: number, value: string) {
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  }

  function addImageRow() {
    setImageUrls((prev) => [...prev, ""]);
  }

  function removeImageRow(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!price || Number(price) <= 0) errs.price = "Price must be greater than 0";
    if (!categoryId) errs.categoryId = "Category is required";
    return errs;
  }

  async function handleSubmit() {
    if (!product) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const validImages = imageUrls.map((u) => u.trim()).filter((u) => u.length > 0);

    setSubmitting(true);
    try {
      await updateProduct(product.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        mrp: mrp && Number(mrp) > 0 ? Number(mrp) : undefined,
        stock: Number(stock),
        images: validImages,
        brand: brand.trim() || undefined,
        categoryId,
        isActive,
      });
      toast.success(`"${name.trim()}" updated successfully`);
      navigate("/products");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  }

  const parentCategories = categories.filter((c) => !c.parentId);
  const childCategories = categories.filter((c) => c.parentId);

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading product…
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="size-8" onClick={() => navigate("/products")}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Edit Product</h1>
          <p className="text-sm text-muted-foreground">Editing: {product?.name}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/products")} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : "Save Changes"}
          </Button>
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
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  />
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
                  <Label>
                    Selling Price (₹) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
                    }}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label>MRP (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                  />
                </div>
              </div>
              {price && mrp && Number(mrp) > Number(price) && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                    {Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)}% OFF
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-16 shrink-0">
                    {i === 0 ? (
                      <Badge className="text-[10px] shrink-0">Main</Badge>
                    ) : (
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
                <HugeiconsIcon icon={Upload02Icon} size={14} /> Add Image URL
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
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

          <Card>
            <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

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
                <div className="text-xs text-muted-foreground">
                  Stock: {stock}
                  {!isActive && <Badge variant="secondary" className="ml-2 text-[10px]">Inactive</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
