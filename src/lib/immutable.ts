/**
 * Return a copy of `obj` with the value at `path` replaced. Untouched branches keep
 * their references (structural sharing); nothing is mutated in place.
 */
export function setPath<T>(obj: T, path: readonly string[], value: unknown): T {
  if (path.length === 0) return value as T
  const [head, ...rest] = path
  const record = obj as Record<string, unknown>
  return {
    ...record,
    [head]: setPath(record[head], rest, value),
  } as T
}
