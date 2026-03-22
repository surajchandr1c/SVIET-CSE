export type FacultySortable = {
  position?: number | null;
  createdAt?: Date | string | null;
};

function toSortablePosition(value: unknown): number | null {
  if (typeof value !== "number") return null;
  if (!Number.isFinite(value)) return null;
  return value;
}

function toMillis(value: unknown): number {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(String(value));
  const millis = date.getTime();
  return Number.isFinite(millis) ? millis : 0;
}

export function compareFacultyByPositionThenCreatedAtDesc(
  a: FacultySortable,
  b: FacultySortable
) {
  const aPos = toSortablePosition(a.position);
  const bPos = toSortablePosition(b.position);

  if (aPos !== null && bPos !== null) {
    if (aPos !== bPos) return aPos - bPos;
    // Same explicit position: keep older first so newer entries don't jump ahead.
    return toMillis(a.createdAt) - toMillis(b.createdAt);
  }
  if (aPos !== null) return -1;
  if (bPos !== null) return 1;

  // No explicit position: keep older first so new profiles append to the end.
  return toMillis(a.createdAt) - toMillis(b.createdAt);
}
