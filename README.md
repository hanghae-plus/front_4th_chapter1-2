항해 플러스 프론트엔드 2주차 과제.

# 프레임워크 없이 SPA 만들기(feat. Virtual DOM + 이벤트 위임)

<details>
<summary>💻 과제 테스트 결과</summary>
<img src="https://github.com/user-attachments/assets/d0229a2a-deeb-4f72-ac26-fdf25c6f48bd"/>
<img src="https://github.com/user-attachments/assets/0d4eaf5f-41e1-4d37-b66f-46bc92e0c9b4"/>

아직은 제법 재밌는 테스트 돌리기🎈

</details>

<details>
<summary>✅ 과제 체크포인트</summary>
### 1. 기본과제

#### 가상돔을 기반으로 렌더링하기

- [x] createVNode 함수를 이용하여 vNode를 만든다.
- [x] normalizeVNode 함수를 이용하여 vNode를 정규화한다.
- [x] createElement 함수를 이용하여 vNode를 실제 DOM으로 만든다.
- [x] 결과적으로, JSX를 실제 DOM으로 변환할 수 있도록 만들었다.

#### 이벤트 위임

- [x] 노드를 생성할 때 이벤트를 직접 등록하는게 아니라 이벤트 위임 방식으로 등록해야 한다
- [x] 동적으로 추가된 요소에도 이벤트가 정상적으로 작동해야 한다
- [x] 이벤트 핸들러가 제거되면 더 이상 호출되지 않아야 한다

### 2. 심화 과제

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

</details>

<br/>

## 🐢 회고를 시작하며

### 과제 목표

- 가상 DOM을 정의하고 사용할 수 있다.

- 가상 DOM을 이용하여 이벤트 관리를 최적화할 수 있다.
- diff 알고리즘을 이용하여 불필요한 렌더링을 최소화할 수 있다.

### 개인 학습 목표

- **기능 구현에 급급하지 말고 동작 원리를 이해하기★★**

  `Fail을 받을 지언정 동작 원리를 이해하자`라고 마음을 먹고 시작한 2주차였다. 이번주의 주제가 특히 나에게 늘 막연한 개념이었던 가상DOM을 직접 구현해보는 주차여서 더욱 그랬던 것도 있었다.

  그래서 최대한 제공받은 <a href="https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Virtual-DOM/">학습자료</a>를 꼼꼼하게 살피려고 했고, 코드를 짜면서도 계속 궁금증을 가지려고 노력했다. 원래 '그러려니'인간이었어서 쉽지만은 않았지만 덕분에 <b><u>Virtual DOM의 기본 구조, JSX가 Virtual DOM으로 변환하는 과정, Virtual DOM이 실제 DOM으로 어떻게 변환되는지</u></b>에 대해서 깊게 알아볼 수 있었다.

- **코드 작성 전 코드 설계에 충분한 시간을 가지기**

  지난 주에는 급하게 업무 쳐내던 버릇이 툭 튀어나와선 급한 마음에 무작정 코드부터 작성하기 시작했다. 코드를 충분히 생각하지 않고 작업을 시작하니 나의 생각이 들어가 있지 않았고, 나의 생각이 들어있지 않으니 다른 사람의 코드를 봐도 GPT의 힘을 빌려도 내 코드에 쉽게 적용할 수 없었다.

  그래서 2주차에는 어떤 파일에서 어떤 코드를 작성해야 할 지 미리 주석과 노트로 정리하고 작업에 들어갔다. 물론 전체의 흐름을 다 파악하기엔 아직 부족하지만 1주차에 2.5일정도 걸렸던 기본과제까지 작업 속도를 1.5일정도로 줄일 수 있었다.

  <br/>
  <br/>

## 👩‍💻 기술적 성장

### Diffing 알고리즘 (비교 알고리즘)

**Diffing 알고리즘**이란 두 가상 DOM 트리를 비교하여 차이점을 찾는 과정을 의미한다. 두 개의 트리를 비교할 때, React는 두 엘리먼트의 루트(root) 엘리먼트부터 비교를 시작한다. 그 이후는,

