/** @jsx createVNode */
import { createRouter, createVNode, normalizeVNode } from "./lib";
import { HomePage, LoginPage, ProfilePage } from "./pages";
import { globalStore } from "./stores";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { router } from "./router";
import { render } from "./render";

router.set(
  createRouter({
    "/": HomePage,
    "/login": () => {
      const { loggedIn } = globalStore.getState();
      if (loggedIn) {
        throw new ForbiddenError();
      }
      return <LoginPage />;
    },
    "/profile": () => {
      const { loggedIn } = globalStore.getState();
      if (!loggedIn) {
        throw new UnauthorizedError();
      }
      return <ProfilePage />;
    },
  }),
);

function main() {
  router.get().subscribe(render);
  globalStore.subscribe(render);

  render();
}

main();

const UnorderedList = ({ children, ...props }) => (
  <ul {...props}>{children}</ul>
);
const ListItem = ({ children, className, ...props }) => (
  <li {...props} className={`list-item ${className ?? ""}`}>
    - {children}
  </li>
);
const TestComponent = () => (
  <UnorderedList>
    <ListItem id="item-1">Item 1</ListItem>
    <ListItem id="item-2">Item 2</ListItem>
    <ListItem id="item-3" className="last-item">
      Item 3
    </ListItem>
  </UnorderedList>
);

normalizeVNode(<TestComponent />);
