import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (
    typeof vNode === "boolean" ||
    typeof vNode === "undefined" ||
    vNode === null
  ) {
    return new Text("");
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return new Text(String(vNode));
  }
}

function updateAttributes($el, props) {}
