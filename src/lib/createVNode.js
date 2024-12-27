export function createVNode(type, props, ...children) {
  const flatChildren = children.flat(Infinity);
  //1. children이 조건부 (예를 들어 true && <div>Shown</div>)이면 true일 때의 children만 return
  //2. children에 null, undefined가 있으면 제거하고 return
  const filteredChildren = flatChildren.filter(
    (child) => child !== null && child !== undefined && child !== false,
  );
  return { type, props, children: filteredChildren };
}
