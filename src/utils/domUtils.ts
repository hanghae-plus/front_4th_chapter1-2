import { Props } from "@/types/VNode";
import { HTMLEventName } from "@/types/event";
import { addEvent, removeEvent } from "@/lib/eventManager";

export function updateAttributes($el: HTMLElement, props: Props) {
  Object.entries(props ?? {}).forEach(([key, value]) => {
    addAttributeByCase($el, key, value);
  });
}

export function addAttributeByCase(
  $el: HTMLElement,
  key: string,
  value: unknown,
) {
  if (key === "children") return;
  console.log(key, value);

  if (key === "className") {
    $el.className = value as string;
    return;
  }

  if (key.startsWith("data-")) {
    const dataKey = key.slice(5);
    $el.dataset[dataKey] = value as string;
    return;
  }

  if (key.startsWith("on")) {
    const eventName = key.slice(2).toLowerCase() as HTMLEventName;
    addEvent($el, eventName, value as () => void);
    return;
  }

  $el.setAttribute(key, value as string);
}

export function removeAttributeByCase(target: HTMLElement, key: string) {
  if (key.startsWith("on")) {
    const eventName = key.slice(2).toLowerCase();
    removeEvent(target, eventName as HTMLEventName);
    return;
  }

  if (key === "className") {
    target.className = "";
    return;
  }

  if (key.startsWith("data-")) {
    const dataKey = key.slice(5);
    target.dataset[dataKey] = undefined;
  }

  target.removeAttribute(key);
}
