import { isRenderableVNode, isTextVNode } from "./vNodeUtils";

export function normalizeVNode(vNode) {
  if (!isRenderableVNode(vNode)) {
    return "";
  }

  if (isTextVNode(vNode)) {
    return vNode.toString();
  }

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  return {
    type: vNode.type,
    props: vNode.props,
    children: Array.from(vNode.children).map(normalizeVNode),
  };
}
