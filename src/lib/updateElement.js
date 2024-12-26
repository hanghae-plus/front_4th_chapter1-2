import { addEvent, removeEvent } from "./eventManager"; // 이벤트 관리
import { createElement } from "./createElement"; // 요소 생성

function updateAttributes(target, originNewProps, originOldProps) {
  //속성이 없는 경우 에러 방지
  originOldProps = originOldProps || {};
  originNewProps = originNewProps || {};

  // 이전 속성들 처리
  Object.keys(originOldProps).forEach((prop) => {
    if (prop === "children") return;

    if (prop.startsWith("on") && typeof originOldProps[prop] === "function") {
      const eventType = prop.substring(2).toLowerCase();
      removeEvent(target, eventType, originOldProps[prop]);
      return;
    }

    if (prop === "className") {
      if (!(prop in originNewProps)) {
        target.removeAttribute("class");
      }
      return;
    }

    if (!(prop in originNewProps)) {
      target.removeAttribute(prop);
    }
  });

  // 새로운 속성들 처리
  Object.keys(originNewProps).forEach((prop) => {
    if (prop === "children") return;

    if (prop.startsWith("on") && typeof originNewProps[prop] === "function") {
      const eventType = prop.substring(2).toLowerCase();
      addEvent(target, eventType, originNewProps[prop]);
      return;
    }

    if (prop === "className") {
      target.setAttribute("class", originNewProps[prop]);
      return;
    }

    if (originNewProps[prop] !== originOldProps[prop]) {
      target.setAttribute(prop, originNewProps[prop]);
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  //노드드 없을 경우
  if (!oldNode && !newNode) return;

  //노드 제거
  if (!newNode) {
    parentElement.removeChild(parentElement.children[index]);
    return;
  }

  //노드 추가
  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  //텍스트 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.replaceChild(
        document.createTextNode(newNode),
        parentElement.childNodes[index],
      );
    }
    return;
  }

  //노드 교체
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );

    return;
  }

  //같은 타입의 노드 속성 업데이트
  const element = parentElement.childNodes[index];
  updateAttributes(element, newNode.props, oldNode.props);

  //자식노드들 업데이트
  const maxLength = Math.max(
    newNode.children?.length || 0,
    oldNode.children?.length || 0,
  );

  for (let i = 0; i < maxLength; i++) {
    updateElement(element, newNode.children?.[i], oldNode.children?.[i], i);
  }
}
