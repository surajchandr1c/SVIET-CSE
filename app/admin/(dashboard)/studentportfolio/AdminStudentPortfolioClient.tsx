"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeOff, ImageOff, Pin, Trash2 } from "lucide-react";
import SmartImage from "@/components/shared/SmartImage";
import { normalizeImageUrl } from "@/lib/imageUrl";
import { slugifyProfileName } from "@/app/(main)/batches/slug";
import type { BatchProfile } from "@/app/(main)/batches/types";
import { MAX_PINNED_BATCH_PROFILES } from "@/lib/shared/batchProfilePins";
import { PortfolioGridSkeleton } from "@/components/shared/Skeleton";

type BatchTab = "2024" | "2025";

const tabs: Array<{ key: BatchTab; label: string }> = [
  { key: "2024", label: "2024 Batch" },
  { key: "2025", label: "2025 Batch" },
];

export default function AdminStudentPortfolioClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") === "2024" ? "2024" : "2025") satisfies BatchTab;
  const [profiles4th, setProfiles4th] = useState<BatchProfile[]>([]);
  const [profiles5th, setProfiles5th] = useState<BatchProfile[]>([]);
  const [profilesError, setProfilesError] = useState("");
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [pinnedAdmissionNos, setPinnedAdmissionNos] = useState<string[]>([]);
  const [pendingAdmissionNo, setPendingAdmissionNo] = useState<string>("");
  const [pinError, setPinError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex((tab) => tab.key === activeTab)),
    [activeTab]
  );
  const profiles = activeTab === "2025" ? profiles5th : profiles4th;

  useEffect(() => {
    let ignore = false;

    const loadProfiles = async () => {
      try {
        const res = await fetch("/api/admin/studentportfolio", {
          cache: "no-store",
          credentials: "include",
        });
        const data = (await res.json()) as {
          profiles4th?: BatchProfile[];
          profiles5th?: BatchProfile[];
          error?: string;
        };
        if (!res.ok) throw new Error(data.error || "Failed to load student portfolios.");

        if (!ignore) {
          setProfiles4th(Array.isArray(data.profiles4th) ? data.profiles4th : []);
          setProfiles5th(Array.isArray(data.profiles5th) ? data.profiles5th : []);
          setProfilesError("");
        }
      } catch (error) {
        if (!ignore) {
          setProfilesError(error instanceof Error ? error.message : "Failed to load student portfolios.");
        }
      } finally {
        if (!ignore) {
          setProfilesLoading(false);
        }
      }
    };

    const loadPins = async () => {
      try {
        const res = await fetch("/api/admin/studentportfolio/pins", {
          cache: "no-store",
          credentials: "include",
        });
        const data = (await res.json()) as { pinnedAdmissionNos?: string[]; error?: string };
        if (!res.ok) throw new Error(data.error || "Failed to load pinned profiles.");
        if (!ignore) {
          setPinnedAdmissionNos(Array.isArray(data.pinnedAdmissionNos) ? data.pinnedAdmissionNos : []);
          setPinError("");
        }
      } catch (error) {
        if (!ignore) {
          setPinError(error instanceof Error ? error.message : "Failed to load pinned profiles.");
        }
      }
    };

    void loadProfiles();
    void loadPins();

    return () => {
      ignore = true;
    };
  }, []);

  const refreshProfiles = async () => {
    const res = await fetch("/api/admin/studentportfolio", {
      cache: "no-store",
      credentials: "include",
    });
    const data = (await res.json()) as {
      profiles4th?: BatchProfile[];
      profiles5th?: BatchProfile[];
      error?: string;
    };
    if (!res.ok) throw new Error(data.error || "Failed to load student portfolios.");

    setProfiles4th(Array.isArray(data.profiles4th) ? data.profiles4th : []);
    setProfiles5th(Array.isArray(data.profiles5th) ? data.profiles5th : []);
    setProfilesError("");
  };

  const togglePin = async (admissionNo: string, nextPinned: boolean) => {
    try {
      setPendingAdmissionNo(admissionNo);
      setPinError("");

      const res = await fetch("/api/admin/studentportfolio/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ admissionNo, pinned: nextPinned }),
      });
      const data = (await res.json()) as { pinnedAdmissionNos?: string[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to update pinned profile.");

      setPinnedAdmissionNos(Array.isArray(data.pinnedAdmissionNos) ? data.pinnedAdmissionNos : []);
    } catch (error) {
      setPinError(error instanceof Error ? error.message : "Failed to update pinned profile.");
    } finally {
      setPendingAdmissionNo("");
    }
  };

  const toggleDisabled = async (admissionNo: string, nextDisabled: boolean) => {
    try {
      setPendingAdmissionNo(admissionNo);
      setActionError("");
      setActionMessage("");

      const res = await fetch(`/api/admin/studentportfolio/${encodeURIComponent(admissionNo)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isDisabled: nextDisabled }),
      });
      const data = (await res.json()) as {
        profile?: { admissionNo?: string; isDisabled?: boolean };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Failed to update profile visibility.");

      await refreshProfiles();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Failed to update profile visibility."
      );
    } finally {
      setPendingAdmissionNo("");
    }
  };

  const deleteImage = async (admissionNo: string, name: string) => {
    const confirmed = window.confirm(
      `Delete ${name}'s portfolio image? The student can upload a new image from the student dashboard.`
    );
    if (!confirmed) return;

    try {
      setPendingAdmissionNo(admissionNo);
      setActionError("");
      setActionMessage("");

      const res = await fetch(`/api/admin/studentportfolio/${encodeURIComponent(admissionNo)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ removeImage: true }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to delete profile image.");

      await refreshProfiles();
      setActionMessage(`${name}'s portfolio image was deleted.`);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to delete profile image.");
    } finally {
      setPendingAdmissionNo("");
    }
  };

  const deleteProfile = async (admissionNo: string, name: string) => {
    const confirmed = window.confirm(
      `Delete ${name}'s profile? This removes only the portfolio profile, not the student account.`
    );
    if (!confirmed) return;

    try {
      setPendingAdmissionNo(admissionNo);
      setActionError("");
      setActionMessage("");

      const res = await fetch(`/api/admin/studentportfolio/${encodeURIComponent(admissionNo)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = (await res.json()) as { pinnedAdmissionNos?: string[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to delete profile.");

      await refreshProfiles();
      setPinnedAdmissionNos(Array.isArray(data.pinnedAdmissionNos) ? data.pinnedAdmissionNos : []);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to delete profile.");
    } finally {
      setPendingAdmissionNo("");
    }
  };

  return (
    <section className="space-y-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="admin-card p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
            Student Portfolio
          </p>
          <h1 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
            Student Portfolio
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
            Open a semester to view student portfolio profiles.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="admin-card p-4">
          <div className="max-w-xl">
            <div className="relative overflow-hidden rounded-full bg-slate-950/90 p-1 shadow-[0_18px_60px_rgba(0,0,0,0.25)] ring-1 ring-black/10">
              <div role="tablist" aria-label="Student portfolio batch selection" className="grid grid-cols-2 gap-1">
                {tabs.map((tab) => {
                  const isActive = tab.key === activeTab;
                  const count = tab.key === "2025" ? profiles5th.length : profiles4th.length;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => router.push(`/admin/studentportfolio?tab=${tab.key}`)}
                      className={[
                        "relative z-10 rounded-full px-6 py-3 text-center text-sm font-semibold md:px-10 md:text-base",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60",
                        isActive ? "text-slate-900" : "text-white",
                      ].join(" ")}
                    >
                      {tab.label} ({count})
                    </button>
                  );
                })}
              </div>

              <div
                aria-hidden
                className="absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc((100%-0.25rem)/2)] rounded-full bg-yellow-400 shadow-[0_10px_26px_rgba(250,204,21,0.35)] transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="admin-card p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
                {activeTab === "2025" ? "2025 Batch" : "2024 Batch"}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[var(--admin-text)]">
                Student Portfolios
              </h2>
            </div>
            <p className="text-sm font-semibold text-[var(--admin-text-muted)]">
              Total: {profiles.length}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-muted)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--admin-text)]">
              Pinned on top of `/batches`: {pinnedAdmissionNos.length}/{MAX_PINNED_BATCH_PROFILES}
            </p>
            <p className="text-xs text-[var(--admin-text-muted)]">
              Select up to 5 profiles to feature above the batch tabs.
            </p>
          </div>

          {pinError ? (
            <p className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {pinError}
            </p>
          ) : null}

          {actionError ? (
            <p className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {actionError}
            </p>
          ) : null}

          {actionMessage ? (
            <p className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {actionMessage}
            </p>
          ) : null}

          {profilesLoading ? (
            <div className="mt-6"><PortfolioGridSkeleton /></div>
          ) : profilesError ? (
            <p className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {profilesError}
            </p>
          ) : profiles.length === 0 ? (
            <p className="mt-6 text-center text-sm text-[var(--admin-text-muted)]">
              No profiles found.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
              {profiles.map((profile) => {
                const slug = slugifyProfileName(profile.name);
                const imageSrc = normalizeImageUrl(profile.image);
                const isPinned = pinnedAdmissionNos.includes(profile.admissionNo);
                const pinLimitReached =
                  !isPinned && pinnedAdmissionNos.length >= MAX_PINNED_BATCH_PROFILES;
                const isPending = pendingAdmissionNo === profile.admissionNo;
                const isDisabled = profile.isDisabled === true;

                return (
                  <div
                    key={profile._id}
                    className="relative overflow-hidden rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)] transition hover:-translate-y-0.5"
                  >
                    {isPending ? (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-[color:color-mix(in_srgb,var(--admin-surface)_72%,transparent)] backdrop-blur-[2px]">
                        <span className="rounded-full border border-[var(--admin-border)] bg-[var(--admin-muted)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--admin-text)]">
                          Updating
                        </span>
                      </div>
                    ) : null}

                    <div className="flex items-center gap-4">
                      <Link
                        href={`/batches/${slug}`}
                        className="flex min-w-0 flex-1 items-center gap-4"
                        aria-label={`Open profile: ${profile.name}`}
                      >
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-muted)]">
                          <SmartImage
                            src={imageSrc}
                            alt={profile.name}
                            className="portfolio-profile-image-admin"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-lg font-bold leading-tight text-[var(--admin-text)]">
                            {profile.name}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[var(--admin-text-muted)]">
                            {profile.admissionNo}
                          </p>
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={() => deleteImage(profile.admissionNo, profile.name)}
                        disabled={isPending || imageSrc === "/no-image.png"}
                        className="admin-secondary-button shrink-0 px-3 text-xs"
                        aria-label={`Delete image for ${profile.name}`}
                        title={
                          imageSrc === "/no-image.png"
                            ? "No portfolio image to delete"
                            : "Delete portfolio image"
                        }
                      >
                        <ImageOff size={15} aria-hidden="true" />
                        <span className="hidden sm:inline">Delete image</span>
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--admin-border)] pt-4">
                      <button
                        type="button"
                        onClick={() => togglePin(profile.admissionNo, !isPinned)}
                        disabled={isPending || pinLimitReached}
                        className={`inline-flex h-11 items-center gap-2 rounded-2xl border border-transparent bg-[var(--admin-accent)] px-4 text-sm font-semibold text-white transition ${
                          isPending || pinLimitReached ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5"
                        }`}
                        aria-label={isPinned ? `Unpin ${profile.name}` : `Pin ${profile.name}`}
                        title={
                          pinLimitReached
                            ? `Only ${MAX_PINNED_BATCH_PROFILES} profiles can be pinned.`
                            : isPinned
                              ? "Remove from pinned section"
                              : "Pin to top of batches page"
                        }
                      >
                        <Pin size={15} className="text-white" />
                        {isPinned ? "Pinned on top" : "Pin profile"}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleDisabled(profile.admissionNo, !isDisabled)}
                        disabled={isPending}
                        className={`inline-flex h-11 items-center gap-2 rounded-2xl border border-transparent bg-[#eab308] px-4 text-sm font-semibold text-white transition ${
                          isPending ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5"
                        }`}
                        aria-label={isDisabled ? `Enable ${profile.name}` : `Disable ${profile.name}`}
                      >
                        <EyeOff size={15} className="text-white" />
                        {isDisabled ? "Undisable profile" : "Disable profile"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteProfile(profile.admissionNo, profile.name)}
                        disabled={isPending}
                        className={`inline-flex h-11 items-center gap-2 rounded-2xl border border-transparent bg-[#dc2626] px-4 text-sm font-semibold text-white transition ${
                          isPending ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5"
                        }`}
                        aria-label={`Delete ${profile.name}`}
                      >
                        <Trash2 size={15} className="text-white" />
                        Delete profile
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
