export function createVNode(type, props, ...children) {
  // props.ref로 이벤트 등록
  if (props?.ref && typeof props.ref === "function") {
    setTimeout(() => {
      const element = document.querySelector(`[id="${props.id}"]`);
      if (element) {
        // 이전에 등록된 클린업 함수가 있다면 실행
        if (element._cleanup) {
          element._cleanup();
        }

        // 새로운 ref 콜백 실행 및 반환된 클린업 함수 저장
        const cleanup = props.ref(element.parentElement);
        if (typeof cleanup === "function") {
          element._cleanup = cleanup;
        }
      }
    }, 0);
  }

  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((value) => value === 0 || Boolean(value)),
  };
}
