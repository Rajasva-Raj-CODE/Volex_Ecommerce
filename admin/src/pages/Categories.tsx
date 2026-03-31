import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon, FolderOpenIcon, Edit02Icon, Trash, Add02Icon, Link02Icon, Package01Icon, GridIcon, Money02Icon, CheckmarkCircle02Icon, Settings01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";

interface Category {
  id: number;
  name: string;
  slug: string;
  products: number;
  subcategories: string[];
  revenue: string;
  status: string;
  icon: string;
}

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Smartphones", slug: "smartphones", products: 156, subcategories: ["iPhone", "Samsung Galaxy", "OnePlus", "Xiaomi", "Google Pixel", "Nothing", "Motorola", "Realme"], revenue: "₹45.2L", status: "Active", icon: "📱" },
  { id: 2, name: "Laptops", slug: "laptops", products: 89, subcategories: ["MacBook", "Dell", "HP", "Lenovo", "ASUS"], revenue: "₹32.8L", status: "Active", icon: "💻" },
  { id: 3, name: "Accessories", slug: "accessories", products: 234, subcategories: ["Cases", "Chargers", "Cables", "Screen Protectors", "Stands", "Adapters", "Power Banks", "Memory Cards", "Stylus", "Cleaning Kits", "Car Mounts", "Bags"], revenue: "₹18.5L", status: "Active", icon: "🎧" },
  { id: 4, name: "Wearables", slug: "wearables", products: 67, subcategories: ["Smartwatch", "Fitness Band", "Smart Ring", "Smart Glasses"], revenue: "₹12.3L", status: "Active", icon: "⌚" },
  { id: 5, name: "Audio", slug: "audio", products: 123, subcategories: ["Headphones", "Earbuds", "Speakers", "Soundbars", "Microphones", "Amplifiers"], revenue: "₹28.9L", status: "Active", icon: "🔊" },
  { id: 6, name: "Cameras", slug: "cameras", products: 45, subcategories: ["DSLR", "Mirrorless", "Action Cameras"], revenue: "₹15.6L", status: "Active", icon: "📷" },
  { id: 7, name: "Gaming", slug: "gaming", products: 98, subcategories: ["Consoles", "Controllers", "Gaming Mice", "Gaming Keyboards", "Headsets", "Monitors", "Chairs"], revenue: "₹22.1L", status: "Active", icon: "🎮" },
  { id: 8, name: "Storage", slug: "storage", products: 34, subcategories: ["SSD", "HDD"], revenue: "₹8.4L", status: "Active", icon: "💾" },
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

