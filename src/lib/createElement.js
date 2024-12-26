export function updateAttributes($el, props) {
  if (!props) return;

  Object.keys(props).forEach((key) => {
    if (key.startsWith("on") && typeof props[key] === "function") {
      const eventType = key.slice(2).toLowerCase();
      $el.addEventListener(eventType, props[key]);
    } else if (key === "className") {
      $el.setAttribute("class", props[key]);
    } else if (key in $el) {
      $el[key] = props[key];
    } else {
      $el.setAttribute(key, props[key]);
    }
  });
}

export function createElement(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  const $el = document.createElement(vNode.type);

  updateAttributes($el, vNode.props);

  vNode.children.forEach((child) => {
    $el.appendChild(createElement(child));
  });

  return $el;
}
