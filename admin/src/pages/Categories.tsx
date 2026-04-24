import { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon, FolderOpenIcon, Edit02Icon, Trash, Add02Icon, Link02Icon, Package01Icon, CheckmarkCircle02Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  listCategoriesFlat,
  createCategory,
  updateCategory,
  deleteCategory,
  type ApiCategory,
} from "@/lib/categories-api";
import { ApiError } from "@/lib/api";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function Categories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formParentId, setFormParentId] = useState("");
  const [formSortOrder, setFormSortOrder] = useState("0");
  const [formIsActive, setFormIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listCategoriesFlat();
      setCategories(data);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.includes(search.toLowerCase())
  );

  // Parent options: top-level categories only (no parentId) — to avoid circular parenting
  const parentOptions = categories.filter((c) => !c.parentId);

  function resetForm() {
    setFormName("");
    setFormSlug("");
    setFormImageUrl("");
    setFormParentId("");
    setFormSortOrder("0");
    setFormIsActive(true);
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

  function openEdit(category: ApiCategory) {
    setEditingCategory(category);
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormImageUrl(category.imageUrl ?? "");
    setFormParentId(category.parentId ?? "");
    setFormSortOrder(String(category.sortOrder));
    setFormIsActive(category.isActive);
    setErrors({});
    setEditOpen(true);
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!formName.trim()) errs.name = "Name is required";
    if (!formSlug.trim()) errs.slug = "Slug is required";
    return errs;
  }

  async function handleAdd() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      await createCategory({
        name: formName.trim(),
        slug: formSlug.trim(),
        imageUrl: formImageUrl.trim() || undefined,
        parentId: formParentId || undefined,
        sortOrder: Number(formSortOrder),
        isActive: formIsActive,
      });
      toast.success(`Category "${formName.trim()}" created`);
      resetForm();
      setAddOpen(false);
      void fetchCategories();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create category");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit() {
    if (!editingCategory) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      await updateCategory(editingCategory.id, {
        name: formName.trim(),
        slug: formSlug.trim(),
        imageUrl: formImageUrl.trim() || undefined,
        parentId: formParentId || undefined,
        sortOrder: Number(formSortOrder),
        isActive: formIsActive,
      });
      toast.success(`Category "${formName.trim()}" updated`);
      setEditingCategory(null);
      resetForm();
      setEditOpen(false);
      void fetchCategories();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update category");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: ApiCategory) {
    if (!confirm(`Delete "${category.name}"? This will fail if the category has products or subcategories.`)) return;
    setDeletingId(category.id);
    try {
      await deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      toast.success(`Category "${category.name}" deleted`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  }

  const categoryForm = (formId: string, onSubmit: () => void) => (
    <form id={formId} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${formId}-name`}>Name</FieldLabel>
          <Input
            id={`${formId}-name`}
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
          <FieldLabel htmlFor={`${formId}-imageUrl`}>Image URL <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
          <Input
            id={`${formId}-imageUrl`}
            type="url"
            placeholder="https://…"
            value={formImageUrl}
            onChange={(e) => setFormImageUrl(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>Parent Category <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
          <Select
            value={formParentId || "__none__"}
            onValueChange={(v) => setFormParentId(v && v !== "__none__" ? v : "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Top-level (no parent)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Top-level (no parent)</SelectItem>
              {parentOptions
                .filter((c) => c.id !== editingCategory?.id)
                .map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-sortOrder`}>Sort Order</FieldLabel>
          <Input
            id={`${formId}-sortOrder`}
            type="number"
            min="0"
            placeholder="0"
            value={formSortOrder}
            onChange={(e) => setFormSortOrder(e.target.value)}
          />
        </Field>

        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-medium">Active</span>
          <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
        </div>
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
              {loading ? "Loading…" : (search ? `${filtered.length} of ${categories.length} categories` : `${categories.length} categories`)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchCategories} disabled={loading}>
            Refresh
          </Button>

          <Dialog open={addOpen} onOpenChange={handleAddOpenChange}>
            <DialogTrigger render={<Button className="gap-2" />}>
              <HugeiconsIcon icon={Add02Icon} size={16} />
              Add Category
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
                <DialogDescription>Create a new product category.</DialogDescription>
              </DialogHeader>
              {categoryForm("add-category", handleAdd)}
              <DialogFooter showCloseButton>
                <Button type="submit" form="add-category" disabled={!formName || !formSlug || saving}>
                  <HugeiconsIcon icon={Add02Icon} size={16} />
                  {saving ? "Creating…" : "Add Category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon icon={Search02Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories…"
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
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Package01Icon} size={14} className="text-amber-600 hidden sm:flex" />
                  <span>Parent</span>
                </div>
              </TableHead>
              <TableHead className="text-center font-semibold">Sort</TableHead>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Loading categories…</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  {categories.length === 0 ? "No categories yet — add your first one." : "No categories match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={category.name} className="h-9 w-9 rounded-lg object-cover border" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                          <HugeiconsIcon icon={FolderOpenIcon} size={16} className="text-primary" />
                        </div>
                      )}
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {category.parent?.name ?? <span className="text-muted-foreground/50">—</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="tabular-nums">{category.sortOrder}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={category.isActive ? "outline" : "secondary"}
                      className={category.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                        : "bg-gray-50 text-gray-500 text-[10px]"
                      }
                    >
                      {category.isActive ? "Active" : "Inactive"}
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
                        disabled={deletingId === category.id}
                        onClick={() => handleDelete(category)}
                      >
                        <HugeiconsIcon icon={Trash} size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editOpen} onOpenChange={handleEditOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update details for {editingCategory?.name}.</DialogDescription>
          </DialogHeader>
          {categoryForm("edit-category", handleEdit)}
          <DialogFooter showCloseButton>
            <Button type="submit" form="edit-category" disabled={!formName || !formSlug || saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
