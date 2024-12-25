import { checkNullishExceptZero } from "../utils/commonUtils";

// falsy 값은 빈 문자열로 변환
// 숫자, 문자 = > 문자열로 변환
// 함수 => 함수 실행 결과로 변환

// vNode : {type , props, children}
export function normalizeVNode(vNode) {
  if (typeof vNode === "boolean" || !checkNullishExceptZero(vNode)) {
    return "";
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }

  if (typeof vNode === "object") {
    if (typeof vNode.type === "function") {
      return normalizeVNode(
        vNode.type({ ...vNode.props, children: vNode.children }),
      );
    }

    return {
      type: vNode.type,
      props: vNode.props,
      children: vNode.children
        .map(normalizeVNode)
        .filter(checkNullishExceptZero),
    };
  }
}