1. 엘리먼트의 타입이 다른 경우
2. DOM 엘리먼트의 타입이 같은 경우
3. 같은 타입의 컴포넌트 엘리먼트

등 루트 엘리먼트의 타입에 따라 달라진다.
노션에 적혀있는 구현 가이드가 어떻게 정해진건지 궁금했는데, <a href="https://ko.legacy.reactjs.org/docs/reconciliation.html#the-diffing-algorithm
">리액트 공식 문서</a>에 이미 나와있었다!

React를 이용할 땐 깊게 생각해보지 못했던 부분을 updateElement 함수를 직접 구현하며 아주 제대로 톺아볼 수 있었다. 특히 다른 조의 분들이 우리 조에 오셔서 같이 공부한 적이 있었는데 마침 Diffing 알고리즘에 대한 부분이었어서 같이 화면을 공유하며 이야기를 나눴던게 큰 도움이 되었다!

<br/>
<br/>

## 🧾 코드 품질

### 문제 상황.

1. 좋아요 버튼이 1번만 클릭 가능(토글 불가)
2. 1번 포스트에 좋아요 클릭 후 2번 포스트에 좋아요 클릭 시 1번 포스트의 좋아요 수 초기화

```jsx
const handleLikeToggle = () => {
    ...

    const { posts } = globalStore.getState();
    const username = currentUser.username;

    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        const isLiked = post.likeUsers.includes(username);
        return {
          ...post,
          likeUsers: isLiked
            ? post.likeUsers.filter((user) => user !== username)
            : [...post.likeUsers, username],
        };
      }
      return post;
    });

    globalStore.setState({ posts: updatedPosts });
}
```

### 원인 분석.

- **원인은 바로 구조 분해 할당(`const { posts } = globalStore.getState();`)으로 받아 온 posts!**

  - 구조 분해 할당 방식은 posts 배열을 변수로 추출하지만, **이 변수는 여전히 globalStore.getState()에서 반환된 객체의 참조를 가진다.**
  - 그러므로 `posts.map(…)`는 새 배열을 반환하지만, 구조 분해로 가져온 posts가 기존 상태와 분리되지 않고 참조를 유지할 수 있다. 따라서 변경 작업이 예상치 못한 방식으로 동작할 가능성이 있는 것!

### 해결 방법.

- 구조 분해 할당 대신 **전체 상태를 복사**하는 방식(`const state = globalStore.getState();`)으로 해결할 수 있었다.

  - 전체 상태를 복사하게 되면 상태 객체 전체를 복사하고, 필요한 필드를 참조할 수 있다. 따라서 `state.posts.map(...)`는 기존 상태를 복사한 새로운 배열을 생성하며, 다른 필드와의 연관성을 유지할수 있는 것!
  - `globalStore.setState({ ...state, posts: updatedPosts })`는 기존 상태를 유지하며, `posts`만 업데이트한다. 따라서 state의 다른 필드(`loggedIn`, `currentUser`)도 손실 없이 유지된다.

### 결론

`const { posts } = globalStore.getState();`를 사용하면 상태 병합 과정에서 다른 상태가 손실될 가능성이 있습니다. 전체 상태를 가져와(`const state = globalStore.getState();`) 필요한 필드를 참조하고 병합하는 방식이 안전하며, 예상치 못한 상태 손실 문제를 방지할 수 있습니다.

```jsx
const handleLikeToggle = () => {
  ***const state = globalStore.getState();*** // 전체 상태 가져오기
  const username = state.currentUser.username;

  const updatedPosts = ***state.posts.***map((post) => {
    if (post.id === id) {
      const isLiked = post.likeUsers.includes(username);
      return {
        ...post,
        likeUsers: isLiked
          ? post.likeUsers.filter((user) => user !== username)
          : [...post.likeUsers, username],
      };
    }
    return post;
  });

  globalStore.setState({ ***...state,*** posts: updatedPosts }); // 전체 상태 병합
};
```

  <br/>

