import { createStorage } from "../libs";
import User from "../features/user/user.entity";

export const userStorage = createStorage<User>("user");
