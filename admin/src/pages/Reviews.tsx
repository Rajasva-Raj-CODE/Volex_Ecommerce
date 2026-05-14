import { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search02Icon,
  StarIcon,
  CheckmarkCircle02Icon,
  UserIcon,
  Calendar02Icon,
  Delete02Icon,
  Package01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  listReviews,
  updateReviewStatus,
  deleteReview,
  type AdminReview,
} from "@/lib/reviews-api";
import { ApiError } from "@/lib/api";
import { PaginationControls } from "@/components/pagination-controls";

type StatusTab = "All" | "Pending" | "Approved";
const STATUS_TABS: StatusTab[] = ["All", "Pending", "Approved"];

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= rating ? "text-amber-400" : "text-muted-foreground/30"}`}
        >
          &#9733;
        </span>
      ))}
    </span>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listReviews({
        page,
        limit: PAGE_SIZE,
        isApproved:
          activeTab === "Approved"
            ? true
            : activeTab === "Pending"
              ? false
              : undefined,
      });
      setReviews(result.reviews);
      setTotalReviews(result.pagination.total);
      setTotalPages(result.pagination.totalPages || 1);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load reviews"
      );
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const filtered = reviews.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.product.name.toLowerCase().includes(q) ||
      (r.user.name ?? "").toLowerCase().includes(q) ||
      r.user.email.toLowerCase().includes(q) ||
      (r.comment ?? "").toLowerCase().includes(q)
    );
  });

  async function handleApprove(review: AdminReview) {
    setActionId(review.id);
    try {
      const result = await updateReviewStatus(review.id, true);
      setReviews((prev) =>
        prev.map((r) => (r.id === result.review.id ? result.review : r))
      );
      toast.success("Review approved");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to approve review"
      );
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(review: AdminReview) {
    setActionId(review.id);
    try {
      const result = await updateReviewStatus(review.id, false);
      setReviews((prev) =>
        prev.map((r) => (r.id === result.review.id ? result.review : r))
      );
      toast.success("Review rejected");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to reject review"
      );
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(review: AdminReview) {
    setActionId(review.id);
    try {
      await deleteReview(review.id);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
      setTotalReviews((prev) => prev - 1);
      toast.success("Review deleted");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete review"
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon
              icon={StarIcon}
              size={22}
              className="text-primary"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Reviews</h1>
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Loading..."
                : `${filtered.length} of ${totalReviews} reviews`}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchReviews}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <HugeiconsIcon
            icon={Search02Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, customer..."
            className="h-9 pl-9"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUS_TABS.map((tab) => {
          const count = tab === activeTab ? totalReviews : "";
          return (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="h-8 gap-1.5 text-xs"
            >
              {tab}
              {count !== "" && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    activeTab === tab
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Package01Icon}
                    size={14}
                    className="hidden text-purple-600 sm:flex"
                  />
                  <span>Product</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={UserIcon}
                    size={14}
                    className="hidden text-blue-600 sm:flex"
                  />
                  <span>Customer</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={StarIcon}
                    size={14}
                    className="hidden text-amber-500 sm:flex"
                  />
                  <span>Rating</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">Comment</TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={14}
                    className="hidden text-cyan-600 sm:flex"
                  />
                  <span>Status</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Calendar02Icon}
                    size={14}
                    className="hidden text-amber-600 sm:flex"
                  />
                  <span>Date</span>
                </div>
              </TableHead>
              <TableHead className="w-28 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground"
                >
                  Loading reviews...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground"
                >
                  {reviews.length === 0
                    ? "No reviews yet."
                    : "No reviews match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((review) => (
                <TableRow
                  key={review.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  {/* Product */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {review.product.images[0] && (
                        <img
                          src={review.product.images[0]}
                          alt={review.product.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                      )}
                      <span className="max-w-[160px] truncate text-sm font-medium">
                        {review.product.name}
                      </span>
                    </div>
                  </TableCell>

                  {/* Customer */}
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {review.user.name ?? "\u2014"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.user.email}
                      </p>
                    </div>
                  </TableCell>

                  {/* Rating */}
                  <TableCell>
                    <StarDisplay rating={review.rating} />
                  </TableCell>

                  {/* Comment */}
                  <TableCell>
                    <div className="max-w-[220px]">
                      {review.title && (
                        <p className="truncate text-sm font-medium">
                          {review.title}
                        </p>
                      )}
                      <p className="truncate text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        review.isApproved
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                          : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50"
                      }
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {!review.isApproved ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          disabled={actionId === review.id}
                          onClick={() => handleApprove(review)}
                        >
                          {actionId === review.id ? "..." : "Approve"}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          disabled={actionId === review.id}
                          onClick={() => handleReject(review)}
                        >
                          {actionId === review.id ? "..." : "Reject"}
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                            disabled={actionId === review.id}
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Review</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this review by{" "}
                              <strong>{review.user.name ?? review.user.email}</strong>?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(review)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <PaginationControls
          page={page}
          totalPages={totalPages}
          disabled={loading}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
