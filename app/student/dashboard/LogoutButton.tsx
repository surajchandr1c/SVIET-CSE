"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/student/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Student logout failed:", err);
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={logout}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 cursor-pointer rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-60"
      }
      title="Logout from student portal"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </>
      )}
    </button>
  );
}

