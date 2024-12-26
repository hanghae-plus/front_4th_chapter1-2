export function createVNode(type, props, ...children) {
  // depth 없이 펼치기
  const flattenChildren = (children) => {
    return children.flat(Infinity).filter((child) => {
      return child || child === 0 || child === "";
    });
  };

  return {
    type: type,
    props: props,
    children: flattenChildren(children),
  };
}
