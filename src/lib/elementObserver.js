export function createElementChildRemoveObserver(elements, helper) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.removedNodes.forEach((node) => {
          console.log(node, "removed");
          helper(node);
        });
      }
    });
  });

  for (const element of elements) {
    observer.observe(element, { childList: true, subtree: false });
  }

  return observer;
}