const DEFAULT_COLOR = { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function Categories() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formSubcategories, setFormSubcategories] = useState<string[]>([]);
  const [subInput, setSubInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.includes(search.toLowerCase())
  );

  function resetForm() {
    setFormName("");
    setFormSlug("");
    setFormIcon("");
    setFormSubcategories([]);
    setSubInput("");
    setErrors({});
  }

  function handleAddOpenChange(open: boolean) {
    setAddOpen(open);
    if (!open) resetForm();
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open);
    if (!open) {
      setEditingCategory(null);
      resetForm();
    }
  }

  function openEdit(category: Category) {
    setEditingCategory(category);
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormIcon(category.icon);
    setFormSubcategories([...category.subcategories]);
    setSubInput("");
    setErrors({});
    setEditOpen(true);
  }

  function handleAddSub() {
    const val = subInput.trim();
    if (!val) return;
    if (formSubcategories.some((s) => s.toLowerCase() === val.toLowerCase())) {
      setErrors((prev) => ({ ...prev, sub: "This subcategory already exists" }));
      return;
    }
    setFormSubcategories((prev) => [...prev, val]);
    setSubInput("");
    if (errors.sub) setErrors((prev) => ({ ...prev, sub: "" }));
  }

  function handleRemoveSub(sub: string) {
    setFormSubcategories((prev) => prev.filter((s) => s !== sub));
  }

  function validate(excludeId?: number) {
    const newErrors: Record<string, string> = {};
    if (!formName.trim()) newErrors.name = "Name is required";
    if (!formSlug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (categories.some((c) => (excludeId ? c.id !== excludeId : true) && c.slug === formSlug.trim())) {
      newErrors.slug = "This slug already exists";
    }
    if (!formIcon.trim()) newErrors.icon = "Icon is required";
    return newErrors;
  }

  function handleAdd() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setCategories((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: formName.trim(),
        slug: formSlug.trim(),
        products: 0,
        subcategories: formSubcategories,
        revenue: "₹0",
        status: "Active",
        icon: formIcon.trim(),
      },
    ]);

    toast.success(`Category "${formName.trim()}" created`);
    resetForm();
    setAddOpen(false);
  }

  function handleEdit() {
    if (!editingCategory) return;

    const newErrors = validate(editingCategory.id);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingCategory.id
          ? { ...c, name: formName.trim(), slug: formSlug.trim(), icon: formIcon.trim(), subcategories: formSubcategories }
          : c
      )
    );

    toast.success(`Category "${formName.trim()}" updated`);
    setEditingCategory(null);
    resetForm();
    setEditOpen(false);
  }

  function handleDelete(category: Category) {
    setCategories((prev) => prev.filter((c) => c.id !== category.id));
    toast.success(`Category "${category.name}" deleted`);
  }

  const categoryForm = (formId: string, onSubmit: () => void) => (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${formId}-name`}>Name</FieldLabel>
          <Input
            id={`${formId}-name`}
            type="text"
            placeholder="e.g. Smartphones"
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value);
              setFormSlug(generateSlug(e.target.value));
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
          />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-slug`}>Slug</FieldLabel>
          <Input
            id={`${formId}-slug`}
            type="text"
            placeholder="e.g. smartphones"
            value={formSlug}
            onChange={(e) => {
              setFormSlug(e.target.value);
              if (errors.slug) setErrors((prev) => ({ ...prev, slug: "" }));
            }}
          />
          {errors.slug && <FieldError>{errors.slug}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-icon`}>Icon (emoji)</FieldLabel>
          <Input
            id={`${formId}-icon`}
            type="text"
            placeholder="e.g. 📱"
            value={formIcon}
            onChange={(e) => {
              setFormIcon(e.target.value);
              if (errors.icon) setErrors((prev) => ({ ...prev, icon: "" }));
            }}
          />
          {errors.icon && <FieldError>{errors.icon}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Subcategories</FieldLabel>
          {formSubcategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {formSubcategories.map((sub) => (
                <Badge key={sub} variant="secondary" className="gap-1">
                  {sub}
                  <button type="button" onClick={() => handleRemoveSub(sub)} className="hover:text-destructive">
                    <HugeiconsIcon icon={Cancel01Icon} size={10} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Type a subcategory and press Enter"
              value={subInput}
              onChange={(e) => {
                setSubInput(e.target.value);
                if (errors.sub) setErrors((prev) => ({ ...prev, sub: "" }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSub();
                }
              }}
              className="h-8"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddSub}>
              <HugeiconsIcon icon={Add02Icon} size={14} /> Add
            </Button>
          </div>
          {errors.sub && <FieldError>{errors.sub}</FieldError>}
        </Field>
      </FieldGroup>
    </form>
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={FolderOpenIcon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Categories</h1>
            <p className="text-sm text-muted-foreground">
              {search
                ? `${filtered.length} of ${categories.length} categories`
                : `${categories.length} categories`}
            </p>
          </div>
        </div>

        <Dialog open={addOpen} onOpenChange={handleAddOpenChange}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <HugeiconsIcon icon={Add02Icon} size={16} />
            Add Category
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Create a new product category with subcategories.
              </DialogDescription>
            </DialogHeader>

            {categoryForm("add-category", handleAdd)}

            <DialogFooter showCloseButton>
              <Button type="submit" form="add-category" disabled={!formName || !formSlug || !formIcon}>
                <HugeiconsIcon icon={Add02Icon} size={16} />
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon icon={Search02Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
            {filtered.map((category) => {
              const color = CATEGORY_COLORS[category.name] || DEFAULT_COLOR;
              return (
                <TableRow key={category.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color.bg} ${color.border} border`}>
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
                      {category.subcategories.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium text-emerald-600">
                    {category.revenue}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${color.bg} ${color.text} text-[10px] font-medium border-0`}>
                      {category.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => openEdit(category)}
                      >
                        <HugeiconsIcon icon={Edit02Icon} size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(category)}
                      >
                        <HugeiconsIcon icon={Trash} size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editOpen} onOpenChange={handleEditOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update details for {editingCategory?.name}.
            </DialogDescription>
          </DialogHeader>

          {categoryForm("edit-category", handleEdit)}

          <DialogFooter showCloseButton>
            <Button type="submit" form="edit-category" disabled={!formName || !formSlug || !formIcon}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
