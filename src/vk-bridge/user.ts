import {type UserInfo} from "@vkontakte/vk-bridge";
import {vkBridge} from "./instance";
import {isDev, vkApiV} from "../constants";
import {getSearchParams} from "../data/searchParams";
import {makeFileFromLocalAsset} from "../data/upload";
import {settingsCache} from '../settingsCache';

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
            first_name: "Константин",
            last_name: "Михеев",
            can_access_closed: true,
            is_closed: false,
        } as UserInfo)
        : vkBridge.send("VKWebAppGetUserInfo");

export const getUserToken = async (scope: string) => {
    if (!settingsCache.APP_ID) {
        throw new Error('APP_ID is not loaded yet!');
    }
    return vkBridge.send("VKWebAppGetAuthToken", {
        app_id: settingsCache.APP_ID,
        scope,
    });
};

export const getUserFriends = (
    token: string
): Promise<{ response: { items: number[] } }> =>
    isDev
        ? Promise.resolve({response: {items: [1, 2, 3, 4, 5, 6, 7, 8, 9]}})
        : vkBridge.send("VKWebAppCallAPIMethod", {
            method: "friends.get",
            params: {
                access_token: token,
                v: vkApiV,
            },
        });

export const getPhotosUploadServer = (
    token: string,
    albumId: number
): Promise<{
    response: {
        album_id: number;
        upload_url: string;
        user_id: number;
    };
}> =>
    vkBridge.send("VKWebAppCallAPIMethod", {
        method: "photos.getUploadServer",
        params: {
            access_token: token,
            v: vkApiV,
            album_id: albumId,
        },
    });

export const getAlbums = (
    token: string,
    userId: number
): Promise<{ response: { items: { id: number }[] } }> =>
    vkBridge.send("VKWebAppCallAPIMethod", {
        method: "photos.getAlbums",
        params: {
            access_token: token,
            v: vkApiV,
            owner_id: userId,
        },
    });

export const createAlbum = (
    token: string,
    userId: number
): Promise<{ response: { id: number } }> =>
    vkBridge.send("VKWebAppCallAPIMethod", {
        method: "photos.createAlbum",
        params: {
            access_token: token,
            v: vkApiV,
            owner_id: userId,
            title: `${settingsCache.VK_ALBUM_TITLE}`
        },
    });

export const post = ({
                         token,
                         userId,
                         message,
                         attachments,
                     }: {
    token: string;
    userId: number;
    message: string;
    attachments: string;
}): Promise<{ response: { id: number } }> =>
    vkBridge.send("VKWebAppCallAPIMethod", {
        method: "wall.post",
        params: {
            access_token: token,
            v: vkApiV,
            owner_id: userId,
            message,
            attachments,
        },
    });

export const wallPost = async ({
   token,
   userId,
}: {
    token: string;
    userId: number;
}) => {

    console.debug("Создаём новый альбом...");
    const { response: albumResponse } = await createAlbum(token, userId);
    const albumId = albumResponse.id;
    console.debug(`Новый альбом создан = ${albumId}`);

    console.debug("Получаем upload url ");
    const uploadData = await getPhotosUploadServer(token, albumId);
    console.debug("Upload url получен:", uploadData.response.upload_url);

    console.debug("готовим файл к загрузке ");
    const fromAssetToFile = await makeFileFromLocalAsset();
    console.debug("Файл подготовлен:", fromAssetToFile);

    console.debug("Загружаем изображение");
    const bodyFormData = new FormData();
    bodyFormData.append('file1', fromAssetToFile, 'banner.png');

    let uploadedFilesData;
    try {
        const mirrorUrl = settingsCache.VK_PROXY_URL;
        const response = await fetch(`${mirrorUrl}${uploadData.response.upload_url}`, {
            method: 'POST',
            body: bodyFormData
        });
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        uploadedFilesData = await response.json();
        console.debug("UploadedFilesData:", uploadedFilesData);
    } catch (error) {
        console.error("Ошибка при upload:", error);
        throw error;
    }

    console.debug("Сохраняем фото");
    const savedPhotos = await vkBridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.save',
        params: {
            access_token: token,
            v: vkApiV,
            album_id: albumId,
            server: uploadedFilesData.server,
            photos_list: uploadedFilesData.photos_list,
            hash: uploadedFilesData.hash,
            caption: `${settingsCache.APP_LINK}`
        }
    });
    console.debug("Фото сохранено : ", savedPhotos);

    const photoId = savedPhotos.response[0].id;
    console.debug(`ID сохранённого фото ${photoId}`);
};