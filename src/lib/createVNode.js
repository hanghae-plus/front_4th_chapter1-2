export function createVNode(type, props, ...children) {
  // TODO: 0을 제외한 Falsy 값은 필터링
  const filteredChildren = children.flat(Infinity).filter((child) => {
    return !(
      typeof child === "boolean" ||
      typeof child === "undefined" ||
      child === null
    );
  });

  return { type, props, children: filteredChildren };
}
