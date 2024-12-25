import { isValidVNodeType } from "@/utils/jsxUtils";
import { isTypeIn } from "@/utils/typeCheckUtils";
import { NormalizedVNode, VNode } from "@/types/VNode";

export function normalizeVNode(vNode: VNode): NormalizedVNode | string {
  if (!isValidVNodeType(vNode)) return "";

  if (isTypeIn(vNode, ["string", "number"])) {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...(vNode.props ?? {}), children: vNode.children }),
    );
  }

  return {
    ...vNode,
    children: Array.isArray(vNode.children)
      ? vNode.children.map(normalizeVNode)
      : [],
  } as NormalizedVNode;
}
