export function buildQuery(
  params: Record<
    string,
    string | number | undefined | (string | number)[] | null
  >
) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      const arr = v.map(String).filter(Boolean);
      if (arr.length) qs.set(k, arr.join(","));
    } else {
      const s = String(v).trim();
      if (s.length) qs.set(k, s);
    }
  });
  const q = qs.toString();
  return q ? `?${q}` : "";
}
