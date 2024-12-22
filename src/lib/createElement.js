// import { addEvent } from "./eventManager";

import { isString } from "../utils/isString";
import { isValid } from "../utils/isValid";

export function createElement(vNode) {
  if (!isValid(vNode)) {
    return document.createTextNode("");
  }
  if (isString(vNode)) {
    return document.createTextNode(vNode);
  }
}

// function updateAttributes($el, props) {}
