export function useSafeArray<T>(array: T[] | undefined | null): T[] {
  return Array.isArray(array) ? array : [];
}
