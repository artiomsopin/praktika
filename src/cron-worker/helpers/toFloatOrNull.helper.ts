export function toFloatOrNull(value: any): number | null {
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}
