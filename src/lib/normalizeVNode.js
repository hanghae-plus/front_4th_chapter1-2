export function normalizeVNode(vNode) {
  console.log(vNode);

  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode === "function") {
    if (vNode.children.length > 0) {
      vNode.children.forEach((children) => {
        return normalizeVNode(children);
      });
    }
  }

  return vNode;
}

// {
//   "type": "div",
//   "props": { "id": "app" },
//   "children": [
//     {
//       "type": "ul",
//       "props": null,
//       "children": [
//         {
//           "type": "li",
//           "props": null,
//           "children": [
//             {
//               "type": "input",
//               "props": { "type": "checkbox", "className": "toggle" },
//               "children": []
//             },
//             "todo list item 1",
//             {
//               "type": "button",
//               "props": { "className": "remove" },
//               "children": [ "삭제" ]
//             }
//           ]
//         },
//         {
//           "type": "li",
//           "props": { "className": "completed" },
//           "children": [
//             {
//               "type": "input",
//               "props": { "type": "checkbox", "className": "toggle", "checked": true },
//               "children": []
//             },
//             "todo list item 2",
//             {
//               "type": "button",
//               "props": { "className": "remove" },
//               "children": [ "삭제" ]
//             }
//           ]
//         }
//       ]
//     },
