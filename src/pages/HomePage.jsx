/** @jsx createVNode */
import { createVNode } from "../lib";

import { Footer, Header, Navigation, Post, PostForm } from "../components";
import { globalStore } from "../stores";

/**
 * 심화과제
 * - 로그인한 사용자는 게시물을 추가할 수 있다.
 * - 로그인한 사용자는 게시물에 좋아요를 누를 수 있다.
 * - 로그인하지 않은 사용자가 게시물에 좋아요를 누를 경우, "로그인 후 이용해주세요"를 alert로 띄운다.
 */
export const HomePage = () => {
  const { posts, currentUser } = globalStore.getState();
  const { loggedIn } = globalStore.getState();

  const likeClickHandler = (id) => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        // 현재 사용자가 좋아요를 누른 경우, 배열에서 제거
        if (post.likeUsers.includes(currentUser.username)) {
          return {
            ...post,
            likeUsers: post.likeUsers.filter(
              (user) => user !== currentUser.username,
            ),
          };
        } else {
          // 현재 사용자가 좋아요를 누르지 않은 경우, 배열에 추가
          return {
            ...post,
            likeUsers: [...post.likeUsers, currentUser.username],
          };
        }
      }
      return post;
    });

    // 새로운 상태로 업데이트
    globalStore.setState({ posts: updatedPosts });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {loggedIn && <PostForm />}
          <div id="posts-container" className="space-y-4">
            {[...posts]
              .sort((a, b) => b.time - a.time)
              .map((props) => {
                return (
                  <Post
                    {...props}
                    activationLike={
                      currentUser
                        ? props.likeUsers.includes(currentUser.username)
                        : false
                    }
                    likeClickHandler={likeClickHandler}
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
