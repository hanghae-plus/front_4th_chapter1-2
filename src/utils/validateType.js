export const isFalsyTypeWithoutZero = (child) => {
  return (
    typeof child !== "number" &&
    ((typeof child === "string" && child === "") ||
      typeof child === "undefined" ||
      child === null ||
      child === false)
  );
};
