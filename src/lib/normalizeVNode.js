import { checkNullishExceptZero } from "../utils/commonUtils";

// falsy 값은 빈 문자열로 변환
// 숫자, 문자 = > 문자열로 변환
// 함수 => 함수 실행 결과로 변환

// vNode : {type , props, children}
export function normalizeVNode(vNode, depth = 0) {
  if (typeof vNode === "boolean" || !checkNullishExceptZero(vNode)) {
    return "";
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }

  if (typeof vNode === "object") {
    if (typeof vNode.type === "function") {
      return normalizeVNode(
        vNode.type({ props: vNode.props, children: vNode.children }),
        depth + 1,
      );
    }

    return {
      type: vNode.type,
      props: vNode.props ? combineProps(vNode.props) : null,
      children: vNode.children
        .map((child) => {
          // 자식 노드 정규화
          return normalizeVNode(child, depth + 1);
        })
        .filter((child) => {
          // 0을 제외한 falsy 값 제거
          return checkNullishExceptZero(child);
        }),
    };
  }
}

// 최하단까지(type이 string) 내려가서 props를 합치는 함수
// 이런식으로 하는게 아닌 것 같은데,, 뭔가 잘못된 것 같은데,,,
const combineProps = (props) => {
  const nestedProps = props?.props;
  delete props.props;
  let res = { ...props };
  if (!nestedProps) {
    return res;
  }
  Object.entries(nestedProps).forEach(([key, value]) => {
    res[key] = `${res[key] ?? ""}${value ?? ""}`;
    res[key] = res[key].trim();
  });
  return res;
};
