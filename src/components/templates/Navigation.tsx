/** @jsx createVNode */
import { createVNode } from "@libs";
import { router } from "@/router";
import { globalStore } from "@stores";

type NavProps = {
  className?: string;
  href?: string;
  onClick?: (e: MouseEvent) => void;
  children?: string | JSX.Element;
  [key: string]: any;
};

const getNavItemClass = (path: string) => {
  const currentPath = window.location.pathname;
  return currentPath === path ? "text-blue-600 font-bold" : "text-gray-600";
};

function Link({ onClick, children, ...props }: NavProps) {
  const handleClick = (e: MouseEvent): void => {
    e.preventDefault();
    onClick?.(e);
    const target = e.target as HTMLAnchorElement;
    router.get().push(target.href.replace(window.location.origin, ""));
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
              onClick={(e: MouseEvent): void => {
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
