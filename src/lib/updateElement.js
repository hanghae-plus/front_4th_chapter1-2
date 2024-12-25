import { replaceIfPropIsClass } from "../utils/commonUtils.js";
import { createElement } from "./createElement.js";
import { addEvent, removeEvent } from "./eventManager.js";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // newNode가 없는 경우 oldNode 제거
  if (oldNode && !newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 텍스트 노드인 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (parentElement.textContent !== newNode) {
      parentElement.textContent = newNode;
    }
    return;
  }

  // newNode가 oldNode와 다른 타입인 경우
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 타입이 같은 경우 props 및 children 비교
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props,
    oldNode.props,
  );

  // children이 없는 경우 return
  if (Math.max(newNode.children.length, oldNode.children.length) === 0) {
    return;
  }

  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}

/**
 *
 * @param {HTMLElement} target
 * @param {*} originNewProps
 * @param {*} originOldProps
 */
function updateAttributes(target, originNewProps, originOldProps) {
  const newPropsArr = originNewProps ? Object.entries(originNewProps) : [];
  const oldPropsArr = originOldProps ? Object.entries(originOldProps) : [];

  for (const [prop, value] of oldPropsArr) {
    console.log(prop);
    if (prop?.startsWith("on")) {
      removeEvent(target, prop.slice(2).toLowerCase(), value);
      continue;
    }

    // 새로운 props에 없는 경우 제거
    if (!originNewProps || !(prop in originNewProps)) {
      target.removeAttribute(prop);
    }
    // 값이 다른 경우 업데이트
    if (value !== originNewProps[prop]) {
      if (prop?.startsWith("on")) {
        addEvent(target, prop.slice(2).toLowerCase(), originNewProps[prop]);
        continue;
      }
      target.setAttribute(replaceIfPropIsClass(prop), originNewProps[prop]);
    }

    if (value === originNewProps[prop]) {
      if (prop?.startsWith("on")) {
        addEvent(target, prop.slice(2).toLowerCase(), originNewProps[prop]);
        continue;
      }
    }
  }
  // 새로운 props에 추가
  for (const [prop, value] of newPropsArr) {
    if (!originOldProps[prop]) {
      if (prop?.startsWith("on")) {
        addEvent(target, prop.slice(2).toLowerCase(), value);
        continue;
      }
      target.setAttribute(replaceIfPropIsClass(prop), value);
    }
  }
}
