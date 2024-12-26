import { isValidVNode, isString, isNumber } from "./validCheck";

export function normalizeVNode(vNode) {
  //  null, undefined, falsy 의 경우 빈 텍스트 return
  if (!isValidVNode(vNode)) {
    return "";
  }

  // 문자열, 숫자일 경우 string 노드로 return
  if (isString(vNode) || isNumber(vNode)) {
    return String(vNode);
  }

  // 함수형 VNode 처리
  if (typeof vNode.type === "function") {
    const processedVNode = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });
    return normalizeVNode(processedVNode);
  }

  // children(자식요소들) 필터링
  if (Array.isArray(vNode.children)) {
    vNode.children = vNode.children
      .map(normalizeVNode) // children을 재귀적으로 정규화
      .filter((child) => isValidVNode(child) && child !== ""); // 유효한 children을 필터링
  }

  return vNode;
}
