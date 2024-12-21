import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  if (typeof vNode.type === "function") {
    const Component = vNode.type;
    const props = vNode.props;
    const children = vNode.children;
    return createElement(Component({ ...props, children }));
  }

  const element = document.createElement(vNode.type);

  if (vNode.props) {
    Object.keys(vNode.props).forEach((key) => {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        addEvent(element, eventType, vNode.props[key]);
        return;
      }
      element[key] = vNode.props[key];
    });
  }

  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      element.append(childElement);
    });
  }

  return element;
}

// function updateAttributes($el, props) {}