### 주요 차이.

- `const { posts } = globalStore.getState();`는 posts만 독립적으로 가져오기 때문에 다른 상태와의 병합을 명확히 처리하지 않을 수 있다. 반면 `const state`를 사용하면 전체 상태를 명확히 병합할 수 있다.
  - `posts`만 독립적으로 가져오면, 업데이트된 `posts` 배열을 `globalStore.setState()`에 병합할 때 다른 필드(`loggedIn`, `currentUser` 등)가 손실될 수 있습니다.
- 두 접근 방식 모두 상태를 가져오지만, **참조 타입**(JavaScript의 객체 및 배열)과 **불변성 유지** 때문에 다른 결과를 나타낼 수 있다.
  - 구조 분해로 가져온 `posts`를 수정하면, 기존 상태 객체에 영향을 미칠 수 있다.
  - 이로 인해 상태가 의도치 않게 변경되거나, React와 같은 상태 관리 라이브러리에서 변경을 감지하지 못할 수 있다.

<br/>
<br/>

## 📊 학습 효과 분석

- 이벤트 위임에 버블링이 이용된다는 사실을 이번 과제를 하면서 깨달았다. 더듬더듬 과제를 진행하긴 했지만 아직 이벤트 위임이라든지, 이벤트 버블링과 캡처링을 활용한 효율적인 이벤트 처리에 대한 이해도가 낮은 것 같아 추가적인 학습이 필요하다.

  **1. 캡처링 (Capture Phase)**

  - 이벤트가 DOM 트리의 상위 요소에서 시작하여 하위 요소로 전파.
  - `addEventListener`의 세 번째 인수로 `true`를 전달하면 캡처링 단계에서 이벤트 핸들러가 실행.

  **2. 버블링 (Bubble Phase)**

  - 이벤트가 DOM 트리의 하위 요소에서 발생하여 상위 요소로 전파됩니다.
  - `addEventListener`의 세 번째 인수로 `false`(default)를 전달하면 버블링 단계에서 이벤트 핸들러가 실행.
  - **이벤트 위임 방식에서는 버블링 단계에서 상위 요소가 이벤트를 처리하도록 구현**

<br/>
<br/>

## ✍ 과제 피드백

- 너무 어려웠지만 그만큼 배움이 있었던 과제였습니다. <small style="text-decoration:line-through;">저.. 대학생 이후로 밤 처음 새봐요..</small> <br/>특히 막연한 개념이었던 Virtual DOM을 직접 구현하며 그 원리를 파악할 수 있었던게 좋았습니다. <br/>그리고 구현해야 할 파일들에 기재되어있던 개발 가이드 라인이 개인적으로는 과제의 방향성을 설계하는데에 큰 도움이 되었습니다. (`이런 케이스도 생각해야하는구나`를 생각할 수 있어 좋았습니다!)

- 다만, 다른 수강생분들께 여쭤봐도 updateElement.js와 EventManager.js에서 특히 어려움을 겪었다는 분들이 많았던 것 같습니다. 저의 경우에는 React에서 썼던 기능을 떠올리며 동작 원리를 최대한 이해 및 추론하려고 하는데, EventManager는 뭔가 추론하기가 힘들었습니다. 그래서 다음주 발제 시간에 있는 리뷰 시간의 해당 부분에 대한 설명이 기대됩니다.

<br/>
<br/>

## 🙋‍♀️ 리뷰 받고 싶은 내용

- eventManager.js의 setupEventListener 함수의 주석에서 "주의: 이벤트 캡처링을 사용하여 이벤트를 상위에서 하위로 전파"라고 작성해두셨는데, setupEventListener 함수는 '이벤트 위임'을 구현하기 위한 목적이라고 생각했습니다. 그렇게 하면 이벤트 버블링을 사용해야 하는게 아닌지 궁금합니다! 아니라면 혹시 제가 어디를 잘못 이해하고 있는지 구글링 키워드 힌트라도 부탁드립니다..!
