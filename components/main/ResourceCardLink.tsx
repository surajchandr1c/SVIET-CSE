import type { LucideIcon } from "lucide-react";

export default function ResourceCardLink({
  href,
  title,
  subtitle,
  Icon,
  targetBlank = true,
}: {
  href: string;
  title: string;
  subtitle?: string;
  Icon?: LucideIcon;
  targetBlank?: boolean;
}) {
  return (
    <a
      href={href}
      target={targetBlank ? "_blank" : undefined}
      rel={targetBlank ? "noopener noreferrer" : undefined}
      className="group relative h-full overflow-hidden rounded-2xl bg-white p-7 shadow-[0_10px_24px_rgba(17,24,39,0.10)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(17,24,39,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-blue-600 shadow-[2px_0_10px_rgba(37,99,235,0.25)]"
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-extrabold text-slate-900 md:text-[1.35rem]">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-3 text-sm font-semibold tracking-wide text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>

        {Icon ? (
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/15 transition group-hover:bg-blue-600/15">
            <Icon className="h-6 w-6" />
          </div>
        ) : null}
      </div>
    </a>
  );
}
