import { isValidVNode } from "./validCheck";

export function normalizeVNode(vNode) {
  //  null, undefined, falsy 의 경우 빈 텍스트 return
  if (!isValidVNode(vNode)) {
    return "";
  }

  // 문자열, 숫자일 경우 string 노드로 return
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 함수형태 처리
  if (typeof vNode.type === "function") {
    const resolvedVNode = vNode.type(vNode.props || {});
    return normalizeVNode(resolvedVNode);
  }

  return {
    type: vNode.type,
    props: vNode.props || {},
    children: Array.isArray(vNode.children)
      ? vNode.children.filter(Boolean).map(normalizeVNode)
      : [],
  };
}
