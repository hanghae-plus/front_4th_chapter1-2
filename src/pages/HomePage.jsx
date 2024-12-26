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

  const updateLike = (id) => {
    const { posts, loggedIn, currentUser } = globalStore.getState();

    if (!loggedIn) return alert("로그인 후 이용해주세요");
    const { username } = currentUser;

    const targetPost = posts.find((post) => post.id === id);
    let newLikeUsers = [...targetPost.likeUsers];

    if (newLikeUsers.includes(username)) {
      newLikeUsers = newLikeUsers.filter((user) => user !== username);
    } else {
      newLikeUsers = [...newLikeUsers, username];
    }

    const newPosts = posts.map((post) =>
      post.id === id ? { ...post, likeUsers: newLikeUsers } : post,
    );

    globalStore.setState({ ...globalStore.getState(), posts: newPosts });
  };

  const handleSubmitPostForm = (e) => {
    e.preventDefault();

    const { posts, currentUser } = globalStore.getState();

    const value = document.querySelector("#post-content").value;
    const newPost = {
      author: currentUser.username,
      content: value,
      id: posts.length + 1,
      likeUsers: [],
      time: Date.now(),
    };
    globalStore.setState({
      ...globalStore.getState(),
      posts: [...posts, newPost],
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {loggedIn && <PostForm onSubmit={handleSubmitPostForm} />}
          <div id="posts-container" className="space-y-4">
            {[...posts]
              .sort((a, b) => b.time - a.time)
              .map((props) => {
                const isLiked = props.likeUsers.includes(currentUser?.username);
                return (
                  <Post
                    {...props}
                    activationLike={isLiked}
                    onUpdateLike={updateLike}
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
