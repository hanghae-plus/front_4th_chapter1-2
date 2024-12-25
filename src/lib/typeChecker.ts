export const isBooleanTrue = (value: any) =>
  typeof value === "boolean" && value;

export const isNumberZero = (value: any) => value === 0;

export const isStringOrNum = (value: any): value is string | number =>
  typeof value === "string" || typeof value === "number";
