import { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search02Icon,
  Edit02Icon,
  Trash,
  Add02Icon,
  CheckmarkCircle02Icon,
  Settings01Icon,
  PercentCircleIcon,
  Calendar01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
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
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  type ApiCoupon,
} from "@/lib/coupons-api";
import { ApiError } from "@/lib/api";
import { PaginationControls } from "@/components/pagination-controls";

const PAGE_SIZE = 20;

function deriveStatus(coupon: ApiCoupon): "Active" | "Inactive" | "Expired" {
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return "Expired";
  if (!coupon.isActive) return "Inactive";
  return "Active";
}

function statusBadge(status: "Active" | "Inactive" | "Expired") {
  switch (status) {
    case "Active":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
          Active
        </Badge>
      );
    case "Expired":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
          Expired
        </Badge>
      );
    case "Inactive":
      return (
        <Badge variant="secondary" className="bg-gray-50 text-gray-500 text-[10px]">
          Inactive
        </Badge>
      );
  }
}

export default function Coupons() {
  const [coupons, setCoupons] = useState<ApiCoupon[]>([]);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<ApiCoupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formCode, setFormCode] = useState("");
  const [formDiscountType, setFormDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [formDiscountValue, setFormDiscountValue] = useState("");
  const [formMinOrderAmount, setFormMinOrderAmount] = useState("");
  const [formMaxDiscountAmount, setFormMaxDiscountAmount] = useState("");
  const [formUsageLimit, setFormUsageLimit] = useState("");
  const [formExpiresAt, setFormExpiresAt] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listCoupons({ page, limit: PAGE_SIZE, search: search.trim() || undefined });
      setCoupons(result.coupons);
      setTotalCoupons(result.pagination.total);
      setTotalPages(result.pagination.totalPages || 1);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeout = setTimeout(() => void fetchCoupons(), 250);
    return () => clearTimeout(timeout);
  }, [fetchCoupons]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  function resetForm() {
    setFormCode("");
    setFormDiscountType("PERCENTAGE");
    setFormDiscountValue("");
    setFormMinOrderAmount("");
    setFormMaxDiscountAmount("");
    setFormUsageLimit("");
    setFormExpiresAt("");
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
      setEditingCoupon(null);
      resetForm();
    }
  }

  function openEdit(coupon: ApiCoupon) {
    setEditingCoupon(coupon);
    setFormCode(coupon.code);
    setFormDiscountType(coupon.discountType);
    setFormDiscountValue(coupon.discountValue);
    setFormMinOrderAmount(coupon.minOrderAmount ?? "");
    setFormMaxDiscountAmount(coupon.maxDiscountAmount ?? "");
    setFormUsageLimit(coupon.usageLimit != null ? String(coupon.usageLimit) : "");
    setFormExpiresAt(coupon.expiresAt ? coupon.expiresAt.slice(0, 16) : "");
    setFormIsActive(coupon.isActive);
    setErrors({});
    setEditOpen(true);
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!formCode.trim()) errs.code = "Code is required";
    if (!formDiscountValue || Number(formDiscountValue) <= 0) errs.discountValue = "Discount value must be greater than 0";
    if (formDiscountType === "PERCENTAGE" && Number(formDiscountValue) > 100) errs.discountValue = "Percentage cannot exceed 100";
    return errs;
  }

  async function handleAdd() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      await createCoupon({
        code: formCode.trim().toUpperCase(),
        discountType: formDiscountType,
        discountValue: Number(formDiscountValue),
        minOrderAmount: formMinOrderAmount ? Number(formMinOrderAmount) : null,
        maxDiscountAmount: formMaxDiscountAmount ? Number(formMaxDiscountAmount) : null,
        usageLimit: formUsageLimit ? Number(formUsageLimit) : null,
        expiresAt: formExpiresAt ? new Date(formExpiresAt).toISOString() : null,
        isActive: formIsActive,
      });
      toast.success(`Coupon "${formCode.trim().toUpperCase()}" created`);
      resetForm();
      setAddOpen(false);
      void fetchCoupons();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create coupon");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit() {
    if (!editingCoupon) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      await updateCoupon(editingCoupon.id, {
        code: formCode.trim().toUpperCase(),
        discountType: formDiscountType,
        discountValue: Number(formDiscountValue),
        minOrderAmount: formMinOrderAmount ? Number(formMinOrderAmount) : null,
        maxDiscountAmount: formMaxDiscountAmount ? Number(formMaxDiscountAmount) : null,
        usageLimit: formUsageLimit ? Number(formUsageLimit) : null,
        expiresAt: formExpiresAt ? new Date(formExpiresAt).toISOString() : null,
        isActive: formIsActive,
      });
      toast.success(`Coupon "${formCode.trim().toUpperCase()}" updated`);
      setEditingCoupon(null);
      resetForm();
      setEditOpen(false);
      void fetchCoupons();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update coupon");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(coupon: ApiCoupon) {
    if (!confirm(`Delete coupon "${coupon.code}"? This cannot be undone.`)) return;
    setDeletingId(coupon.id);
    try {
      await deleteCoupon(coupon.id);
      await fetchCoupons();
      toast.success(`Coupon "${coupon.code}" deleted`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete coupon");
    } finally {
      setDeletingId(null);
    }
  }

  function formatValue(coupon: ApiCoupon) {
    return coupon.discountType === "PERCENTAGE"
      ? `${coupon.discountValue}%`
      : `\u20B9${Number(coupon.discountValue).toLocaleString("en-IN")}`;
  }

  function formatMinOrder(coupon: ApiCoupon) {
    if (!coupon.minOrderAmount) return "\u2014";
    return `\u20B9${Number(coupon.minOrderAmount).toLocaleString("en-IN")}`;
  }

  function formatUsage(coupon: ApiCoupon) {
    if (coupon.usageLimit == null) return `${coupon.usedCount} / \u221E`;
    return `${coupon.usedCount} / ${coupon.usageLimit}`;
  }

  function formatExpiry(coupon: ApiCoupon) {
    if (!coupon.expiresAt) return "Never";
    return new Date(coupon.expiresAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const couponForm = (formId: string, onSubmit: () => void) => (
    <form id={formId} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${formId}-code`}>Coupon Code</FieldLabel>
          <Input
            id={`${formId}-code`}
            placeholder="e.g. SAVE20"
            value={formCode}
            onChange={(e) => {
              setFormCode(e.target.value);
              if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
            }}
            onBlur={() => setFormCode((c) => c.toUpperCase())}
            className="uppercase"
          />
          {errors.code && <FieldError>{errors.code}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Discount Type</FieldLabel>
          <Select
            value={formDiscountType}
            onValueChange={(v) => setFormDiscountType(v as "PERCENTAGE" | "FIXED")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
              <SelectItem value="FIXED">Fixed Amount (INR)</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-discountValue`}>
            Discount Value {formDiscountType === "PERCENTAGE" ? "(%)" : "(INR)"}
          </FieldLabel>
          <Input
            id={`${formId}-discountValue`}
            type="number"
            min="0"
            step="any"
            placeholder={formDiscountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 500"}
            value={formDiscountValue}
            onChange={(e) => {
              setFormDiscountValue(e.target.value);
              if (errors.discountValue) setErrors((prev) => ({ ...prev, discountValue: "" }));
            }}
          />
          {errors.discountValue && <FieldError>{errors.discountValue}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-minOrder`}>
            Min Order Amount <span className="text-muted-foreground font-normal">(optional)</span>
          </FieldLabel>
          <Input
            id={`${formId}-minOrder`}
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1000"
            value={formMinOrderAmount}
            onChange={(e) => setFormMinOrderAmount(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-maxDiscount`}>
            Max Discount Amount <span className="text-muted-foreground font-normal">(optional)</span>
          </FieldLabel>
          <Input
            id={`${formId}-maxDiscount`}
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 2000"
            value={formMaxDiscountAmount}
            onChange={(e) => setFormMaxDiscountAmount(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-usageLimit`}>
            Usage Limit <span className="text-muted-foreground font-normal">(optional, blank = unlimited)</span>
          </FieldLabel>
          <Input
            id={`${formId}-usageLimit`}
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 100"
            value={formUsageLimit}
            onChange={(e) => setFormUsageLimit(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-expiresAt`}>
            Expires At <span className="text-muted-foreground font-normal">(optional)</span>
          </FieldLabel>
          <Input
            id={`${formId}-expiresAt`}
            type="datetime-local"
            value={formExpiresAt}
            onChange={(e) => setFormExpiresAt(e.target.value)}
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
            <HugeiconsIcon icon={PercentCircleIcon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Coupons</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading\u2026" : `${coupons.length} of ${totalCoupons} coupons`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchCoupons} disabled={loading}>
            Refresh
          </Button>

          <Dialog open={addOpen} onOpenChange={handleAddOpenChange}>
            <DialogTrigger render={<Button className="gap-2" />}>
              <HugeiconsIcon icon={Add02Icon} size={16} />
              Add Coupon
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Coupon</DialogTitle>
                <DialogDescription>Create a new discount coupon.</DialogDescription>
              </DialogHeader>
              {couponForm("add-coupon", handleAdd)}
              <DialogFooter showCloseButton>
                <Button type="submit" form="add-coupon" disabled={!formCode || !formDiscountValue || saving}>
                  <HugeiconsIcon icon={Add02Icon} size={16} />
                  {saving ? "Creating\u2026" : "Add Coupon"}
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
            placeholder="Search coupons\u2026"
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
                  <HugeiconsIcon icon={PercentCircleIcon} size={14} className="text-blue-600 hidden sm:flex" />
                  <span>Code</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Value</TableHead>
              <TableHead className="font-semibold">Min Order</TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={UserIcon} size={14} className="text-purple-600 hidden sm:flex" />
                  <span>Usage</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-amber-600 hidden sm:flex" />
                  <span>Expires</span>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Loading coupons\u2026</TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  No coupons match your search.
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => {
                const status = deriveStatus(coupon);
                return (
                  <TableRow key={coupon.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded font-semibold">
                        {coupon.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {coupon.discountType === "PERCENTAGE" ? "Percent" : "Fixed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatValue(coupon)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {formatMinOrder(coupon)}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {formatUsage(coupon)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatExpiry(coupon)}
                    </TableCell>
                    <TableCell>{statusBadge(status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => openEdit(coupon)}
                        >
                          <HugeiconsIcon icon={Edit02Icon} size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                          disabled={deletingId === coupon.id}
                          onClick={() => handleDelete(coupon)}
                        >
                          <HugeiconsIcon icon={Trash} size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
        <PaginationControls page={page} totalPages={totalPages} disabled={loading} onPageChange={setPage} />
      </div>

      <Dialog open={editOpen} onOpenChange={handleEditOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>Update details for {editingCoupon?.code}.</DialogDescription>
          </DialogHeader>
          {couponForm("edit-coupon", handleEdit)}
          <DialogFooter showCloseButton>
            <Button type="submit" form="edit-coupon" disabled={!formCode || !formDiscountValue || saving}>
              {saving ? "Saving\u2026" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
