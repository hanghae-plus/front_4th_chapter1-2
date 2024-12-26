export const nodeStore = (() => {
  const containerVNodeWeakMap = new WeakMap();

  return {
    getWeakMap: () => containerVNodeWeakMap,
    getVNode: (container) => containerVNodeWeakMap.get(container),
    setWeakMap: (container, vNode) => {
      containerVNodeWeakMap.set(container, vNode);
    },
  };
})();
