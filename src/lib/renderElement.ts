import { ValidVNode } from "@/types/VNode";
import { createElement } from "@/lib/createElement";
import { updateElement } from "@/lib/updateElement";
import { removeAllEvent, setupEventListeners } from "@/lib/eventManager";
import { normalizeVNode } from "@/lib/normalizeVNode";

let workInProgress = null;

export function renderElement(vNode: ValidVNode, container: HTMLElement) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  const newVDom = normalizeVNode(vNode);
  if (!workInProgress) {
    container.appendChild(createElement(newVDom));

    setupEventListeners(container);

    workInProgress = newVDom;
    return;
  }

  removeAllEvent();

  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  updateElement(container, newVDom, workInProgress);

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);

  workInProgress = newVDom;
}
