import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/**
 * diffling 알고리즘을 이용해 속성을 업데이트
 * updateElement: 모든 태그를 비교해서 변경된 부분에 대해 수정/추가/삭제를 진행
 */
function updateAttributes(target, originNewProps, originOldProps) {
  // 매개변수가 undefined인 경우를 대비해 기본값을 설정한다
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  // 이전속성(oldProps)를 처리
  Object.keys(oldProps).forEach((prop) => {
    // 이벤트 핸들러인 경우: 'on'으로 시작하는 prop
    if (prop.startsWith("on")) {
      const eventType = prop.toLowerCase().substring(2); // ex) onClick -> click
      if (!newProps[prop]) {
        removeEvent(target, eventType, oldProps[prop]);
      }
    }
    // 일반 속성인 경우
    else if (!(prop in newProps)) {
      // className은 특별히 처리해서 class 속성으로 변환한다
      if (prop === "className") {
        target.removeAttribute("class");
      } else {
        target.removeAttribute(prop);
      }
    }
  });

  // 새로운 속성들(newProps)을 처리
  Object.keys(newProps).forEach((prop) => {
    // 값이 변경된 경우에만 업데이트한다
    if (oldProps[prop] !== newProps[prop]) {
      // 이벤트 핸들러인 경우
      if (prop.startsWith("on")) {
        const eventType = prop.toLowerCase().substring(2);

        // 이전 핸들러가 있었다면 먼저 제거한다
        if (oldProps[prop]) {
          removeEvent(target, eventType, oldProps[prop]);
        }
        // 새로운 핸들러를 추가한다
        addEvent(target, eventType, newProps[prop]);
      }
      // 일반 속성인 경우
      else {
        // className은 특별히 처리해서 class 속성으로 변환한다
        if (prop === "className") {
          target.setAttribute("class", newProps[prop]);
        } else {
          target.setAttribute(prop, newProps[prop]);
        }
      }
    }
  });
}

// 가상 DOM의 diffling 알고리즘의 핵심, DOM 트리 변경사항을 효율적으로 처리한다
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) {
    return;
  }

  // 1. oldNode만 있는 경우: 삭제
  if (oldNode && !newNode) {
    if (!parentElement.childNodes[index]) {
      return;
    }

    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 2. newNode만 있는 경우: 추가
  if (!oldNode && newNode) {
    return parentElement.appendChild(createElement(newNode)); // createElement를 이용해 새로운 DOM 노드를 생성하고 추가
  }

  // 4. 노드 타입이 다른 경우: 노드를 교체
  if (oldNode.type !== newNode.type) {
    return parentElement.replaceChild(
      createElement(newNode), // newNode를 이용해 DOM 생성
      parentElement.childNodes[index], // 교체할 노드
    );
  }

  // 3. oldNode, newNode 모두 텍스트 타입일 경우, 텍스트가 다를 때만 업데이트 한다
  if (typeof oldNode === "string" && typeof newNode === "string") {
    if (oldNode === newNode) {
      return;
    }

    // 텍스트 노드를 교체
    return parentElement.replaceChild(
      createElement(newNode), // 새로운 텍스트 노드 생성, cf. 텍스트는 일반노드와 다르고, 텍스트 내용을 효율적으로 관리하기 위한 DOM의 기본 메커니즘이다
      parentElement.childNodes[index], // 교체할 노드
    );
  }

  // 5. 노드 타입이 같은 경우: 속성만 업데이트하고 자식들은 재귀적으로 처리한다
  updateAttributes(
    parentElement.childNodes[index], // 노드 업데이트
    newNode.props || {}, // 새로운 속성
    oldNode.props || {}, // 이전 속성
  );

  // 6. 자식 노드들을 순회하면서 재귀적으로 처리한다
  const oldLength = oldNode.children?.length || 0;
  const newLength = newNode.children?.length || 0;
  const maxLength = Math.max(oldLength, newLength);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
