/** @jsx createVNode */
import { createVNode } from "../../lib/index.ts";
import { globalStore } from "../../stores/globalStore.ts";
import { PostData } from "../../stores/type.ts";
import { toTimeFormat } from "../../utils/index.ts";

interface PostProps {
  id: number;
  author: string;
  time: number;
  content: string;
  likeUsers: string[];
  activationLike: boolean;
}

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}: PostProps) => {
  const { getState, setState } = globalStore;
  const { currentUser, posts } = getState();

  const onClickLike = () => {
    if (!currentUser) {
      return window.alert("로그인 후 이용해주세요");
    }
    toggleLike(id, currentUser.username);
  };

  const toggleLike = (postId: number, username: string) => {
    const targetPost = posts.find((post) => post.id === postId);
    if (!targetPost) return;
    const prevLikeUsers = targetPost.likeUsers;
    const likeUsers = prevLikeUsers.includes(username)
      ? prevLikeUsers.filter((user) => user !== username)
      : [...prevLikeUsers, username];
    const newPost: PostData = { ...targetPost, likeUsers };
    updatePostData(newPost);
  };

  const updatePostData = (newPost: PostData) => {
    const { id } = newPost;

    const newPosts: PostData[] = posts.map((post) =>
      post.id === id ? newPost : post,
    );
    setState({ posts: newPosts });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center mb-2">
        <div>
          <div className="font-bold">{author}</div>
          <div className="text-gray-500 text-sm">{toTimeFormat(time)}</div>
        </div>
      </div>
      <p>{content}</p>
      <div className="mt-2 flex justify-between text-gray-500">
        <span
          onClick={onClickLike}
          className={`like-button cursor-pointer${activationLike ? " text-blue-500" : ""}`}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
