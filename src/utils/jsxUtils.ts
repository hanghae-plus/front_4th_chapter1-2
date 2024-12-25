type ValidVNode = Exclude<any, boolean | undefined | null>;

// 반환 값은 Boolean, undefined, null 이 아님
export function isValidVNodeType(type: unknown): type is ValidVNode {
  if (typeof type === "number") return true;

  if (typeof type === "boolean") return false;

  return Boolean(type);
}
