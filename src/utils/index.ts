export function removeElementAtIndex<T>(array: T[], index: number): T[] {
  return [
      ...array.slice(0, index),
      ...array.slice(index + 1)
  ];
}

export function createNestedArray<T>(length: number) {
  return Array.from({ length: length }, () => Array.from({ length: length }, () => [] as T[]));
}