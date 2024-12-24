type JSXFunction = (props: Props) => VNode;

export type Props = Record<string, unknown>;
export type Type = keyof HTMLElementTagNameMap | JSXFunction;
export type Children = Array<VNode | string>;

export interface VNode {
  type: Type;
  props: Props;
  children: Children;
}

export interface NormalizedVNode {
  type: keyof HTMLElementTagNameMap;
  props: Props;
  children: Array<NormalizedVNode | string>;
}
