import { createStore } from "../libs";

type PostFormState = { content: string };

type PostFormStateAction = Record<
  string,
  (...args: unknown[]) => PostFormState
>;

export const postFormStore = createStore<PostFormState, PostFormStateAction>(
  {
    content: "",
  },
  {
    reset: (...args) => {
      const state = args[0] as PostFormState;
      return { ...state, content: "" };
    },
  },
);
