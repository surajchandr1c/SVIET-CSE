"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-transparent p-8">
      <h1 className="mb-4 text-center text-3xl font-bold text-[#0b3c5d]">
        TechXplore Team
      </h1>
      <p className="text-center text-gray-700">
        Failed to load TechXplore data. Please try again.
      </p>
      <p className="mt-2 text-center text-xs text-gray-500">
        {error.digest ?? error.message}
      </p>
      <div className="mt-6 flex justify-center">
        <button
          onClick={reset}
          className="rounded-lg bg-[#0b3c5d] px-4 py-2 text-white hover:bg-[#062a41]"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

