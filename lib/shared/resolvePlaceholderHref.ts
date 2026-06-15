export function resolvePlaceholderHref(rawHref: string | null | undefined) {
  const href = String(rawHref ?? "").trim();

  if (!href) return "/__update_soon__";
  if (href === "#") return "/__update_soon__";
  if (href === "/update") return "/__update_soon__";
  if (href.startsWith("javascript:")) return "/__update_soon__";

  return href;
}
