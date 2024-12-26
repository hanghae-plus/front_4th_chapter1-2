/** @jsx createVNode */
import { createVNode } from "@lib";
import { globalStore } from "@stores";
import { Post, PostForm } from "@components";

export const PostContainer = () => {
  const { posts, loggedIn, currentUser } = globalStore.getState();
  const username = currentUser?.username;
  const { likePost } = globalStore.actions;

  const handleLikeButtonClick = (postId) => {
    try {
      if (!loggedIn) {
        alert("로그인 후 이용해주세요");
        return;
      }

      likePost({ id: postId, username });
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
      alert("좋아요 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <main className="p-4">
      {loggedIn && <PostForm />}
      <div id="posts-container" className="space-y-4">
        {[...posts]
          .sort((a, b) => b.time - a.time)
          .map((props) => {
            const isLiked = username
              ? props.likeUsers.includes(username)
              : false;

            return (
              <Post
                {...props}
                activationLike={isLiked}
                handleLikeButtonClick={handleLikeButtonClick}
              />
            );
          })}
      </div>
    </main>
  );
};
