type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return <span aria-hidden="true" className={`skeleton ${className}`} />;
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading content">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#0b1c47]/75">
          <Skeleton className="block h-57.5 w-full" />
          <div className="space-y-3 p-4">
            <Skeleton className="mx-auto block h-6 w-3/4" />
            <Skeleton className="mx-auto block h-5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NoticeListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul role="status" aria-label="Loading notices">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="flex gap-4 border-b border-cyan-300/15 px-3 py-4 last:border-b-0">
          <Skeleton className="block h-5 w-28 shrink-0" />
          <Skeleton className="block h-5 w-2/3" />
        </li>
      ))}
    </ul>
  );
}

export function ResourceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading resources">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <Skeleton className="block h-10 w-10 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="block h-5 w-3/4" />
              <Skeleton className="block h-4 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminTableSkeleton({ columns = 5, rows = 8 }: { columns?: number; rows?: number }) {
  return (
    <div className="space-y-0" role="status" aria-label="Loading table">
      <div className="grid min-w-180 grid-cols-5 gap-5 bg-(--admin-muted) px-5 py-4">
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="block h-4 w-24" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="grid min-w-180 grid-cols-5 gap-5 border-t border-(--admin-border) px-5 py-5">
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton key={column} className={`block h-5 ${column === columns - 1 ? "ml-auto w-28" : "w-32"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PortfolioGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2" role="status" aria-label="Loading student portfolios">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex min-h-37.5 gap-4 rounded-3xl border border-(--admin-border) bg-(--admin-surface) p-5">
          <Skeleton className="block h-24 w-24 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-3 pt-2">
            <Skeleton className="block h-6 w-2/3" />
            <Skeleton className="block h-4 w-1/3" />
            <div className="mt-6 flex gap-2">
              <Skeleton className="block h-10 w-28 rounded-2xl" />
              <Skeleton className="block h-10 w-28 rounded-2xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BatchPageSkeleton() {
  return (
    <section className="pt-12" role="status" aria-label="Loading batches">
      <Skeleton className="mx-auto mb-6 block h-8 w-64" />
      <Skeleton className="mx-4 block h-14 rounded-full sm:mx-6 lg:mx-8" />
      <div className="mx-4 mt-3 flex justify-center sm:mx-6 lg:mx-8">
        <Skeleton className="h-12 w-full max-w-xl rounded-full" />
      </div>
      <div className="mx-4 mt-8 grid grid-cols-1 gap-8 sm:mx-6 sm:grid-cols-2 lg:mx-8 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="block h-115 rounded-3xl" />
        ))}
      </div>
    </section>
  );
}

export function PublicStudentTableSkeleton() {
  return (
    <section className="min-h-screen px-6 pb-10 pt-8" role="status" aria-label="Loading students">
      <Skeleton className="mx-auto block h-9 w-56" />
      <Skeleton className="mx-auto mt-3 block h-5 w-72" />
      <Skeleton className="mx-auto mt-8 block h-14 max-w-xl rounded-full" />
      <div className="mx-auto mt-8 max-w-295 overflow-hidden rounded-2xl bg-white p-4 shadow-lg">
        <div className="space-y-3">
          <Skeleton className="block h-12 w-full rounded-xl" />
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="block h-10 w-full" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading admin page">
      <div className="admin-card p-8">
        <Skeleton className="block h-4 w-32" />
        <Skeleton className="mt-4 block h-10 w-72" />
        <Skeleton className="mt-3 block h-5 w-full max-w-2xl" />
      </div>
      <div className="admin-card p-6">
        <Skeleton className="block h-12 w-full" />
        <div className="mt-5 overflow-hidden"><AdminTableSkeleton /></div>
      </div>
    </div>
  );
}

export function AdminCardListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading items">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex min-h-24 flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center">
          <Skeleton className="block h-20 w-28 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton className="block h-5 w-1/2" />
            <Skeleton className="block h-4 w-1/3" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="block h-9 w-20 rounded-lg" />
            <Skeleton className="block h-9 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
