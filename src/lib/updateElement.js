import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // update 되지 않아도 되는 경우
  if (originNewProps === originOldProps) return;

  const allAttrs = new Set([
    ...Object.keys(originNewProps),
    ...Object.keys(originOldProps),
  ]);

  allAttrs.forEach((attr) => {
    const isEvent = attr.startsWith("on");
    // newProps에 없고, oldProps에 있는거 제거
    if (!originNewProps[attr] && originOldProps[attr]) {
      if (isEvent) {
        const eventType = attr.slice(2).toLowerCase();
        removeEvent(target, eventType, originOldProps[attr]);
        return;
      }

      const _attr = attr === "className" ? "class" : attr;
      target.removeAttribute(_attr);
    }
    // newProps에 있고, oldProps에 없는거 등록
    if (originNewProps[attr] && !originOldProps[attr]) {
      if (isEvent) {
        const eventType = attr.slice(2).toLowerCase();
        addEvent(target, eventType, originNewProps[attr]);
        return;
      }

      target[attr] = originNewProps[attr];
    }
    // newProps에 있고, oldProps에 있을 때 값이 다르면 oldProps제거 후 newProps 등록
    if (originNewProps[attr] !== originOldProps[attr]) {
      if (isEvent) {
        const eventType = attr.slice(2).toLowerCase();
        removeEvent(target, eventType, originOldProps[attr]);
        addEvent(target, eventType, originNewProps[attr]);
        return;
      }

      target[attr] = originNewProps[attr];
    }
  });
}

export function updateElement(parentElement, newVNode, oldVNode, index = 0) {
  const targetElement = parentElement.children[index];

  // 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  if (!newVNode && oldVNode) {
    targetElement?.remove();
    return;
  }
  // 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  if (newVNode && !oldVNode) {
    parentElement.appendChild(createElement(newVNode));
    return;
  }
  // 텍스트 노드 업데이트
  if (typeof newVNode === "string" && typeof oldVNode === "string") {
    parentElement.textContent = newVNode;
    return;
  }
  // 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  if (newVNode.type !== oldVNode.type) {
    parentElement.replaceChild(createElement(newVNode), targetElement);
    return;
  }
  // 같은 타입의 노드 업데이트
  if (targetElement && newVNode.type === oldVNode.type) {
    updateAttributes(targetElement, newVNode.props ?? {}, oldVNode.props ?? {});

    const newVNodeChildren = newVNode.children ?? [];
    const oldVNodeChildren = oldVNode.children ?? [];

    const maxLength = Math.max(
      newVNodeChildren.length,
      oldVNodeChildren.length,
    );

    for (let i = 0; i < maxLength; i++) {
      updateElement(targetElement, newVNodeChildren[i], oldVNodeChildren[i], i);
    }
  }
}
