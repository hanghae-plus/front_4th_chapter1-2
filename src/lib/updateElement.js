import { createElement } from "./createElement";
import { addEvent, removeEvent } from "./eventManager";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentElement = parentElement.childNodes[index];

  // 1. oldNode만 있는 경우 - oldNode를 newNode로 변경
  if (!newNode && oldNode) {
    return parentElement.removeChild(currentElement);
  }

  // 2. newNode만 있는 경우 - newNode를 추가
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 3. oldNode와 newNode 모두 text 타입일 경우
  if (typeof oldNode === "string" && typeof newNode === "string") {
    // 두 문자열이 다르면 새로운 텍스트 노드를 추가
    if (oldNode !== newNode) {
      currentElement.textContent = newNode;
    }
    return;
  }

  // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
  // oldNode 삭제 후 newNode 추가
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(createElement(newNode), currentElement);
  }

  // 5. oldNode와 newNode의 태그 이름(type)이 같을 경우
  // newNode와 oldNode의 attribute를 비교하여 변경된 부분만 반영.
  // (1) oldNode의 attribute 중 newNode에 없는 것들 모두 삭제
  // (2) newNode의 attribute 중 oldNode에 없는 것들 모두 추가
  updateAttributes(currentElement, newNode.props || {}, oldNode.props || {});

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  const maxLength = Math.max(
    newNode.children.length || 0,
    oldNode.children.length || 0,
  );

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}

function updateAttributes(target, newProps, oldProps) {
  // 1. 이전 속성들 처리 (제거)
  for (const attr of Object.keys(oldProps)) {
    if (attr.startsWith("on")) {
      if (!(attr in newProps)) {
        removeEvent(target, attr); // onClick 형태로 전달
      }
      continue;
    }

    // 일반 속성
    if (!(attr in newProps)) {
      if (attr === "className") {
        target.removeAttribute("class");
      } else {
        target.removeAttribute(attr);
      }
    }
  }

  // 2. 새로운 속성들 처리 (추가/업데이트)
  for (const [attr, value] of Object.entries(newProps)) {
    if (oldProps[attr] === value) continue;

    // 이벤트 핸들러
    if (attr.startsWith("on")) {
      addEvent(target, attr, value); // onClick 형태로 전달
      continue;
    }

    // className 처리
    if (attr === "className") {
      if (value) {
        target.setAttribute("class", value);
      } else {
        target.removeAttribute("class");
      }
      continue;
    }

    // 일반 속성
    if (value !== null && value !== undefined) {
      target.setAttribute(attr, value);
    }
  }
}
