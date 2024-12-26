export type Component = () => HTMLElement;

export type VNodeProps = {
  [key in AttributeName]: string;
};

export type VNode = {
  type: string;
  props: VNodeProps;
  children: unknown[];
};

export type AttributeName = keyof HTMLElement;
