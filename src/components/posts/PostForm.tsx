/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore, PostData } from "../../stores";

export const PostForm = () => {
  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={addPost}
      >
        게시
      </button>
    </div>
  );
};

const addPost = () => {
  const { getState, setState } = globalStore;
  const { currentUser, posts } = getState();
  const content = (
    document.querySelector("#post-content") as HTMLTextAreaElement
  )?.value;

  if (!currentUser || !content) return;

  const newPosts: PostData[] = [
    ...posts,
    {
      id: posts.length + 1,
      author: currentUser?.username,
      content,
      time: new Date().getTime(),
      likeUsers: [],
    },
  ];

  setState({ posts: newPosts });
};
