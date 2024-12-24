// typeof 연산자를 사용하여 노드 타입을 비교할 수 있습니다.
// 문자열 노드는 textContent로 처리합니다.
// 객체 노드는 tagName을 비교하여 처리합니다.
// 자식 노드 처리는 재귀적으로 이루어집니다.

import { addEvent, removeEvent } from "./eventManager.js";
import { createElement } from "./createElement.js";

// updateElement 함수는 Virtual DOM의 diff 알고리즘을 구현합니다
// 다음과 같은 순서로 처리하면 됩니다:
// 1. 기본 케이스 처리:
//    - oldNode가 없으면? -> 새로운 요소 생성
//    - newNode가 없으면? -> 기존 요소 제거
//
// 2. 노드 타입 비교:
//    - 타입이 다르면? (문자열 vs 객체, 또는 다른 태그) -> 완전히 교체
//
// 3. 노드 종류별 처리:
//    - 문자열이면? -> textContent 업데이트
//    - 객체면? -> 속성 업데이트 후 자식들 재귀적으로 처리
//
// 4. 자식 노드들 처리:
//    - 새로운 노드의 자식들과 기존 노드의 자식들을 비교하며 재귀적으로 업데이트
//    - 자식 수가 다르면? -> 더 긴 쪽 기준으로 처리
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  //   parentElement.replaceChild(createElement(newNode), oldNode);
}

// updateAttributes 함수는 DOM 요소의 속성을 업데이트합니다
// 1. 이전 속성들 중 새로운 속성에 없는 것들은 제거
// 2. 이벤트 리스너('on'으로 시작하는 속성)는 특별히 처리
// 3. 새로운 속성들을 추가하거나 업데이트
function updateAttributes(target, originNewProps, originOldProps) {}
