export const hooks = {
  value: null,
  get() {
    return this.value;
  },
  set(newValue) {
    this.value = newValue;
  },
};
