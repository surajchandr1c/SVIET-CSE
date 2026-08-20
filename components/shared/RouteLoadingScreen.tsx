type RouteLoadingScreenProps = {
  compact?: boolean;
};

export default function RouteLoadingScreen({
  compact = false,
}: RouteLoadingScreenProps) {
  return (
    <div
      className={[
        "flex w-full flex-col items-center justify-center",
        compact ? "min-h-[55vh] py-12" : "min-h-screen px-6 py-16",
      ].join(" ")}
    >
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-[#1f56e4] animate-spin" />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.28em] text-[#1f56e4]">
          Loading
        </p>
        <div className="mt-3 h-3 w-40 rounded-full bg-slate-200 animate-pulse" />
        <div className="mt-2 h-3 w-28 rounded-full bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}
