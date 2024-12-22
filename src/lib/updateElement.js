import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";

export function updateElement(oldElement, newVNode) {
  // 타입이 다르면 전체 교체
  if (oldElement.nodeName.toLowerCase() !== newVNode.type?.toLowerCase()) {
    const newElement = createElement(newVNode);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    setupEventListeners(newElement.parentNode);
    return newElement;
  }

  // 텍스트 노드 업데이트
  if (typeof newVNode.children === "string") {
    if (oldElement.textContent !== newVNode.children) {
      oldElement.textContent = newVNode.children;
    }
    return oldElement;
  }

  // props 업데이트
  const oldProps = Array.from(oldElement.attributes).reduce((props, attr) => {
    props[attr.name] = attr.value;
    return props;
  }, {});

  // 이전 props 제거
  Object.keys(oldProps).forEach((name) => {
    if (!(name in newVNode.props)) {
      if (name.startsWith("on")) {
        // 이벤트 핸들러 제거
        const eventName = name.toLowerCase().slice(2); // 'onClick' -> 'click'
        oldElement.removeAttribute(name);
        oldElement[`_${eventName}Handler`] = null; // 저장된 핸들러 제거
      } else {
        oldElement.removeAttribute(name);
      }
    }
  });

  // 새로운 props 설정
  Object.entries(newVNode.props || {}).forEach(([name, value]) => {
    if (oldProps[name] !== value) {
      if (name.startsWith("on")) {
        // 이벤트 핸들러는 eventManager에서 처리하도록 속성만 설정
        oldElement.setAttribute(name.toLowerCase(), "");
      } else {
        oldElement.setAttribute(name, value);
      }
    }
  });

  // 자식 요소 재귀적 업데이트
  const oldChildren = Array.from(oldElement.childNodes);
  const newChildren = Array.isArray(newVNode.children) ? newVNode.children : [];

  for (let i = 0; i < Math.max(oldChildren.length, newChildren.length); i++) {
    if (!oldChildren[i] && newChildren[i]) {
      // 새로운 자식 추가
      oldElement.appendChild(createElement(newChildren[i]));
    } else if (!newChildren[i]) {
      // 더 이상 필요없는 자식 제거
      oldElement.removeChild(oldChildren[i]);
    } else {
      // 기존 자식 업데이트
      updateElement(oldChildren[i], newChildren[i]);
    }
  }

  // 이벤트 리스너 재설정

  return oldElement;
}
