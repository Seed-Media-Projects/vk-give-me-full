import { useUnit } from "effector-react";
import { useEffect } from "react";
import "./App.css";
import { USER_SCOPE } from "./constants";
import { getUserTokenFX } from "./data/effects.config";
import { $config } from "./data/store.config";
import { selectRandom } from "./utils/random";
import { getAlbums } from "./vk-bridge/user";

function App() {
  const { givenScope, token, user } = useUnit($config);

  useEffect(() => {
    if (givenScope && givenScope !== USER_SCOPE) {
      getUserTokenFX();
    } else if (givenScope === USER_SCOPE && token && user) {
      getAlbums(token, user.id).then(console.debug);
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
      <div>
        Забирай FULL и подарок в размере {selectRandom(5, 15)} тыс. руб!
      </div>
      <button onClick={handleClick} style={{ marginTop: "1rem" }}>
        ПОЛУЧИТЬ
      </button>
    </>
  );
}

export default App;
