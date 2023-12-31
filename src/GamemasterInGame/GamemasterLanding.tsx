import { useState } from "react";
import { useGame } from "../store/useStore";
import { useParams } from "react-router-dom";
import { GameProvider } from "../store/GameContextProvider";
import { Lobby } from "./Lobby";
import { ScriptSelect } from "./ScriptSelect";
import { Character, CharacterId } from "../types/script";
import Scripts from "../assets/game_data/scripts.json";
import Roles from "../assets/game_data/roles.json";

export function GameMasterRoot() {
  const { gameId, gmHash } = useParams();
  return (
    <GameProvider gameId={gameId!}>
      <GamemasterLanding providedGMHash={gmHash!} />
    </GameProvider>
  );
}

function GamemasterLanding({ providedGMHash }: { providedGMHash: string }) {
  const [mode, setMode] = useState<"lobby" | "scriptSelect" | "other">(
    "scriptSelect",
  );
  const [characters, setCharacters] = useState<Character[]>([]);

  const { game } = useGame();

  function setRoles(roleIds: CharacterId[] = []) {
    const ids = roleIds?.map(({ id }) => id);
    const roles = Roles.characters.filter(({ id }) => ids?.includes(id));
    setCharacters(roles);
  }

  if (!game) {
    return <div>Loading...</div>;
  }
  if (providedGMHash !== game.gmSecretHash) {
    return <div>You are in the wrong place</div>;
  }

  if (mode === "lobby") {
    return <Lobby rolesList={characters} />;
  }

  if (mode === "scriptSelect") {
    return (
      <ScriptSelect
        handleSubmit={(script, customScript) => {
          if (customScript) {
            setRoles(customScript);
          } else {
            const roleIds = Scripts.scripts.find(({ name }) => name === script)
              ?.characters;
            setRoles(roleIds);
          }
          setMode("lobby");
        }}
      />
    );
  }

  return <div>uh oh</div>;
}

export default GamemasterLanding;
