import { isBooleanTrue, isStringOrNum } from "./typeChecker";

export function normalizeVNode(vNode: any) {
  // 원시타입인 경우
  if (isStringOrNum(vNode)) return vNode.toString();
  if (!vNode || isBooleanTrue(vNode)) return "";

  // HTML 기본 element인 경우
  if (typeof vNode.type === "string")
    return {
      ...vNode,
      children: vNode.children.map(normalizeVNode),
    };

  // 커스텀 컴포넌트인 경우
  if (typeof vNode.type === "function") {
    const component = vNode.type;
    const props = vNode.props ?? {};
    const children = vNode.children.map(normalizeVNode);

    const refinedVNode = component({
      ...props,
      children,
    });

    return normalizeVNode(refinedVNode);
  }

  return null;
}
