export function createElement(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  if (typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    // DocumentFragment 생성
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const $e1 = document.createElement(child.type);
      fragment.appendChild($e1);
    });
    return fragment;
  }

  const { type, props, children } = vNode;
  const $el = document.createElement(type);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key === "className") {
        $el.setAttribute("class", value);
      } else if (key === "id") {
        $el.id = value;
      } else if (typeof value === "function" && key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        $el.addEventListener(eventType, value);
      } else {
        $el.setAttribute(key, value);
      }
    });
  }

  const childrenArray = Array.isArray(children) ? children : [children];
  childrenArray
    .map((child) => createElement(child))
    .forEach((child) => $el.appendChild(child));

  return $el;
}

// function updateAttributes($el, props) {}
