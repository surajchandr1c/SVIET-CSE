type AdminPaginationProps = {
  page: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  showPageCount?: boolean;
};

export default function AdminPagination({
  page,
  totalPages,
  loading = false,
  onPageChange,
  showPageCount = false,
}: AdminPaginationProps) {
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="admin-pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={loading || !canGoPrevious}
        className="admin-secondary-button"
      >
        Prev
      </button>

      {showPageCount && (
        <p className="text-sm text-[var(--admin-text-muted)]">
          Page {page} / {totalPages}
        </p>
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={loading || !canGoNext}
        className="admin-secondary-button"
      >
        Next
      </button>
    </div>
  );
}
