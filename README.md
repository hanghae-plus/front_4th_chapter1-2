## 과제 체크포인트

### 기본과제

#### 가상돔을 기반으로 렌더링하기

- [x] createVNode 함수를 이용하여 vNode를 만든다.
- [x] normalizeVNode 함수를 이용하여 vNode를 정규화한다.
- [x] createElement 함수를 이용하여 vNode를 실제 DOM으로 만든다.
- [x] 결과적으로, JSX를 실제 DOM으로 변환할 수 있도록 만들었다.

#### 이벤트 위임

- [x] 노드를 생성할 때 이벤트를 직접 등록하는게 아니라 이벤트 위임 방식으로 등록해야 한다
- [x] 동적으로 추가된 요소에도 이벤트가 정상적으로 작동해야 한다
- [x] 이벤트 핸들러가 제거되면 더 이상 호출되지 않아야 한다

### 심화 과제

#### 1) Diff 알고리즘 구현

- [x] 초기 렌더링이 올바르게 수행되어야 한다
- [x] diff 알고리즘을 통해 변경된 부분만 업데이트해야 한다
- [x] 새로운 요소를 추가하고 불필요한 요소를 제거해야 한다
- [x] 요소의 속성만 변경되었을 때 요소를 재사용해야 한다
- [x] 요소의 타입이 변경되었을 때 새로운 요소를 생성해야 한다

#### 2) 포스트 추가/좋아요 기능 구현

- [x] 비사용자는 포스트 작성 폼이 보이지 않는다
- [x] 비사용자는 포스트에 좋아요를 클릭할 경우, 경고 메세지가 발생한다.
- [x] 사용자는 포스트 작성 폼이 보인다.
- [x] 사용자는 포스트를 추가할 수 있다.
- [x] 사용자는 포스트에 좋아요를 클릭할 경우, 좋아요가 토글된다.

## 과제 셀프회고

<!-- 과제에 대한 회고를 작성해주세요 -->

처음에는 가상돔이 무엇인지, 어떻게 동작하는지 이해하는 것에만 시간이 많이 걸렸다. 특히, 이벤트 위임과 업데이트 로직을 구현하며 정말 많은 시행착오를 겪었지만, 이 과정에서 100퍼센트는 아니고 60퍼센트정도 이해한 것 같다. 가상돔의 본질적 개념을 이해할 수 있었고, 실제 장단점을 파악할 수 있었다.

### 기술적 성장

<!-- 예시
- 새로 학습한 개념
- 기존 지식의 재발견/심화
- 구현 과정에서의 기술적 도전과 해결
-->

- **normalizeVNode 함수 작성에서의 문제**

“normalizeVNode 함수에 문제가 있구나” 하고 알게된 것은 DOM 요소를 생성할 때, 타입이 함수이면 에러를 내야하는데 다시 정규화를 해주고 있었다. 결과적으로 올바르지 않은 DOM 요소가 생성되거나 예상치 못한 동작이 나타났다. 이러한 문제가 normalizeVNode 함수의 설계 결함에서 비롯되었음을 알게 되었다.

(같이 발견해준 팀원분들 너무 감사합니다… 7팀&10팀 최고!!!)

```jsx
... createElement.js

if (typeof vNode.type === "function") {
		// 기존 코드
		// const componentVNode = vNode.type({
    //  ...(vNode.props || {}),
    //  children: vNode.children,
    // });
    // return createElement(componentVNode);
    /*
        아래 코드를 주석하고 위 코드를 주석해제하면
        렌더링은 성공하지만, chapter1-2 테스트 코드의 컴포넌트 정규화는 통과하지 못함.
    */
    throw new Error("Unsupported component type");
}

...
```

normalizeVNode.js를 살펴보자.

가상 노드를 표준화된 형태로 변환하는 역할인데, 일관된 데이터 구조를 사용할 수 있도록 해야한다.

vNode의 타입이 함수일 경우 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화한다.
그 외의 경우, vNode의 자식 요소들을 재귀적으로 표준화하고, null 또는 undefined 값을 필터링하여 반환한다.

