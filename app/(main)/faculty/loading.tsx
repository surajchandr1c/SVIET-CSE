export default function Loading() {
  return (
    <div className="min-h-screen bg-transparent p-8">
      <h1 className="text-3xl font-bold text-center text-[#0b3c5d] mb-10">
        Our Faculty
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="text-center">
            <div className="mx-auto h-40 w-40 rounded-full bg-gray-200 animate-pulse" />
            <div className="mx-auto mt-4 h-4 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="mx-auto mt-2 h-3 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

