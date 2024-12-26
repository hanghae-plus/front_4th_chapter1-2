import * as _ from "lodash";

export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: _.flattenDeep(children).filter((item) => item || item === 0),
  };
}
