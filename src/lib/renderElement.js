import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let oldNode = null;

export function renderElement(vNode, container) {
  const nomalizedVNode = normalizeVNode(vNode);

  if (container.innerHTML === "") {
    container.append(createElement(nomalizedVNode));
  } else {
    updateElement(container, nomalizedVNode, oldNode);
  }

  oldNode = nomalizedVNode;
  setupEventListeners(container);
}
