import "./App.css";
import { getUserTokenFX } from "./data/effects.config";
import { selectRandom } from "./utils/random";

function App() {
  return (
    <>
      <div>Приветствую!</div>
      <div>
        Забирай FULL и подарок в размере {selectRandom(5, 15)} тыс. руб!
      </div>
      <button onClick={() => getUserTokenFX()} style={{ marginTop: "1rem" }}>
        ПОЛУЧИТЬ
      </button>
    </>
  );
}

export default App;
