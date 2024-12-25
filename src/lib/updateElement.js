import { createElement } from "./createElement";

function updateAttributes(target, originNewProps, originOldProps) {
  // 달라지거나 추가된 Props를 반영
  for (const [attr, value] of Object.entries(originNewProps)) {
    if (originOldProps[attr] === originNewProps[attr]) continue;
    target.setAttribute(attr, value);
  }

  // 없어진 props를 attribute에서 제거
  for (const attr of Object.keys(originOldProps)) {
    if (originNewProps[attr] !== undefined) continue;
    target.removeAttribute(attr);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. oldNode만 있는 경우 - oldNode를 newNode로 변경
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNode[index]);
  }

  // 2. newNode만 있는 경우 - newNode를 추가
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
  }

  // 3. oldNode와 newNode 모두 text 타입일 경우
  if (typeof oldNode === "string" && typeof newNode === "string") {
    // (1) 두 문자열이 같으면 리턴
    if (oldNode === newNode) return;
    // (2) 두 문자열이 다르면 새로운 텍스트 노드를 추가
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNode[index],
    );
  }

  // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
  // oldNode 삭제 후 newNode 추가
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNode[index],
    );
  }

  // 5. oldNode와 newNode의 태그 이름(type)이 같을 경우
  // newNode와 oldNode의 attribute를 비교하여 변경된 부분만 반영.
  // (1) oldNode의 attribute 중 newNode에 없는 것들 모두 삭제
  // (2) newNode의 attribute 중 oldNode에 없는 것들 모두 추가
  updateAttributes(parent.childNode[index], newNode.props, oldNode.props);

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNode[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
