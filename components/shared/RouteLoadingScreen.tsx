import { Skeleton } from "./Skeleton";

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
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <Skeleton className="mx-auto block h-10 w-64" />
        <Skeleton className="mx-auto block h-5 w-80 max-w-full" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: compact ? 6 : 8 }, (_, index) => (
            <Skeleton key={index} className="block h-48 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
