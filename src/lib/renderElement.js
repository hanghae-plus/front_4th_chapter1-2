import {
  setupEventListeners,
  createElement,
  normalizeVNode,
  updateElement,
} from "@/lib";

export function renderElement(vNode, container) {
  setupEventListeners(container);
  const normalizedNode = normalizeVNode(vNode);
  // console.log(normalizedNode);
  const createdElementNode = createElement(normalizedNode);
  // console.log(createdElementNode);
  // console.log("4. renderElement 최종 결과:", normalizedNode);
  // console.log("5. container:", container);
  container.innerHTML = "";
  container.appendChild(createdElementNode);
}
