"use client";

import { useEffect, useState } from "react";

export const useApiArray = <T,>(url: string): T[] => {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
      } catch {
        if (!alive) return;
        setItems([]);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [url]);

  return items;
};

export const useApiArrayWithLoading = <T,>(
  url: string
): { items: T[]; loading: boolean } => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    const load = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
      } catch {
        if (!alive) return;
        setItems([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [url]);

  return { items, loading };
};
