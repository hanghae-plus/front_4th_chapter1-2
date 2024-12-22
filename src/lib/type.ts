export type Component = () => HTMLElement;

export type VNodeProps = {
  [key in AttributeName]: string;
};

export type VNode = {
  type: string;
  props: VNodeProps;
  children: unknown[];
};

export const isVNode = (target: any): target is VNode =>
  target && typeof target === "object" && Object.keys(target).includes("type");

export type AttributeName = keyof HTMLElement;
