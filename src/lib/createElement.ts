function updateAttributes($el, props) {
  if (props == null) {
    return;
  }

  for (let [key, value] of Object.entries(props)) {
    const isEvent = key.startsWith("on") && typeof value === "function";
    if (isEvent) {
      $el.addEventListener(key.slice(2).toLowerCase(), value);
      return;
    }

    if (key === "className") {
      $el.className = value;
      return;
    }

    $el.setAttribute(key, value);
  }
}

export function createElement(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  const { type, props, children } = vNode;
  const $el = document.createElement(type);

  updateAttributes($el, props);

  if (Array.isArray(children)) {
    children.forEach((child) => {
      const $child = createElement(child);
      $el.appendChild($child);
    });
  }

  return $el;
}
