import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/*
 * render함수는 popstate실행, 상태 변경 될 때마다 notify()를 호출, 실행하도록 createObserver의 subscribe()를 통해 등록이 돼있음
 * 따라서 render함수가 호출될 때마다 newNode와 oldNode를 비교 후 업데이트 해주어야 함
 * */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement || index < 0) return;

  // 노드 삭제
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 노드 새로 추가
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 노드 타입 변경
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 텍스트 노드 변경
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 재귀적으로 자식 노드 비교
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

function updateAttributes(target, originNewProps, originOldProps = {}) {
  // 이전 속성들 제거
  for (const attr in originOldProps) {
    if (attr === "children") continue;

    // 이벤트 리스너인 경우
    if (attr.startsWith("on")) {
      const eventType = attr.toLowerCase().substring(2);
      removeEvent(target, eventType, originOldProps[attr]);
      continue;
    }

    // 새로운 props에 없는 경우 속성 제거
    if (!(attr in originNewProps)) {
      target.removeAttribute(attr);
    }
  }

  // 새로운 속성 추가/업데이트
  for (const attr in originNewProps) {
    if (attr === "children") continue;

    // 이벤트 리스너인 경우
    if (attr.startsWith("on")) {
      const eventType = attr.toLowerCase().substring(2);
      addEvent(target, eventType, originNewProps[attr]);
      continue;
    }

    // 값이 변경된 경우만 업데이트
    if (originOldProps[attr] !== originNewProps[attr]) {
      if (attr === "className") {
        target.setAttribute("class", originNewProps[attr]);
      } else {
        target.setAttribute(attr, originNewProps[attr]);
      }
    }
  }
}
