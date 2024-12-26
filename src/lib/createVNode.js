export function createVNode(type, props, ...children) {
  const flattenedChildren = children
    .flat(Infinity)
    .filter(
      (child) =>
        child !== null && child !== undefined && typeof child !== "boolean",
    );

  // type가 함수일 경우 (class도 포함)
  if (typeof type === "function") {
    return {
      type,
      props: props || {},
      children: flattenedChildren,
    };
  }

  return { type, props, children: flattenedChildren };
}
