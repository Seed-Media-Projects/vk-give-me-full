import { type UserInfo } from "@vkontakte/vk-bridge";
import { vkBridge } from "./instance";
import { appId, isDev, vkApiV } from "../constants";
import { getSearchParams } from "../data/searchParams";

export const getUserData = () =>
  isDev
    ? Promise.resolve({
        id: getSearchParams().has("vk_user_id")
          ? Number(getSearchParams().get("vk_user_id"))
          : 11437372,
        bdate: "6.11",
        bdate_visibility: 2,
        city: {
          id: 1,
          title: "Москва",
        },
        country: {
          id: 1,
          title: "Россия",
        },
        timezone: 2,
        photo_200:
          "https://sun9-64.userapi.com/s/v1/ig2/ug5hg9CG07fq7-TKq6MF_92nks30PeqOuhZjBzvzYkxMY9xQq0GBfWArb8T5L2s9Sl_YbqeW4wxXM80esZYZMzDW.jpg?size=200x200&quality=96&crop=233,352,479,479&ava=1",
        photo_max_orig:
          "https://sun9-64.userapi.com/s/v1/ig2/RCcX7--E5DkIubVnGmHBWeTB_DJE2By3YUbbjEfP71WWiX_D8hVG410mrK7t9KMaT9DrAi2-m1wKNxPk-CjnkVUQ.jpg?size=400x400&quality=96&crop=233,352,479,479&ava=1",
        sex: 2,
        photo_100:
          "https://sun9-64.userapi.com/s/v1/ig2/nqDNvsAWj8qRejOkW_uQXEEHWsItDh4mvIv2sdqcozRtk57EYD3n1bUVH15uZ0WmPcvFR1ToYmMlRVkQ-UyfUUDZ.jpg?size=100x100&quality=96&crop=233,352,479,479&ava=1",
        first_name: "Константин" + Number(getSearchParams().get("vk_user_id")),
        last_name: "Михеев",
        can_access_closed: true,
        is_closed: false,
      } as UserInfo)
    : vkBridge.send("VKWebAppGetUserInfo");

export const getUserToken = (scope: string) =>
  vkBridge.send("VKWebAppGetAuthToken", {
    app_id: appId,
    scope,
  });

export const getUserFriends = (
  token: string
): Promise<{ response: { items: number[] } }> =>
  isDev
    ? Promise.resolve({ response: { items: [1, 2, 3, 4, 5, 6, 7, 8, 9] } })
    : vkBridge.send("VKWebAppCallAPIMethod", {
        method: "friends.get",
        params: {
          access_token: token,
          v: vkApiV,
        },
      });
export const getPhotosUploadServer = (token: string) =>
  vkBridge.send("VKWebAppCallAPIMethod", {
    method: "photos.getUploadServer",
    params: {
      access_token: token,
      v: vkApiV,
    },
  });
