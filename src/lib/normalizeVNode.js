export function normalizeVNode(vNode) {
  // null, undefined, boolean 값은 빈 문자열로 변환되어야 한다
  if (vNode === null) {
    return "";
  }
  switch (typeof vNode) {
    case "boolean":
    case "undefined":
      return "";

    case "number":
    case "string":
      return `${vNode}`;
      
    case "function": // vNode가 함수일 경우 해당 함수를 호출해서 반환값을 얻되, 이 반환값이 또 다른 vNode일 가능성이 있으므로 재귀적으로 표준화.
      const result = vNode(); 
      return normalizeVNode(result); // 함수가 반환한 결과 normalize

    default:

      if(typeof vNode.type === "function"){ 

        const { type, props, children } = vNode;
        // const param = { props: vNode.props , children: vNode.children }

        const resultOfFunction = vNode.type({ ...props, children }); // 함수 호출
        // const resultOfFunction = vNode.type(param); // 이건 왜 안될까...
        vNode = normalizeVNode(resultOfFunction); // 결과 표준화

      }
      if (vNode.children && Array.isArray(vNode.children)) {
        vNode.children = vNode.children
          .map((child) => normalizeVNode(child))
          .filter((childN)=> !!childN)
      }
      return vNode;
  }
}
