import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

function getVisiblePages(page: number, totalPages: number) {
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, start + 2);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function PaginationControls({ page, totalPages, disabled, onPageChange }: PaginationControlsProps) {
  const visiblePages = getVisiblePages(page, totalPages);

  function goTo(nextPage: number) {
    if (disabled || nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    onPageChange(nextPage);
  }

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page <= 1 || disabled}
            className={page <= 1 || disabled ? "pointer-events-none opacity-50" : ""}
            onClick={(event) => {
              event.preventDefault();
              goTo(page - 1);
            }}
          />
        </PaginationItem>
        {visiblePages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              isActive={pageNumber === page}
              onClick={(event) => {
                event.preventDefault();
                goTo(pageNumber);
              }}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page >= totalPages || disabled}
            className={page >= totalPages || disabled ? "pointer-events-none opacity-50" : ""}
            onClick={(event) => {
              event.preventDefault();
              goTo(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
