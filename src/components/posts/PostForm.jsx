/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/index.js";

export const PostForm = () => {
  let postContent = "";

  const { loggedIn } = globalStore.getState();

  if (!loggedIn) return null;

  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
        defaultValue={postContent}
        onChange={(e) => {
          postContent = e.target.value;
        }}
      />
      <span
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          const prev = globalStore.getState();

          globalStore.setState({
            ...prev,
            posts: [
              ...prev.posts,
              {
                id: prev.posts.length + 1,
                content: postContent,
                author: prev.currentUser.username,
                time: new Date().getTime(),
                likeUsers: [],
              },
            ],
          });
        }}
      >
        게시
      </span>
    </div>
  );
};
