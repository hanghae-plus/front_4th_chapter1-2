/** @jsx createVNode */
import { createVNode } from "@libs";

import { Footer, Header, Navigation } from "@components";
import { globalStore } from "@stores";
import { Post, PostForm } from "@features/posts";

/**
 * 심화과제
 * - 로그인한 사용자는 게시물을 추가할 수 있다.
 * - 로그인한 사용자는 게시물에 좋아요를 누를 수 있다.
 * - 로그인하지 않은 사용자가 게시물에 좋아요를 누를 경우, "로그인 후 이용해주세요"를 alert로 띄운다.
 */
export const HomePage = () => {
  const { posts = [], loggedIn, currentUser } = globalStore.getState();

  const handleCreatePost = (content: string) => {
    globalStore.setState((prev) => ({
      ...prev,
      posts: [
        {
          id: Date.now(),
          content,
          author: currentUser?.username ?? "Anonymous",
          time: Date.now(),
          likeUsers: [],
        },
        ...(prev.posts || []),
      ],
    }));
  };

  const handleLikeClick = (postId: number) => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const userName = currentUser?.username ?? "";

    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            likeUsers: post.likeUsers.includes(userName)
              ? post.likeUsers.filter((name: string) => name !== userName)
              : [...post.likeUsers, userName],
          }
        : post,
    );

    globalStore.setState((prevState) => ({
      ...prevState,
      posts: updatedPosts,
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {loggedIn && <PostForm onSubmit={handleCreatePost} />}
          <div id="posts-container" className="space-y-4">
            {posts
              .sort((a, b) => b.time - a.time)
              .map((post) => (
                <Post
                  {...post}
                  activationLike={post.likeUsers.includes(
                    currentUser?.username ?? "",
                  )}
                  onLikeClick={() => handleLikeClick(post.id)}
                />
              ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
