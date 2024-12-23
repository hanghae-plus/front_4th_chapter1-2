type Props = {
  [key: string]: any;
  children?: VNode[];
};

type VNode = {
  type: string;
  props: Props;
};

export function createVNode(
  type: string,
  props: Props | null,
  ...children: any[]
): VNode {
  return {
    type,
    props: {
      ...props,
      children: children.flat(),
    },
  };
}
