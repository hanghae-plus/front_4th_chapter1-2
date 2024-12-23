export function normalizeVNode(vNode) {
  // vNode가 null, undefined, boolean 타입일 경우 빈 문자열 반환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // vNode가 문자열, 숫자일 경우 문자열로 변환하여 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // vNode의 타입이 함수일 경우 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화
  if (typeof vNode === "object" && typeof vNode.type === "function") {
    const result = vNode.type(vNode.props || {});

    if (result && result.children) {
      const normalizedChild = result.children.map(normalizeVNode)
        ? result.children.map(normalizeVNode)
        : [normalizeVNode(result.children)];

      result.children = normalizedChild;
    }

    return normalizeVNode(result);
  }

  if (vNode && typeof vNode === "object") {
    const { children, type, props } = vNode;
    const normalizedProps = { ...props };

    let normalizedchildren = [];
    if (Array.isArray(children)) {
      normalizedchildren = children
        .map((child) => normalizeVNode(child))
        .filter(
          (child) => child !== "" && child !== null && child !== undefined,
        );
    } else {
      normalizedchildren = [normalizedchildren[children]];
    }

    console.log("Returning normalized vNode:", vNode);
    return { type, props: normalizedProps, children: normalizedchildren };
  }

  return vNode;
}
