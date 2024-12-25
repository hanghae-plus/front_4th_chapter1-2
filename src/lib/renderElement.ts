import { NormalizedVNode } from "@/types/VNode";
import { createElement } from "@/lib/createElement";
import { updateElement } from "@/lib/updateElement";
import { setupEventListeners } from "@/lib/eventManager";
import { normalizeVNode } from "@/lib/normalizeVNode";

const oldDomStore = new WeakMap();

export function renderElement(vNode: NormalizedVNode, container: HTMLElement) {
  const newVDom = normalizeVNode(vNode);

  if (!oldDomStore.has(container)) {
    const newDOM = createElement(newVDom);
    container.appendChild(newDOM);

    setupEventListeners(container);

    oldDomStore.set(container, newVDom);
    return;
  }

  const oldVDom = oldDomStore.get(container);

  updateElement(container, newVDom, oldVDom);

  setupEventListeners(container);

  oldDomStore.set(container, newVDom);
}
