export type TechxploreSortable = {
  order?: number | null;
  createdAt?: Date | string | null;
};

function toSortableOrder(value: unknown): number | null {
  if (typeof value !== "number") return null;
  if (!Number.isFinite(value)) return null;
  if (!Number.isInteger(value) || value < 1) return null;
  return value;
}

function toMillis(value: unknown): number {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(String(value));
  const millis = date.getTime();
  return Number.isFinite(millis) ? millis : 0;
}

export function compareTechxploreByOrderThenCreatedAtAsc(
  a: TechxploreSortable,
  b: TechxploreSortable
) {
  const aOrder = toSortableOrder(a.order);
  const bOrder = toSortableOrder(b.order);

  if (aOrder !== null && bOrder !== null) {
    if (aOrder !== bOrder) return aOrder - bOrder;
    return toMillis(a.createdAt) - toMillis(b.createdAt);
  }
  if (aOrder !== null) return -1;
  if (bOrder !== null) return 1;

  return toMillis(a.createdAt) - toMillis(b.createdAt);
}
