/**
 * 가상DOM 생성.
 *
 * @param type - 각 요소의 타입(HTML 태그나 사용자 정의 컴포넌트 이름)
 * @param props - 요소의 속성과 자식 요소
 * @param children - 하위 요소들의 배열 형태
 * @returns Virtual DOM 객체 형태 반환
 * @description
 * - 반환값은 { type, props, children } 형태의 객체여야 합니다.
 * - children은 평탄화(flat)되어야 하며, 0을 제외한 falsy 값은 필터링되어야 합니다.
 */
export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((child) => Boolean(child) || child === 0),
  };
}
