import { createStorage } from "@libs";
import { UserEntity } from "@features/user";

export const userStorage = createStorage<UserEntity>("user");
