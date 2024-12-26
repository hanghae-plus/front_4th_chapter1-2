import { createElement, addEvent, removeEvent } from "@/lib";

function removeUnusedAttributes(target, newProps, oldProps) {
  Object.keys(oldProps).forEach((prop) => {
    const shouldRemoveProp = !(prop in newProps);
    const isEventPropCheck = prop.startsWith("on");
    const attributeName = prop === "className" ? "class" : prop;

    if (prop === "key" || prop === "children") return;
    if (!shouldRemoveProp) return;

    if (isEventPropCheck) {
      const eventType = prop.slice(2).toLowerCase();
      removeEvent(target, eventType, oldProps[prop]);
      return;
    }

    target.removeAttribute(attributeName);
  });
}

function updateNewAttributes(target, newProps, oldProps) {
  Object.keys(newProps).forEach((prop) => {
    const isEventPropCheck = prop.startsWith("on");
    const attributeName = prop === "className" ? "class" : prop;
    const newAttributeValue = newProps[prop];
    const oldAttributeValue = oldProps[prop];

    if (prop === "key" || prop === "children") return;

    if (isEventPropCheck) {
      const eventType = prop.slice(2).toLowerCase();
      if (oldAttributeValue) {
        removeEvent(target, eventType, oldAttributeValue);
      }
      if (newAttributeValue) {
        addEvent(target, eventType, newAttributeValue);
      }

      return;
    }

    if (newAttributeValue !== oldAttributeValue) {
      target.setAttribute(attributeName, newAttributeValue);
    }
  });
}

function updateAttributes(target, originNewProps, originOldProps) {
  const originNewPropsArgument = originNewProps || {};
  const originOldPropsArgument = originOldProps || {};

  // 이전 속성 중 새로운 속성에 없는 것들을 제거
  removeUnusedAttributes(
    target,
    originNewPropsArgument,
    originOldPropsArgument,
  );

  // 새로운 속성을 업데이트
  updateNewAttributes(target, originNewPropsArgument, originOldPropsArgument);
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 전체 순회를 위한 길이 계산
  const maxChildrenLength = Math.max(
    newNode?.children?.length || 0,
    oldNode?.children?.length || 0,
  );

  // 요소를 삭제해야하는 경우
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 요소를 추가해야하는 경우
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 노드 타입이 다른 경우 replace
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }
  // 단순 텍스트일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    parentElement.childNodes[index].textContent = newNode;
    return;
  }

  // 노드 타입이 같은 경우, props만 업데이트
  if (newNode.type === oldNode.type) {
    updateAttributes(
      parentElement.childNodes[index],
      newNode.props,
      oldNode.props,
    );
  }

  for (let childIndex = 0; childIndex < maxChildrenLength; childIndex++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[childIndex],
      oldNode.children[childIndex],
      childIndex,
    );
  }
}
