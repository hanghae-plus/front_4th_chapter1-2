import { VNode } from "../types";

/**
 * Virtual Node를 정규화하는 함수
 * @param vNode - 정규화할 Virtual Node
 * @returns 정규화된 Virtual Node
 */
export function normalizeVNode(vNode: VNode | string) {
  if (typeof vNode === "string") {
    return {
      type: "text",
      props: {
        nodeValue: vNode,
        children: [],
      },
    };
  }

  return vNode;
}
