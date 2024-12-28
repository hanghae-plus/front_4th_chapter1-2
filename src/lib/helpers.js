const blacklist = [null, undefined, true, false, ""];

export function isValidValue(value) {
  return !blacklist.includes(value);
}

export function isInvalidValue(value) {
  return blacklist.includes(value);
}
