import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CharacterSelectList from "./CharacterSelectList";
import PlayerMap from "./PlayerMap";
import TroubleBrewingScript from "./assets/trouble-brewing.json";
import { Character } from "./types/script";
import PlayerLanding from "./PlayerLanding";

function App() {
  const testPlayers: Record<string, Character> = { Alex: { name: "Spy" } };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <CharacterSelectList
          scriptJson={TroubleBrewingScript}
          handleFormSubmit={console.log}
        />
      ),
    },
    {
      path: "/players",
      element: <PlayerMap playersAndCharacters={testPlayers} />,
    },
    {
      path: "/playerLanding",
      element: <PlayerLanding handleFormSubmit={console.log} />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
