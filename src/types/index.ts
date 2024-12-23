export type VNodeProps = {
  [key: string]: any;
  children?: (VNode | string)[];
};

export type VNode = {
  type: string;
  props: VNodeProps;
};
