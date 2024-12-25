import { VNode } from "../lib";

export const nodeStore = (() => {
  let currVNode: VNode | null = null;

  return {
    get: () => currVNode,
    set: (vNode: VNode) => {
      currVNode = vNode;
    },
  };
})();
