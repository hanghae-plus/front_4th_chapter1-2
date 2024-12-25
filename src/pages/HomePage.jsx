/** @jsx createVNode */
import { createVNode } from "../lib";

import { Footer, Header, Navigation, Post, PostForm } from "../components";
import { globalStore } from "../stores";
import { userStorage } from "../storages/index.js";

/**
 * 심화과제
 * - 로그인한 사용자는 게시물을 추가할 수 있다.
 * - 로그인한 사용자는 게시물에 좋아요를 누를 수 있다.
 * - 로그인하지 않은 사용자가 게시물에 좋아요를 누를 경우, "로그인 후 이용해주세요"를 alert로 띄운다.
 */
export const HomePage = () => {
  const { posts } = globalStore.getState();
  const isLogin = globalStore.getState().loggedIn;

  // 좋아요 클릭 함수
  const handleClick = (id) => {
    console.log("clicked Data", id);
    if (!isLogin) {
      alert("로그인 후 이용해주세요");
    } else {
      const thisPost = globalStore.getState().posts.find((el) => el.id === id);
      const otherPosts = globalStore
        .getState()
        .posts.filter((el) => el.id !== id);
      if (thisPost) {
        if (thisPost.likeUsers.includes(globalStore.getState().currentUser)) {
          thisPost.likeUsers = thisPost.likeUsers.filter(
            (user) => user != globalStore.getState().currentUser,
          );
        } else {
          thisPost.likeUsers.push(globalStore.getState().currentUser);
        }
        globalStore.setState({ posts: [...otherPosts, thisPost] });
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {isLogin ? <PostForm /> : <div></div>}

          <div id="posts-container" className="space-y-4">
            {[...posts]
              .sort((a, b) => b.time - a.time)
              .map((props) => {
                return (
                  <Post
                    onClick={handleClick}
                    {...props}
                    activationLike={
                      !!props.likeUsers.includes(
                        globalStore.getState().currentUser,
                      )
                    }
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
