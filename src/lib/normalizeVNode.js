import { createVNode } from "./createVNode";

export function normalizeVNode(vNode) {
  // undefined / null / boolean인 경우, 빈 문자열 출력
  if (vNode == undefined || vNode == null || typeof vNode === "boolean") {
    return "";
  }

  // 문자열 또는 숫자일 경우, 문자열 출력
  if (typeof vNode == "string" || typeof vNode == "number") {
    return vNode.toString();
  }

  // 함수인 경우,
  if (typeof vNode == "object") {
    // console.log("1. vNode는", vNode);
    if (typeof vNode.type == "function") {
      const res = vNode.type({
        ...vNode.props,
        children: vNode.children,
      });
      // console.log("2. res는", res);
      return normalizeVNode(res);
    }
    if (!Array.isArray(vNode)) {
      return createVNode(
        vNode.type,
        vNode.props,
        ...vNode.children.map((child) => {
          // console.log("child는?", child);
          if (child != "") {
            return normalizeVNode(child);
          }
        }),
      );
    }
  }
  return vNode;
}
