// import { addEvent, removeEvent } from "./eventManager";
// import { createElement } from "./createElement.js";

import { createElement } from "./createElement";
import { addEvent, removeEvent } from "./eventManager";

function updateAttributes(target, originNewProps, originOldProps) {
  const propKeyTypePropNameListMap = {
    remove: [],
    mutate: [],
    new: [],
  };

  for (let originOldPropsKey in originOldProps) {
    if (!(originOldPropsKey in originNewProps)) {
      propKeyTypePropNameListMap.remove.push(originOldPropsKey);
    } else if (
      originNewProps[originOldPropsKey] !== originOldProps[originOldPropsKey]
    ) {
      propKeyTypePropNameListMap.mutate.push(originOldPropsKey);
    }
  }

  for (let originNewPropsKey in originNewProps) {
    if (!(originNewPropsKey in originOldProps)) {
      propKeyTypePropNameListMap.new.push(originNewPropsKey);
    }
  }

  Object.entries(propKeyTypePropNameListMap).forEach(([type, propNameList]) => {
    if (type === "remove") {
      propNameList.forEach((propName) => {
        if (propName.startsWith("on")) {
          removeEvent(target, propName.split("on")[1]);
        }

        target.removeAttribute(propName);
      });
    } else {
      propNameList.forEach((propName) => {
        if (propName.startsWith("on")) {
          addEvent(target, propName.split("on")[1], originNewProps[propName]);

          return;
        }

        target.setAttribute(
          propName === "className" ? "class" : propName,
          originNewProps[propName],
        );
      });
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;

  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    const newElement = createElement(newNode);
    parentElement.appendChild(newElement);
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode != oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }

    return;
  }

  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    const oldElement = parentElement.childNodes[index];
    if (oldElement) {
      parentElement.replaceChild(newElement, parentElement.childNodes[index]);
      return;
    }
    parentElement.appendChild(newElement);
    return;
  }

  const element = parentElement.childNodes[index];
  const newChildren = newNode.children ?? [];
  const oldChildren = oldNode.children ?? [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  updateAttributes(element, newNode.props || {}, oldNode.props || {});

  for (let i = 0; i < maxLength; i++) {
    updateElement(element, newChildren[i], oldChildren[i], i);
  }
}
