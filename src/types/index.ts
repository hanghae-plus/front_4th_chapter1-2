export type VNodeProps = {
  [key: string]: any;
};

export type VNode = {
  type: string | Function;
  props: VNodeProps | null;
  children: any[];
};

export type VNodeChild = string | number | boolean | null | undefined | VNode;
