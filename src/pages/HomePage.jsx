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
  const { posts, loggedIn, currentUser } = globalStore.getState();
  const { username = "" } = currentUser ?? {};

  const handlePostLike = (e, post) => {
    e.preventDefault();
    if (!loggedIn) {
      window.alert("로그인 후 이용해주세요");
      return;
    }
    toggleLike(post);
  };

  const myLikePost = (post) => {
    if (post.likeUsers.some((name) => name === username)) {
      return true;
    } else {
      return false;
    }
  };

  const toggleLike = (post) => {
    const updatePosts = posts.map((data) => {
      if (data.id === post.id) {
        if (myLikePost(data)) {
          data.likeUsers = data.likeUsers.filter((name) => name !== username);
        } else {
          data.likeUsers.push(username);
        }
      }
      return data;
    });
    globalStore.setState({
      posts: updatePosts,
    });
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    console.log("게시!");
    const textareaValue = document.body.querySelector("#post-content").value;

    globalStore.setState({
      posts: [
        ...posts,
        {
          id: 231321,
          author: username,
          time: Date.now(),
          content: textareaValue,
          likeUsers: [],
        },
      ],
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {loggedIn ? <PostForm handlePostSubmit={handlePostSubmit} /> : ""}
          <div id="posts-container" className="space-y-4">
            {[...posts]
              .sort((a, b) => b.time - a.time)
              .map((props) => {
                return (
                  <Post
                    {...props}
                    activationLike={myLikePost(props)}
                    onClick={(e) => handlePostLike(e, props)} // props를 전달
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
