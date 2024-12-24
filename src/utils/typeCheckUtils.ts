type Types =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function";

export function isTypeIn(
  target: unknown,
  types: Types[],
): target is Types[number] {
  return types.includes(typeof target);
}
