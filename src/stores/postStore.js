import { createStore } from "../lib";
import { globalStore } from "./globalStore";

const initialState = {
  posts: globalStore.getState().posts,
};

const actions = {
  addPost: (state, newPost) => {
    globalStore.setState({ posts: [newPost, ...state.posts] });
  },
  toggleLike: (state, postIndex, userId) => {
    const updatedPosts = [...state.posts];
    const post = updatedPosts[postIndex];

    if (post.likeUsers.includes(userId)) {
      post.likeUsers = post.likeUsers.filter((id) => id !== userId);
      post.activationLike = false;
    } else {
      post.likeUsers.push(userId);
      post.activationLike = true;
    }

    return { posts: updatedPosts };
  },
};

export const postStore = createStore(initialState, actions);
