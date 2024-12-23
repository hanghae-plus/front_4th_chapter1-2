/*
 * 가상돔을 실제 돔으로 변경하는 함수
 */

export function createElement(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 함수형 컴포넌트 처리 (에러 발생 시 파이프라인 재점검 할 것)
  if (typeof vNode.type === "function") {
    throw new Error("Component should be normalized before createElement");
  }

  // 배열(fragment) 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });
    return fragment;
  }

  const element = document.createElement(vNode.type);

  // 위에서 필터되지 않으면 배열 -> props 처리
  if (vNode.props) {
    Object.entries(vNode.props).forEach(([key, value]) => {
      if (key === "className") {
        element.setAttribute("class", value);
      } else if (key !== "key" && key !== "children") {
        element.setAttribute(key, value);
      }
    });
  }

  // 자식 노드 처리
  vNode.children.forEach((child) => {
    const childElement = createElement(child);
    element.appendChild(childElement);
  });

  return element;
}

// function updateAttributes($el, props) {}
