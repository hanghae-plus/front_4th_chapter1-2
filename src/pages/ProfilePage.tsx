/** @jsx createVNode */
import { createVNode } from "../lib";
import { Footer, Header, Navigation } from "../components";
import { globalStore } from "../stores";
import { userStorage } from "../storages";

function updateProfile(profile) {
  const user = { ...globalStore.getState().currentUser, ...profile };
  globalStore.setState({ currentUser: user });
  userStorage.set(user);
  alert("프로필이 업데이트되었습니다.");
}

export const ProfilePage = () => {
  const { loggedIn, currentUser } = globalStore.getState();
  const { username = "", email = "", bio = "" } = currentUser ?? {};

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedProfile = Object.fromEntries(formData);
    updateProfile(updatedProfile);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation loggedIn={loggedIn} />

        <main className="p-4">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">
              내 프로필
            </h2>
            <form id="profile-form" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  for="username"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  사용자 이름
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full p-2 border rounded"
                  value={username}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  for="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border rounded"
                  value={email}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  for="bio"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  자기소개
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  className="w-full p-2 border rounded"
                >
                  {bio}
                </textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded font-bold"
              >
                프로필 업데이트
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
