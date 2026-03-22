import Link from "next/link";

export default function NotFound() {
  return (
    <div className="admin-card mx-auto max-w-3xl p-8 text-center">
      <p className="text-sm font-semibold text-blue-600">Admin</p>
      <h1 className="mt-3 text-3xl font-extrabold">Update Soon</h1>
      <p className="mt-3 text-base font-medium text-gray-600">
        This page will be updated soon.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/admin/dashboard"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3c5d]/30"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/admin/login"
          className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
}
