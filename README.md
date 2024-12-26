[8팀 최준만] Chapter 1-2. 프레임워크 없이 SPA 만들기 Part 2

------------------24.12.25 02:14---------------------

basic 테스트 코드 통과
챕터 1-1 테스트 코드 통과

------------------24.12.26 03:00---------------------

advanced 테스트 코드 통과

---

# 구현과정

## 코드의 흐름

- 초기 렌더링 시 VNode를 생성하고, 이를 실제 DOM으로 변환하여 렌더링한다.
- 이후 상태가 변경되면 변경된 부분만 다시 렌더링한다.
  - diff 알고리즘을 통해 변경된 부분을 찾아내고, 이를 실제 DOM에 반영한다.
  - diff는 oldVNode와 newVNode를 비교하여 변경된 부분을 찾아내는 알고리즘이다.
- 전역 이벤트는 root 엘리먼트에 이벤트를 등록하여 위임을 통해 처리한다.

## 1. VNode(Virtual DOM) 구현

- VNode는 가상 DOM을 의미하며, 실제 DOM을 추상화한 객체이다.

### 1.1 createVNode

1.  가상 돔을 생성하기 위해 jsx로 작성된 코드를 esbuild에서 parsing하여 트리를 만들어주어 전달한다.
2.  해당 트리를 createVNode 함수를 통해 VNode로 변환한다.

```javascript
// recursiveFlatten : 재귀적으로 배열을 펼치는 함수
export function createVNode(type, props, ...children) {
  const flattenedChildren = recursiveFlatten(children, (val) => {
    return checkNullishExceptZero(val);
  });

  return { type, props, children: flattenedChildren };
}
```

### 1.2 normalizeVNode

- VNode를 정규화하는 함수
  - 각종 타입에 따라 VNode를 생성한다.
  - 함수형태의 컴포넌트의 경우 함수를 실행하여 VNode를 생성한다.
  - children의 경우에도 재귀적으로 normalizeVNode를 호출하여 VNode를 생성한다.

```javascript
// falsy 값은 빈 문자열로 변환
// 숫자, 문자 = > 문자열로 변환
// 함수 => 함수 실행 결과로 변환

// vNode : {type , props, children}
export function normalizeVNode(vNode) {
  if (typeof vNode === "boolean" || !checkNullishExceptZero(vNode)) {
    return "";
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }

  if (typeof vNode === "object") {
    if (typeof vNode.type === "function") {
      return normalizeVNode(
        vNode.type({ ...vNode.props, children: vNode.children }),
      );
    }

    return {
      type: vNode.type,
      props: vNode.props,
      children: vNode.children
        .map(normalizeVNode)
        .filter(checkNullishExceptZero),
    };
  }
}
```

### 1.3 createElement

- VNode를 실제 DOM으로 변환하는 함수
  - VNode의 타입에 따라 다른 처리를 한다.
  - VNode의 children을 재귀적으로 createElement를 호출하여 변환한다.

```javascript
export function createElement(vNode) {
  if (typeof vNode === "function" || typeof vNode?.type === "function") {
    throw new Error("NEED NORMALIZE");
  }
  if (typeof vNode === "boolean" || !checkNullishExceptZero(vNode)) {
    return document.createTextNode("");
  }

  // 문자열 또는 숫자인 경우 텍스트 노드로 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열로 들어온 경우 fragment로 처리
  if (Array.isArray(vNode)) {
    const frag = document.createDocumentFragment();
    vNode.forEach((node) => {
      frag.append(makeElement(node));
    });
    return frag;
  }

  // 그 외의 경우 element로 처리
  const el = makeElement(vNode);

  if (Array.isArray(vNode.children)) {
    vNode.children.forEach((child) => {
      el.appendChild(createElement(child));
    });
  }

  return el;
}

function makeElement(vNode) {
  const el = document.createElement(vNode.type);
  updateAttributes(el, vNode.props);
  return el;
}
```

- 속성 추가시에는 이벤트 속성, class속성, 그 외의 속성을 구분해야 한다.

```javascript
function updateAttributes($el, props) {
  for (const prop in props) {
    if (prop?.startsWith("on")) {
      // 이벤트 속성
      addEvent($el, prop.slice(2).toLowerCase(), props[prop]);
      continue;
    }
    if (prop === "class") {
      // class 속성
      $el.classList.add(props[prop]);
      continue;
    }
    $el.setAttribute(prop, props[prop]); // class 속성과 나머지 속성 동시 처리
  }
}
```

### 1.4 render

- 생성된 DOM element를 container element에 간단히 append 하여 렌더링한다.

```javascript
export function renderElement(vNode, container) {
  //생략
  container.appendChild(createElement(vNode));
}
```

### 1.5 setupEventListeners

