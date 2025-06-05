import { createEffect } from "effector";
import { USER_SCOPE } from "../constants";
import { getUserToken } from "../vk-bridge/user";

export const getUserTokenFX = createEffect({
  handler: async () => {
    const { access_token, scope } = await getUserToken(USER_SCOPE);
    return { token: access_token, scope };
  },
  name: "getUserTokenFX",
});
