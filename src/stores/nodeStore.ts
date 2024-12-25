import { VNode } from "../lib";

const nodeStore = () => {
  let currVNode: VNode | null = null;

  return {
    get: () => currVNode,
    set: (vNode: VNode) => {
      currVNode = vNode;
    },
  };
};

const getNodeStore = nodeStore();

export default getNodeStore;
