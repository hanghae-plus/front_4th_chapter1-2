import { addEvent, removeEvent } from "./eventManager.ts";
import { createElement } from "./createElement.ts";
import { VNode, VNodeProps } from "./type.ts";
import { getAttributeName, getEventType, isEvent } from "./helper.ts";
import { deepEqual } from "../utils/deepEqual.ts";

function updateAttributes(
  $el: HTMLElement,
  originNewProps: VNodeProps | null,
  originOldProps: VNodeProps | null,
) {
  const newPropsByName: Map<string, string | null> = new Map(
    Object.entries(originNewProps ?? {}),
  );

  for (const [k, v] of Object.entries(originOldProps ?? {})) {
    if (newPropsByName.get(k) === v) {
      newPropsByName.delete(k);
    } else if (!newPropsByName.get(k)) {
      newPropsByName.set(k, null);
    }
  }

  for (const [k, v] of newPropsByName) {
    if (!v) {
      if (isEvent(k, originOldProps[k])) {
        removeEvent($el, getEventType(k), originOldProps[k]);
        continue;
      }
      $el.removeAttribute(getAttributeName(k));
      continue;
    }

    if (isEvent(k, v)) {
      addEvent($el, getEventType(k), v);
      continue;
    }

    $el.setAttribute(getAttributeName(k), v);
  }
}

export function updateElement(
  parentElement: HTMLElement,
  newNode: VNode | null,
  oldNode: VNode | null,
  index: number = 0,
) {
  const $oldEl = parentElement.childNodes[index];

  if (oldNode && !newNode) {
    parentElement.removeChild($oldEl);

    const oldProps = oldNode.props;
    if (!oldProps) return;
  }

  if (!oldNode && newNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  if (!newNode || !oldNode) return;

  const { type: oldType, props: oldProps, children: oldChildren } = oldNode;
  const { type: newType, props: newProps, children: newChildren } = newNode;

  if (newType !== oldType) {
    return parentElement.replaceChild(createElement(newNode), $oldEl);
  }

  if (!newType && !oldType && newNode !== oldNode) {
    return parentElement.replaceChild(createElement(newNode), $oldEl);
  }

  if (!$oldEl) return;

  // 속성값이 동일한 경우 update 방지
  if (!deepEqual(newProps, oldProps)) {
    updateAttributes($oldEl, newProps, oldProps);
  }

  for (let i = 0; i < Math.max(newChildren?.length, oldChildren?.length); i++) {
    updateElement($oldEl, newChildren[i], oldChildren[i], i);
  }
}
