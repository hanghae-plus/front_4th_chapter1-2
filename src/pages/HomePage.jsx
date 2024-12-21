/** @jsx createVNode */
import { createVNode } from "../lib";

import { Footer, Header, Navigation, Post, PostForm } from "../components";
import { globalStore } from "../stores";

/**
 * 심화과제
 * - 로그인한 사용자는 게시물을 추가할 수 있다.
 * - 로그인한 사용자는 게시물에 좋아요를 누를 수 있다.
 * - 로그인하지 않은 사용자가 게시물에 좋아요를 누를 경우, 경고 메세지가 표시된다.
 */
export const HomePage = () => {
  const { posts, loggedIn, currentUser } = globalStore.getState();

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {loggedIn && <PostForm onSubmit={globalStore.actions.addPost} />}
          <div id="posts-container" className="space-y-4">
            {[...posts]
              .sort((a, b) => b.time - a.time)
              .map((props) => {
                const handleLikeClick = () => {
                  try {
                    globalStore.actions.toggleLike(props.id);
                  } catch (e) {
                    alert("로그인 후 이용해주세요");
                  }
                };

                const activationLike =
                  loggedIn && props.likeUsers.includes(currentUser.username);

                return (
                  <Post
                    {...props}
                    activationLike={activationLike}
                    onLikeClick={handleLikeClick}
                  />
                );
              })}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
