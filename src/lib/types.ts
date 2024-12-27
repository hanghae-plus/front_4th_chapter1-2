export type VNodeType = string;
export type VNodeProps = Record<string, any>;
export type VNodeConstructor = (...args) => VNode;

// 1. vNode가 null, undefined 또는 boolean 타입일 경우 빈 문자열을 반환합니다.
// 2. vNode가 문자열 또는 숫자일 경우 문자열로 변환하여 반환합니다.
export type VNode =
  | {
      // 3. vNode의 타입이 함수일 경우 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화합니다.
      type: VNodeType | VNodeConstructor;
      props: VNodeProps;
      children: VNode[];
    }
  | null
  | undefined
  | boolean
  | string
  | number;

// 4. 그 외의 경우, vNode의 자식 요소들을 재귀적으로 표준화하고, null 또는 undefined 값을 필터링하여 반환합니다.
export type NormalizedVNode = {
  type: VNodeType;
  props: VNodeProps;
  children: Array<NormalizedVNode | string>;
};
