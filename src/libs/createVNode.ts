import { VNode, VNodeProps } from "../types";

/**
 * Virtual DOM Node를 생성하는 함수
 * @param type - HTML 태그 이름
 * @param props - 노드의 속성들
 * @param children - 자식 노드들
 * @returns Virtual DOM Node
 */

export function createVNode(
  type: string | Function,
  props: VNodeProps | null,
  ...children: any[]
): VNode {
  const processChildren = (items: any[]): any[] => {
    return items.flat(Infinity).filter((child) => {
      if (child === null || child === undefined || child === false)
        return false;
      if (child === true) return false;
      return true;
    });
  };

  return {
    type,
    props,
    children: processChildren(children),
  };
}
