export type VNodeProps = {
  [key: string]: any;
};

export type VNode = {
  type: string;
  props: VNodeProps;
  children: any[];
};
