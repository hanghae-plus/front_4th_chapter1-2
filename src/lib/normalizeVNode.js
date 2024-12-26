export function normalizeVNode(vNode) {
  // 값이 없는 경우는 빈 스트링으로
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 스프링이거나 숫자인 경우는 string으로
  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }

  // 함수형으로 들어온다면. HomePage.jsx 같은 값은 함수이다. 함수인 경우는 type에 함수가 있음
  // 함수를 실행하는데, 내부 값에는 props와 children을 전달한다.
  if (typeof vNode.type === "function") {
    // console.log("함수로 들어온다는게 뭐야?", vNode)
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  // 일반 Object 타입인 경우
  return {
    ...vNode,
    children: vNode.children
      ?.map((child) => normalizeVNode(child))
      .filter(Boolean),
  };
}
