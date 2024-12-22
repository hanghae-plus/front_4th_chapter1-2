import { createStore } from "../lib";
import { globalStore } from "./globalStore";

const initialState = {
  posts: globalStore.getState().posts,
};

const actions = {
  addPost: (state, newPost) => {
    const currentPosts = globalStore.getState().posts;
    globalStore.setState({ posts: [newPost, ...currentPosts] });
    const newState = { posts: globalStore.getState().posts };
    return newState;
  },
  toggleLike: (state, postIndex, userId) => {
    console.log("???????????", postIndex, userId);
    const updatedPosts = [...state.posts];
    const post = updatedPosts[postIndex];
    console.log(post);
    if (post.likeUsers.includes(userId)) {
      post.likeUsers = post.likeUsers.filter((username) => username !== userId);
    } else {
      post.likeUsers.push(userId);
    }

    globalStore.setState({ posts: updatedPosts });
  },
};

export const postStore = createStore(initialState, actions);
