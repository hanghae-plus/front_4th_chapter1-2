import {
  setupEventListeners,
  eventRegistry,
  eventDelegation,
  createElement,
  normalizeVNode,
  updateElement,
} from "@/lib";

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);

  const oldVNode = container._vNode || null;

  if (!oldVNode) {
    const newElement = createElement(normalizedVNode);
    container.appendChild(newElement);
  } else {
    updateElement(container, normalizedVNode, oldVNode);
  }

  container._vNode = normalizedVNode;

  const eventTypes = Object.keys(eventRegistry.get(container) || {});
  eventTypes.forEach((eventType) => {
    container.removeEventListener(eventType, eventDelegation);
  });

  setupEventListeners(container);
}
