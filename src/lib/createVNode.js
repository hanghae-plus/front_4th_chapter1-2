/**
 * ------> createVNode <------
 * 파라미터 설명
 *    type      >> (엘리먼트의 유형)
 *    props     >>  속성 객체(예: { id: "myDiv", className: "container" })
 *    children  >> 엘리먼트가 포함하고 있는 자식 엘리먼트
 *              flat(Infinity)는 배열을 모든 평평하게 만든다.
 *              filter로 유효하지 않은 값(null, undefined, boolean)을 제거하여 최종 렌더링 데이터를 클린하게 유지.
 *
 */
import { isValidVnode } from "./validCheck";
export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(Infinity).filter(isValidVnode),
  };
}
