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
        "inline-flex items-center justify-center gap-2 cursor-pointer rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold !text-white text-white disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:!text-white [&_svg]:!stroke-white"
      }
      title="Logout from student portal"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin shrink-0 !text-white text-white" color="#ffffff" />
          <span className="!text-white text-white">Logging out...</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4 shrink-0 !text-white text-white" color="#ffffff" />
          <span className="!text-white text-white">Logout</span>
        </>
      )}
    </button>
  );
}

