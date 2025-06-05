import { createStore } from "effector";
import { getUserTokenFX } from "./effects.config";

type ConfigStore = {
  givenScope: string;
  token: string;
};

export const $config = createStore<ConfigStore>({
  givenScope: "",
  token: "",
});
$config.on(getUserTokenFX.doneData, (state, { scope, token }) => ({
  ...state,
  givenScope: scope,
  token,
}));
