import { createStore } from "effector";
import { getUserDataFX, getUserTokenFX } from "./effects.config";
import type { UserInfo } from "@vkontakte/vk-bridge";

type ConfigStore = {
  givenScope: string;
  token: string;
  user: UserInfo | null;
};

export const $config = createStore<ConfigStore>({
  givenScope: "",
  token: "",
  user: null,
});
$config.on(getUserTokenFX.doneData, (state, { scope, token }) => ({
  ...state,
  givenScope: scope,
  token,
}));

$config.on(getUserDataFX.doneData, (state, user) => ({
  ...state,
  user,
}));
