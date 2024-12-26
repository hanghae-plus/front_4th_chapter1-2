/** @jsx createVNode */
import { createVNode } from "../../lib";
import { router } from "../../router";
import { globalStore } from "../../stores";

const getNavItemClass = (path) => {
  const currentPath = window.location.pathname;
  return currentPath === path ? "text-blue-600 font-bold" : "text-gray-600";
};

function Link({ onClick, children, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    onClick?.();
    router.get().push(e.target.href.replace(window.location.origin, ""));
  };
  return (
    <a onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export const Navigation = () => {
  const { loggedIn } = globalStore.getState();
  const { logout } = globalStore.actions;
  return (
    <nav className="bg-white shadow-md p-2 sticky top-14">
      <ul className="flex justify-around">
        <li>
          <Link href="/" className={getNavItemClass("/")}>
            홈
          </Link>
        </li>
        {!loggedIn && (
          <li>
            <Link href="/login" className={getNavItemClass("/login")}>
              로그인
            </Link>
          </li>
        )}
        {loggedIn && (
          <li>
            <Link href="/profile" className={getNavItemClass("/profile")}>
              프로필
            </Link>
          </li>
        )}
        {loggedIn && (
          <li>
            <a
              href="#"
              id="logout"
              className="text-gray-600"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              로그아웃
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};
