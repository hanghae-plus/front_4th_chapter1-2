/** @jsx createVNode */
import { createVNode } from "../../lib";
import { router } from "../../router";

interface LinkProps {
  onClick?: () => void;
  children?: unknown;
  href: string;
  className?: string;
}

export function Link({ onClick, children, ...props }: LinkProps) {
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
