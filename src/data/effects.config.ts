import { createEffect } from "effector";
import { USER_SCOPE } from "../constants";
import { getUserData, getUserToken, wallPost } from "../vk-bridge/user";

export const getUserTokenFX = createEffect({
  handler: async () => {
    const { access_token, scope } = await getUserToken(USER_SCOPE);
    return { token: access_token, scope };
  },
  name: "getUserTokenFX",
});

export const getUserDataFX = createEffect(async () => {
  const user = await getUserData();
  return user;
});

export const wallPostFX = createEffect(
  async (payload: { token: string; userId: number }) => {
    await wallPost(payload);
  }
);