- 이벤트 위임을 통해 전역 이벤트를 처리한다.
  - root 엘리먼트에 이벤트를 등록하여 위임을 통해 처리한다.

**먼저, setup을 해주기 이전에, createElement에서 이벤트 속성을 넣어주는 부분을 살펴보자(1.5.1~1.5.2)**

### 1.5.1 updateAttributes

- createElement 함수에서 이벤트 속성을 처리할 때, 이벤트 위임을 통해 전역 이벤트를 처리한다.

```javascript
// createElement 내부에서 이벤트를 전역 이벤트 관리 객체에 넣어주는 코드는 attr할당 부분에 있음
function updateAttributes($el, props) {
  for (const prop in props) {
    if (prop?.startsWith("on")) {
      addEvent($el, prop.slice(2).toLowerCase(), props[prop]); // 이벤트 전역 이벤트 관리 객체에 넣어주는 코드
      continue;
    }
    $el.setAttribute(replaceIfPropIsClass(prop), props[prop]);
  }
}
```

### 1.5.2 addEvent

- 위 코드에서 이벤트를 전역객체에 넣어주는 동작은 아래 addEvent 함수에서 처리한다.
  - 이벤트 타입에 따라 전역 이벤트 객체에 이벤트를 등록한다.
  - 이벤트 타입별 전역 이벤트 객체를 WeakMap으로 관리한다.
    - WeakMap은 key가 null이 되면 GC에 의해 메모리에서 해제된다.
    - WeakMap의 특성을 이용해, key를 DOM element로, value를 이벤트 핸들러로 관리한다.
      - 이벤트 핸들러는 DOM element에 대한 참조를 가지고 있으므로, DOM element가 GC에 의해 해제되면 이벤트 핸들러도 해제된다.

```javascript
globalEvents의 형태
{
  eventType1 : WeakMap {
    element1 : handler1,
    element2 : handler2,
    ...
  },
  eventType2 : WeakMap {
    element1 : handler1,
    element2 : handler2,
    ...
  },
  ...
}
```

```javascript
export function addEvent(element, eventType, handler) {
  if (!element || typeof handler !== "function") return;

  globalEvents[eventType] = globalEvents[eventType] || new WeakMap();
  globalEvents[eventType].set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  if (globalEvents[eventType].get(element) === handler) {
    globalEvents[eventType].delete(element);
  }
}
```

### 1.5.3 setupEventListeners

- 모두 렌더링된 후에, setupEventListeners를 통해 전역 이벤트를 등록한다.

```javascript
export function setupEventListeners(root) {
  for (const eventType in globalEvents) {
    root.removeEventListener(eventType, handleGlobalEvents);
    root.addEventListener(eventType, handleGlobalEvents);
  }
}

export function handleGlobalEvents(e) {
  if (globalEvents[e.type].has(e.target)) {
    globalEvents[e.type].get(e.target)(e);
  }
}
```

### 종결(?)

- 여기까지가 최초 렌더링을 위한 VNode 생성과 실제 DOM 변환, 이벤트 위임까지의 과정이다.
- 이후에는 상태 변경에 따른 렌더링을 위한 diff 알고리즘을 구현하고, 이를 통해 변경된 부분만 다시 렌더링하는 과정을 서술한다.

  - diff가 없이 전부 repaint하는 방식을 짤막하게 보여주며 마무리한다.
      <details>
        <summary>클릭해서 열기</summary>

    ```javascript
    export function renderElement(vNode, container) {
      // step0. 이벤트 초기화
      clearEvents();

      // step1. vNode 정규화
      if (!vNode) {
        return;
      }
      const normalizedVNode = normalizeVNode(vNode);

      // step2. 정규화된 vNode를 기반으로 DOM 생성 또는 업데이트
      const element = createElement(normalizedVNode);

      // step3. DOM 초기화 및 업데이트
      container.innerHTML = ""; // container 초기화
      container.append(element); // container에 DOM 추가

      // step4. 이벤트 핸들러 등록
      setupEventListeners(container);
    }
    ```

    </details>

---

## 2. diff 알고리즘 구현

- dom 업데이트를 위해 이전 vNode와 새로운 vNode를 비교하여 변경된 부분만 업데이트한다.
- 1.1~1.2 까지는 동일한 과정을 수행하고 이전 vNode가 존재하는 경우에만 diff 알고리즘을 수행한다.

### 2.0 최초 렌더링 후 oldVNode 저장

- 최초 렌더링 후 oldVNode를 저장한다.

```javascript
let oldVNode = null;
export function render(vNode, container) {
  // 생략 - 1.1~1.5
  oldVNode = vNode; // 최초 렌더링 후 oldVNode 저장
}
```

### 2.1 updateElement

- diff 알고리즘을 통해 변경된 부분만 업데이트한다.

### 2.1.1 oldVNode 존재 여부에 따른 분기 처리

