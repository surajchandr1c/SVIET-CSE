export default function AdminPageIntroCard({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl admin-card p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
        {kicker}
      </p>
      <h1 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
        {description}
      </p>
    </div>
  );
}

