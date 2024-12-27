import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement";
import { NormalizedVNode, VNode } from "./types";
import { normalizeVNode } from "./normalizeVNode";
import { deepEqual } from "../utils/deepEqual";

const max = Math.max;

export function updateAttributes(
  target: HTMLElement | null | undefined,
  originNewProps: Record<string, any>,
  originOldProps: Record<string, any>,
) {
  const propsNext = { ...originNewProps };
  const propsPrev = { ...originOldProps };

  const allKeys = new Set([
    ...Object.keys(propsNext),
    ...Object.keys(propsPrev),
  ]);

  allKeys.forEach((key) => {
    if (key.startsWith("on")) {
      updateEventListener(target, key, propsNext, propsPrev);
    } else {
      updateDomAttribute(target, key, propsNext, propsPrev);
    }
  });
}

function updateEventListener(
  target: HTMLElement | null | undefined,
  key: string,
  propsNext: Record<string, any>,
  propsPrev: Record<string, any>,
) {
  const evtType = key.toLowerCase().substring(2);
  const handlerNext = propsNext[key];
  const handlerPrev = propsPrev[key];

  if (handlerPrev && (!handlerNext || handlerNext !== handlerPrev)) {
    removeEvent(target, evtType, handlerPrev);
  }

  if (handlerNext && (!handlerPrev || handlerNext !== handlerPrev)) {
    addEvent(target, evtType, handlerNext);
  }
}

function updateDomAttribute(
  target: HTMLElement | null | undefined,
  key: string,
  newProps: Record<string, any>,
  oldProps: Record<string, any>,
) {
  const valueNext = newProps[key];
  const valuePrev = oldProps[key];

  if (key.toLowerCase() === "classname") {
    if (valueNext == null) {
      target?.removeAttribute("class");
    } else if (valueNext !== valuePrev) {
      target?.setAttribute("class", valueNext);
    }
    return;
  }

  if (valueNext == null) {
    target?.removeAttribute(key);
  } else if (valueNext !== valuePrev) {
    target?.setAttribute(key, valueNext);
  }
}

type Operation =
  | { type: "REMOVE" }
  | { type: "CREATE"; newNode: VNode }
  | { type: "REPLACE"; newNode: VNode }
  | { type: "UPDATE_CHILDREN"; newNode: NormalizedVNode | string }
  | { type: "NOOP" };

function calculateUpdateOperation(newNode: VNode, oldNode: VNode): Operation {
  if (!newNode && oldNode) {
    return { type: "REMOVE" };
  }

  if (newNode && !oldNode) {
    return { type: "CREATE", newNode: newNode };
  }

  const nextNode = normalizeVNode(newNode);
  const prevNode = normalizeVNode(oldNode);

  const isStringNext = typeof nextNode === "string";
  const isStringPrev = typeof prevNode === "string";

  if (isStringNext && isStringPrev) {
    if (nextNode !== prevNode) {
      return { type: "REPLACE", newNode: nextNode };
    }
    return { type: "NOOP" };
  }

  if (!isStringNext && !isStringPrev) {
    if (nextNode.type !== prevNode.type) {
      return { type: "REPLACE", newNode: nextNode };
    }
    return { type: "UPDATE_CHILDREN", newNode: nextNode };
  }

  return { type: "REPLACE", newNode: newNode };
}

export function updateElement(
  parent: Node,
  newNode: VNode,
  oldNode: VNode,
  index: number = 0,
): void {
  const operation = calculateUpdateOperation(newNode, oldNode);

  switch (operation.type) {
    case "REMOVE": {
      const targetChild = parent.childNodes[index];
      if (targetChild) {
        parent.removeChild(targetChild);
      }
      return;
    }

    case "CREATE": {
      const newDomNode = createElement(normalizeVNode(operation.newNode));
      // FIXME: 자식노드 배열의 돔 추가되는 방식을 좀 더 유연한 방식으로 추가할 수 있도록 고쳐야함
      if (
        "getAttribute" in newDomNode &&
        newDomNode.getAttribute?.("data-add-type") === "prepend"
      ) {
        (parent as HTMLElement).prepend(newDomNode);
      } else {
        parent.appendChild(newDomNode);
      }
      return;
    }

    case "REPLACE": {
      const newDomNode = createElement(normalizeVNode(operation.newNode));
      const prevDomNode = parent.childNodes[index];
      if (prevDomNode) {
        parent.replaceChild(newDomNode, prevDomNode);
      } else {
        parent.appendChild(newDomNode);
      }
      return;
    }

    case "UPDATE_CHILDREN": {
      const prevNode = normalizeVNode(oldNode);
      const nextNode = operation.newNode;

      const parentChild = parent.childNodes[index] as HTMLElement | null;
      if (!parentChild) return;

      if (typeof prevNode === "string" || typeof nextNode === "string") {
        return;
      }

      updateAttributes(parentChild, nextNode.props || {}, prevNode.props || {});

      const nnChildren = nextNode.children;
      const pnChildren = prevNode.children;
      if (
        nnChildren.every(
          (c, i) => typeof c !== "string" && c.props?.key != null,
        ) &&
        pnChildren.every(
          (c, i) => typeof c !== "string" && c.props?.key != null,
        )
      ) {
        const keys = new Set<string>([
          ...nnChildren.map((c) => typeof c !== "string" && c.props?.key),
          ...pnChildren.map((p) => typeof p !== "string" && p.props?.key),
        ]);

        if (keys.size > 0) {
          console.log(`최적화된 리스트 업데이트: ${keys.size}개의 키`);
        }

        for (const key of keys) {
          const nnChild = nnChildren.find(
            (c) => typeof c !== "string" && c.props?.key === key,
          ) as NormalizedVNode | null;
          const pnChild = pnChildren.find(
            (c) => typeof c !== "string" && c.props?.key === key,
          ) as NormalizedVNode | null;

          if (
            nnChild == null ||
            pnChild == null ||
            nnChild.type !== pnChild.type
          ) {
            updateElement(parentChild, nnChild, pnChild);
            return;
          } else {
            if (
              nnChild != null &&
              typeof nnChild !== "boolean" &&
              typeof nnChild !== "number" &&
              typeof nnChild !== "string" &&
              "props" in nnChild &&
              nnChild?.props?.["data-component-name"] === "post"
            ) {
              console.log(
                "[최적화] 변경된 내용이 없는 Post 는 리렌더링을 스킵합니다. 😎",
              );
            }
          }

          if (
            nnChild != null &&
            pnChild != null &&
            nnChild.type === pnChild.type &&
            (!deepEqual(nnChild.props, pnChild.props) ||
              !deepEqual(nnChild.children, pnChild.children))
          ) {
            updateElement(parentChild, nnChild, pnChild);
            return;
          }
        }
      } else {
        for (let i = 0; i < max(nnChildren.length, pnChildren.length); i++) {
          const nnChild = nnChildren[i];
          if (
            nnChild != null &&
            typeof nnChild !== "boolean" &&
            typeof nnChild !== "number" &&
            typeof nnChild !== "string" &&
            "props" in nnChild &&
            nnChild?.props?.["data-component-name"] === "post"
          ) {
            console.log(
              "[최적화] key 가 쓰이지 않아 매번 새롭게 리렌더링합니다. 😢",
            );
          }

          updateElement(parentChild, nnChildren[i], pnChildren[i], i);
        }
      }

      return;
    }

    case "NOOP":
    default:
      return;
  }
}