```jsx
   ... normalizeVNode.js

   if (typeof vNode.type === "function") {
    const componentVNode = vNode.type({
      ...(vNode.props || {}),
      children: vNode.children,
      // 기존 코드
      // children : normalizeVNode(vNode.children),
    });
    return normalizeVNode(componentVNode); // 반환된 VNode를 재귀적으로 처리
  }

  if (typeof vNode.type === "string") {
    return {
      type: vNode.type,
      props: vNode.props,
      children: vNode.children.map(normalizeVNode).filter(normalizeVNode),
      // 기존 코드
		  //children: vNode.children.flat(Infinity).filter(normalizeVNode),
    };
  }

  ...
```

1.  타입이 함수일 경우, 기존 코드에서는 컴포넌트가 children을 가공하려고 하면, 미리 정규화된 결과로 인해 의도한 로직이 깨질 수 있었다. 따라서, 컴포넌트가 반환한 결과를 재귀적으로 정규화하는 방법으로 수정하였다. (그래서 createElement.js 에서 한번 더 처리해주고 있었던 것 같다 ⇒ 테스트는 통과되었지만 당연히 렌더링이 제대로 되지 않았었다.)
2.  기존에는 중첩배열을 평탄화하고 정규화된 결과 중에 유효하지 않은 노드를 제거했다면,
    바뀐코드는 모든 자식 노드를 재귀적으로 정규화하고, 정규화된 결과 중 유효하지 않은 노드를 제거하였다.
    불필요한 평탄화 작업이라 children에 대한 처리가 강제적이었는데 수정된 코드는 필요한 시점에 정규화 및 필터링을 수행하도록 했다.

---

- **eventManager.js**

eventManger 함수가 가장 어려웠다. 이벤트 함수를 어딘가에 저장하고 삭제한 후 전부 가져와서 한 번에 root에 이벤트를 등록한다고 생각했는데 중복 등록 가능성이 있었다.

```jsx
... eventManager.js

  if (!rootEvent.has(eventType)) {
    rootEvent.set(eventType, null); // 이벤트 전파를 위임할 리스트
    setupEventListeners(document.body); // rootElement에 이벤트를 등록
  }

  ...
```

추가된 코드로 루트 리스너가 중복 등록되어 동일한 이벤트가 여러 번 호출되는 것을 방지하였다. 루트 요소에 한 번만 리스너를 등록하도록 보장하여 이벤트 위임 패턴의 최적화를 하였다.

---

- **포스트 추가할 때 한번 클릭했을 때는 정상 반영, 두 번째는 먹통..**
  이벤트 위임 문제였다. 이미 테스트 코드는 통과한 상태라 통과되면 끝이지라고 생각했던 곳에서 계속해서 오류가 나고 있었다. 다시 살펴보니 당연한 결과였다.

```jsx
...updateElement.js 중 updateAttribute 함수
  for (const [key, value] of Object.entries(originOldProps)) {
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase(); // "onClick" -> "click"
      // 새로운 props에 같은 이벤트가 없거나 다른 핸들러인 경우에만 제거
      if (!originNewProps[key] || originNewProps[key] !== value) {
        removeEvent(target, eventType, value);
      }
    }
  }
  ...
```

기존에는 if문 없었다. 이런 멍청한 짓을 하다니 다른 핸들러인 경우에만 제거했어야했는데 그냥 모두를 다 제거해버렸던 것이었다.

### 코드 품질

<!-- 예시
- 특히 만족스러운 구현
- 리팩토링이 필요한 부분
- 코드 설계 관련 고민과 결정
-->

2주차의 코드 품질은 깔끔한 코드가 아닐지 몰라도 테스트를 통과했다는 사실에 너무 만족스럽다. 테스트코드를 하나씩 통과하려고 짠 코드이다보니 중복되는 조건문이 많았고 util로 사용했어도 괜찮지 않았을까 생각해보았다.

심화과제 중 포스트 기능을 구현하며 1주차에 했던 설계 관련 고민의 해결 실마리를 살짝 찾은 듯 했다. 다른 사람이 설계한 코드라도 관심사가 확실히 분리되어 있어 코드를 추가하기에, 확장하기에 불편함이 없었다. 이 부분을 참고하여 1주차의 리팩토링을 해보려한다.

### 학습 효과 분석

<!-- 예시
- 가장 큰 배움이 있었던 부분
- 추가 학습이 필요한 영역
- 실무 적용 가능성
-->

