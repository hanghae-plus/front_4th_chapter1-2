import { NormalizedVNode } from "@/types/VNode";
import { createElement } from "@/lib/createElement";
import { addAttributeByCase, removeAttributeByCase } from "@/utils/domUtils";
import { hasOwn } from "@/utils/objectUtils";

export function updateElement(
  $parentElement: HTMLElement,
  newNode: NormalizedVNode | string,
  oldNode: NormalizedVNode | string,
  index = 0,
) {
  if (!newNode && oldNode) {
    return $parentElement.children[index]?.remove();
  }

  if (newNode && !oldNode) {
    return $parentElement.appendChild(createElement(newNode));
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      return handleStringNode($parentElement, newNode, oldNode, index);
    }
  }

  if (isDifferentType(newNode, oldNode)) {
    return $parentElement.children[index]?.replaceWith(createElement(newNode));
  }

  // TODO: 타입 단언을 위해 넣었는데... 이래도 괜찮을까요...? 조금 더 우아한 방법을 찾지 못했습니다.
  if (!isNormalizedVNode(newNode) || !isNormalizedVNode(oldNode)) return;

  updateAttributes(
    $parentElement.children[index] as HTMLElement,
    newNode.props ?? {},
    oldNode.props ?? {},
  );

  const max = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < max; i++) {
    updateElement(
      $parentElement.children[index] as HTMLElement,
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}

function updateAttributes(
  target: HTMLElement,
  originNewProps: Record<string, any>,
  originOldProps: Record<string, any>,
) {
  for (const [key, value] of Object.entries(originNewProps)) {
    // 새 프롭에는 있고 이전 프롭에는 없는 경우 -> 추가
    if (!hasOwn(originOldProps, key)) {
      target.removeAttribute(key);
      continue;
    }
    // 둘 다 있는 경우 -> 값 변경
    if (hasOwn(originNewProps, key) && hasOwn(originOldProps, key)) {
      if (originOldProps[key] === value) continue;

      addAttributeByCase(target, key, value);
    }
  }
  // 새 프롬에는 없고 이전 프롭에는 있는 경우에 대한 일괄 제거 처리
  for (const key of Object.keys(originOldProps)) {
    if (!hasOwn(originNewProps, key) && key !== "children") {
      removeAttributeByCase(target, key);
    }
  }
}

function handleStringNode(
  $parentElement: HTMLElement,
  newNode: string,
  oldNode: string,
  index = 0,
) {
  if (newNode !== oldNode) {
    $parentElement.childNodes[index].textContent = newNode;
  }
}

function isDifferentType(
  newNode: NormalizedVNode | string,
  oldNode: NormalizedVNode | string,
) {
  if (isNormalizedVNode(newNode) !== isNormalizedVNode(oldNode)) return true;

  return (
    (newNode as NormalizedVNode).type !== (oldNode as NormalizedVNode).type
  );
}

function isNormalizedVNode(
  node: NormalizedVNode | string,
): node is NormalizedVNode {
  return typeof node !== "string";
}
