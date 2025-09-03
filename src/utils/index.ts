export function getValue<T, R = unknown>(obj: T, path: string): R | undefined {
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as R | undefined;
}
