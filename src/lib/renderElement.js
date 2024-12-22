import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedNode = normalizeVNode(vNode);
  // const createdElementNode = createElement(normalizedNode);
  // console.log("4. renderElement 최종 결과:", normalizedNode);
  // console.log("5. container:", container);
}