- oldVNode가 존재하는 경우에만 diff 알고리즘을 수행한다.

```javascript
export function renderElement(vNode, container) {
  if (!vNode) {
    return;
  }
  // step1. vNode 정규화
  const newVNode = normalizeVNode(vNode);

  // step2. 정규화된 vNode를 기반으로 DOM 생성 또는 업데이트
  if (!oldVNode) {
    // step3. DOM 추가
    const element = createElement(newVNode);
    container.append(element); // 첫 렌더링 때만 container에 DOM 추가
  } else {
    // step3-diff. DOM 업데이트
    if (container.firstChild) {
      updateElement(container, newVNode, oldVNode);
    } else {
      const element = createElement(newVNode);
      container.append(element);
    }
  }
  //생략
}
```

### 2.1.2 updateElement

- diff 알고리즘을 통해 변경된 부분만 업데이트한다.
  - newNode와 oldNode를 비교하여 변경된 부분만 업데이트한다.
    - 기존 노드가 없는 경우 : appendChild
    - 업데이트 될 노드가 없는 경우 : removeChild
    - 타입이 다른 경우 : replaceChild
    - 텍스트 노드인 경우 : textContent 업데이트
    - 타입이 같은 경우 : props 및 children 비교

```javascript
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // newNode가 없는 경우 oldNode 제거
  if (oldNode && !newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 텍스트 노드인 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode !== newNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  // newNode가 oldNode와 다른 타입인 경우
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 타입이 같은 경우 props 및 children 비교
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // children이 없는 경우 return
  if (Math.max(newNode.children.length, oldNode.children.length) === 0) {
    return;
  }

  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
```

- maxLength : children 비교 시, 모든 자식요소를 비교하기 위해 maxLength를 구하고, 이를 기반으로 반복문을 수행한다.

### 2.1.3 updateAttributes

- props를 비교하여 변경된 부분만 업데이트한다.
  - oldProps를 기준으로 newProps를 비교하여 변경된 부분만 업데이트한다.
  - 신규로 추가된 props는 oldProps 업데이트 이후 추가한다.

```javascript
function updateAttributes(target, originNewProps, originOldProps) {
  const newPropsArr = originNewProps ? Object.entries(originNewProps) : [];
  const oldPropsArr = originOldProps ? Object.entries(originOldProps) : [];

  for (const [prop, value] of oldPropsArr) {
    let newPropValue = originNewProps[prop];

    // 이벤트 프로퍼티인 경우 이벤트 제거하고 시작
    if (isEventProp(prop)) {
      removeEvent(target, replaceEventProp(prop), value);
      newPropValue = originNewProps[replaceEventProp(prop)];
    }

    // 새로 들어올 프로퍼티 값이 없는 경우 제거
    if (newPropValue === undefined) {
      target.removeAttribute(prop);
      continue;
    }

    // 새로 들어올 프로퍼티 값이 있는 경우 업데이트
    if (value !== newPropValue) {
      if (isClass(prop)) {
        target.classList = newPropValue;
        continue;
      }
      if (isEventProp(prop)) {
        addEvent(target, replaceEventProp(prop), newPropValue);
        continue;
      }

      target.setAttribute(prop, newPropValue);
      continue;
    }

    // 새로 들어올 프로퍼티 값이 같은 경우
    if (value === originNewProps[prop]) {
      continue;
    }
  }

  for (const [prop, value] of newPropsArr) {
    // 이전 프로퍼티에 없는 프로퍼티인 경우 추가
    if (oldPropsArr[prop] === undefined) {
      if (isEventProp(prop)) {
        addEvent(target, replaceEventProp(prop), value);
        return;
      }
      if (isClass(prop)) {
        target.classList = value;
        continue;
      }
      target.setAttribute(prop, value);
    }
  }
}
```

### 2.2 render 와 eventListener

- 1의 과정과 동일하게 renderElement 함수를 통해 렌더링과 이벤트 위임 동작을 수행한다.

### 2.3 종결!

- 여기까지가 diff 알고리즘을 통해 변경된 부분만 업데이트하는 과정이다.

### 마치며

가상돔을 이용해 렌더링 과정을 구현하면서 하나의 문장으로 정리하자면,
**비교는 가상돔끼리, 표현은 실제 돔에!** 라고 할 수 있겠다.

가상돔끼리의 비교를 통해 실제 돔과 비교보다 훨씬 가볍게 변경된 부분을 포착하고 업데이트할 수 있었다.
선언적으로 저장된 함수를 실행시켜 가상돔을 만들고, 이를 실제 돔으로 변환하여 렌더링하는 과정을 통해 리액트의 동작 원리에 대한 이해를 높일 수 있었다.

여러분들도 한 번 직접 구현해보시면서 리액트의 동작 원리에 대해 깊게 이해해보시길 바랍니다.
