import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement";
import { NormalizedVNode, VNode } from "./types";
import { normalizeVNode } from "./normalizeVNode";

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
  | { type: "CREATE"; payload: VNode }
  | { type: "REPLACE"; payload: VNode }
  | { type: "UPDATE_CHILDREN"; payload: NormalizedVNode }
  | { type: "NOOP" };

function calculateUpdateOperation(newNode: VNode, oldNode: VNode): Operation {
  if (!newNode && oldNode) {
    return { type: "REMOVE" };
  }

  if (newNode && !oldNode) {
    return { type: "CREATE", payload: newNode };
  }

  const nextNode = normalizeVNode(newNode);
  const prevNode = normalizeVNode(oldNode);

  const isStringNext = typeof nextNode === "string";
  const isStringPrev = typeof prevNode === "string";

  if (isStringNext && isStringPrev) {
    if (nextNode !== prevNode) {
      return { type: "REPLACE", payload: nextNode };
    }
    return { type: "NOOP" };
  }

  if (!isStringNext && !isStringPrev) {
    if (nextNode.type !== prevNode.type) {
      return { type: "REPLACE", payload: nextNode };
    }
    return { type: "UPDATE_CHILDREN", payload: nextNode };
  }

  return { type: "REPLACE", payload: newNode };
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
      const newDomNode = createElement(operation.payload);
      parent.appendChild(newDomNode);
      return;
    }

    case "REPLACE": {
      const newDomNode = createElement(operation.payload);
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
      const nextNode = operation.payload;

      const parentChild = parent.childNodes[index] as HTMLElement | null;
      if (!parentChild) return;

      if (typeof prevNode === "string" || typeof nextNode === "string") {
        return;
      }

      updateAttributes(parentChild, nextNode.props || {}, prevNode.props || {});

      const nnChildren = nextNode.children;
      const pnChildren = prevNode.children;
      for (let i = 0; i < max(nnChildren.length, pnChildren.length); i++) {
        updateElement(parentChild, nnChildren[i], pnChildren[i], i);
      }

      return;
    }

    case "NOOP":
    default:
      return;
  }
}
