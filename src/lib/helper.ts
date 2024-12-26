import { EventHandler } from "./eventManager";

const ATTR_NAME_MAP: { [key: string]: string } = {
  className: "class",
};

export const getAttributeName = (key: string): string =>
  ATTR_NAME_MAP[key] ?? key;

export const getEventType = (key: string): string =>
  key.replace("on", "").toLowerCase();

export const isEvent = (k: string, v: string | Object): v is EventHandler =>
  k.startsWith("on") && typeof v === "function";
