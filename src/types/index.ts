export type VNodeProps = {
  [key: string]: any;
  children?: VNode[];
};

export type VNode = {
  type: string;
  props: VNodeProps;
};
