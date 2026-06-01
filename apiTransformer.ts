function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function transformKeysToCamel<T>(obj: Record<string, any>): T {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const camelKey = toCamelCase(key);
    result[camelKey] = obj[key];
  }

  return result as T;
}