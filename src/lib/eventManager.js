// const eventsMap = new Map();
//
// function addEvent(element, eventType, handler) {
//     const key = `${eventType}-${handler}`;
//     if (!eventsMap.has(key)) {
//         eventsMap.set(key, handler);
//     }
// }
//
// function removeEvent(element, eventType, handler) {
//     const key = `${eventType}-${handler}`;
//     if (eventsMap.has(key)) {
//         eventsMap.delete(key);
//     }
// }
//
// function setupEventListeners(root) {
//     eventsMap.forEach((handler, key) => {
//         const [eventType] = key.split('-');
//         root.addEventListener(eventType, handler);
//     });
// }