프레임워크를 사용하면 이런 개념을 알기 쉽지 않은데 직접 가상돔을 구현하며 브라우저 로딩 과정을 알 수 있었다. 개발을 독학한 입장으로 성능에 관하여 깊게 생각해볼 경험이 없었는데 어디서 가장 많이 성능을 잡아먹는지, 성능을 개선하는 방법이 무엇인지 알게되었다.

개념은 알아도 아직 코드로 구현하기에는 턱없이 부족한 것 같다. 특히, 이벤트 위임과 DOM 요소가 업데이트 됐을 때의 렌더링 과정에 대해 더 자세하게 디버깅하며 확인해보아야할 것 같다.

### 과제 피드백

<!-- 예시
- 과제에서 모호하거나 애매했던 부분
- 과제에서 좋았던 부분
-->

프레임워크를 사용하지 않고 오로지 javascript로만 가상돔을 구현해볼 수 있는 경험이 좋았다.

## 리뷰 받고 싶은 내용

- parentElement 존재 여부 체크와 같은 방어 로직들이 적절한 위치에 배치되어 있는지, 더 효율적인 처리 방법은 없는지 궁금합니다. 또한, null 체크가 적절한지, 혹시 위험부담은 없는지도 궁금합니다.

  ex1) 원래는 방어 로직 없이도 테스트는 통과했지만, 콘솔에 TypeError가 발생하여 다음과 같은 코드를 추가해 해결했습니다.

  ```jsx
  ...updateElement.js
    // node가 없는 경우 체크
    if (!parentElement) return;
  ...
  ```

  ex2) 아래 코드가 없어도 실행 시 자연스럽게 에러가 발생하여 테스트는 통과됩니다. 하지만 함수형 컴포넌트 처리 시 발생하는 에러를 명시적으로 표현하기 위해 추가했는데, 이런 방식이 안전한지 궁금합니다.

  ```jsx
  ... createElement.js
  // 4. 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
      throw new Error("Unsupported component type");
  }
  ```

  > parentElement 존재 여부 체크와 같은 방어 로직들이 적절한 위치에 배치되어 있는지, 더 효율적인 처리 방법은 없는지 궁금합니다. 또한, null 체크가 적절한지, 혹시 위험부담은 없는지도 궁금합니다.

현재 방어로직은 적절한 위치에 있습니다. 함수형 컴포넌트에 대한 명시적인 에러 처리도 디버깅과 코드 유지보수 측면에서 좋은 접근 방식입니다. 다만 더 구체적인 에러 메시지를 제공하면 좋을 것 같아요!

  > 과정을 진행하시면서 여러 시행착오를 같이 적어주신 부분들도 보기 좋았는데요. 말씀해주신대로 테스트 코드를 통과시키기 위한(일종의 TDD를 진행해주셨는데) TDD의 마지막 단계는 늘 테스트 통과 후 리팩토링이기 때문에 적절한 코드 분리 및 정리를 잘 진행해주시면 좋을 것 같아요! 고생하셨습니다~

<!--
피드백 받고 싶은 내용을 구체적으로 남겨주세요
모호한 요청은 피드백을 남기기 어렵습니다.

참고링크: https://chatgpt.com/share/675b6129-515c-8001-ba72-39d0fa4c7b62

모호한 요청의 예시)
- 코드 스타일에 대한 피드백 부탁드립니다.
- 코드 구조에 대한 피드백 부탁드립니다.
- 개념적인 오류에 대한 피드백 부탁드립니다.
- 추가 구현이 필요한 부분에 대한 피드백 부탁드립니다.

구체적인 요청의 예시)
- 현재 함수와 변수명을 보면 직관성이 떨어지는 것 같습니다. 함수와 변수를 더 명확하게 이름 지을 수 있는 방법에 대해 조언해주실 수 있나요?
- 현재 파일 단위로 코드가 분리되어 있지만, 모듈화나 계층화가 부족한 것 같습니다. 어떤 기준으로 클래스를 분리하거나 모듈화를 진행하면 유지보수에 도움이 될까요?
- MVC 패턴을 따르려고 했는데, 제가 구현한 구조가 MVC 원칙에 맞게 잘 구성되었는지 검토해주시고, 보완할 부분을 제안해주실 수 있을까요?
- 컴포넌트 간의 의존성이 높아져서 테스트하기 어려운 상황입니다. 의존성을 낮추고 테스트 가능성을 높이는 구조 개선 방안이 있을까요?
-->
