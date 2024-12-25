/** @jsx createVNode */
import { createVNode } from "../../lib";
import { router } from "../../router";
import { globalStore } from "../../stores";

const getNavItemClass = (path) => {
  const currentPath = window.location.pathname;
  return currentPath === path ? "text-blue-600 font-bold" : "text-gray-600";
};

const handleNavClick = (e) => {
  const { logout } = globalStore.actions;
  const link = e.target.closest("a");
  if (!link) return;

  e.preventDefault();

  if (link.id === "logout") {
    logout();
    return;
  }

  const href = link.href.replace(window.location.origin, "");
  router.get().push(href);
};

export const Navigation = () => {
  const { loggedIn } = globalStore.getState();
  return (
    <nav
      className="bg-white shadow-md p-2 sticky top-14"
      onClick={handleNavClick}
    >
      <ul className="flex justify-around">
        <li>
          <a href="/" className={getNavItemClass("/")}>
            홈
          </a>
        </li>
        {!loggedIn && (
          <li>
            <a href="/login" className={getNavItemClass("/login")}>
              로그인
            </a>
          </li>
        )}
        {loggedIn && (
          <li>
            <a href="/profile" className={getNavItemClass("/profile")}>
              프로필
            </a>
          </li>
        )}
        {loggedIn && (
          <li>
            <a href="#" id="logout" className="text-gray-600">
              로그아웃
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};
