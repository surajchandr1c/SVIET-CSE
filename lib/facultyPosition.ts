export function normalizeFacultyPosition(
  value: unknown
): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) return null;
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) throw new Error("Invalid position");
    if (!Number.isInteger(parsed) || parsed < 1) throw new Error("Invalid position");
    return parsed;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Invalid position");
    if (!Number.isInteger(value) || value < 1) throw new Error("Invalid position");
    return value;
  }

  throw new Error("Invalid position");
}

