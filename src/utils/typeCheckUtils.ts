type Types =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function";

export function isTypeIn(target: unknown, types: Types[]) {
  return types.includes(typeof target);
}
