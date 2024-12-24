import { ValidVNode } from "@/types/VNode";
import { createElement } from "@/lib/createElement";
import { addEvent, removeEvent } from "@/lib/eventManager";
import { HTMLEventName } from "@/types/event";

export function updateElement(
  parentElement: HTMLElement,
  newNode: ValidVNode,
  oldNode: ValidVNode,
  index = 0,
) {
  if (!newNode && oldNode) {
    return parentElement.children[index]?.remove();
  }

  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    return parentElement.children[index]?.replaceWith(createElement(newNode));
  }

  updateAttributes(
    parentElement.children[index] as HTMLElement,
    newNode.props ?? {},
    oldNode.props ?? {},
  );

  const max = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < max; i++) {
    updateElement(
      parentElement.children[index] as HTMLElement,
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}

function updateAttributes(
  target: HTMLElement,
  originNewProps: Record<string, any>,
  originOldProps: Record<string, any>,
) {
  for (const [key, value] of Object.entries(originNewProps)) {
    // 새 프롭에는 있고 이전 프롭에는 없는 경우 -> 추가
    if (!originOldProps[key]) {
      target.removeAttribute(key);
      continue;
    }
    // 둘 다 있는 경우 -> 값 변경
    if (
      originOldProps[key] !== undefined &&
      originOldProps[key] !== undefined
    ) {
      if (originOldProps[key] === value) continue;

      if (key.startsWith("on")) {
        const eventName = key.slice(2).toLowerCase();
        addEvent(target, eventName as HTMLEventName, value as () => void);
        continue;
      }

      if (key === "className") {
        target.className = value;
        continue;
      }

      if (key.startsWith("data-")) {
        const dataKey = key.slice(5);
        target.dataset[dataKey] = value;
        continue;
      }

      target.setAttribute(key, value);
    }
  }
  // 새 프롬에는 없고 이전 프롭에는 있는 경우에 대한 일괄 제거 처리
  for (const [key, value] of Object.entries(originOldProps)) {
    if (originNewProps[key] === undefined && key !== "children") {
      if (key.startsWith("on")) {
        const eventName = key.slice(2).toLowerCase();
        removeEvent(target, eventName as HTMLEventName);
        continue;
      }

      if (key === "className") {
        target.className = "";
        continue;
      }

      if (key.startsWith("data-")) {
        const dataKey = key.slice(5);
        target.dataset[dataKey] = undefined;
      }

      target.removeAttribute(key);
    }
  }
}
