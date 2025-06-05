import { createEffect } from "effector";
import { getUserToken } from "../vk-bridge/user";

export const getUserTokenFX = createEffect({
  handler: async () => {
    const { access_token } = await getUserToken("friends,photos,wall,groups");
    return access_token;
  },
  name: "getUserTokenFX",
});
