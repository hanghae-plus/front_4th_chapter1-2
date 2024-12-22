export function createVNode(type, props, ...children) {
  console.log("createVNode", props?.ref, props?.id);

  // props.ref로 이벤트 등록
  if (props?.ref && typeof props.ref === "function") {
    setTimeout(() => {
      const element = document.querySelector(`[id="${props.id}"]`);
      if (element) {
        props.ref(element.parentElement);
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
