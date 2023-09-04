import { Button, Flex, Tabs } from "@radix-ui/themes";
import {
  CharacterSelectList,
  useCharacterSelectState,
} from "./CharacterSelectList";
import { useGame } from "../store/GameContext";
import { useDistributeRoles, usePlayersToRoles } from "../store/useStore";
import TeamDistributionBar from "./TeamDistributionBar";
import { useState } from "react";
import { Character } from "../types/script";
import { ShareButton } from "./ShareButton";
import { useParams } from "react-router-dom";
import { Share1Icon } from "@radix-ui/react-icons";

function StartGameButton({
  onClick,
  isLoading,
  gameStarted,
}: {
  onClick: () => void;
  isLoading: boolean;
  gameStarted?: boolean;
}) {
  if (gameStarted) {
    return <div>Game has started.</div>;
  }
  return (
    <Button onClick={onClick}>
      {isLoading ? "Doing some work..." : "Distribute Roles"}
    </Button>
  );
}

export interface LobbyProps {
  rolesList: Character[];
}

export function Lobby({ rolesList }: LobbyProps) {
  const { game } = useGame();
  const playersToRoles = usePlayersToRoles();
  const [selectedTab, setSelectedTab] = useState<"roles" | "players">("roles");
  const [distributeRolesError, isLoading, , distributeRoles, clear] =
    useDistributeRoles();

  const characterSelectState = useCharacterSelectState(rolesList);
  const availableRolesList = Object.entries(
    characterSelectState.selectedRoles.value,
  )
    .filter(([, value]) => value)
    .map(([key]) => key);
  const { gameId } = useParams();

  if (!game) {
    return <div>Loading...</div>;
  }
  if (distributeRolesError) {
    return (
      <>
        <div>Something went wrong, please check with players and try again</div>
        <div>{distributeRolesError}</div>
        <Button onClick={clear}>Try again</Button>
      </>
    );
  }

  return (
    <Tabs.Root
      defaultValue="roles"
      value={game?.gameStarted ? "players" : selectedTab}
      onValueChange={(e) => setSelectedTab(e as "roles" | "players")}
    >
      <Tabs.List>
        <Tabs.Trigger disabled={game.gameStarted} value="roles">
          Roles
        </Tabs.Trigger>
        <Tabs.Trigger value="players">
          Players ({Object.keys(game.players).length})
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="roles">
        <Flex direction="column" gap="3" py="3">
          <CharacterSelectList state={characterSelectState} />
          <TeamDistributionBar
            charsSelected={[
              ...characterSelectState.characters,
              ...characterSelectState.additionalCharacters.value,
            ].filter(
              ({ name }) => characterSelectState.selectedRoles.value[name],
            )}
          />
        </Flex>
        <Flex gap="4">
          <StartGameButton
            gameStarted={game.gameStarted}
            isLoading={isLoading}
            onClick={() => distributeRoles(availableRolesList)}
          />

          <ShareButton
            url={`${document.location.protocol}//${document.location.hostname}${
              document.location.port ? `:${document.location.port}` : ""
            }/${gameId}`}
            title="Join Game: Blood on the Clocktower"
            text="Join game: Blood on the Clocktower"
          >
            <Share1Icon /> Invite Players
          </ShareButton>
        </Flex>
      </Tabs.Content>
      <Tabs.Content value="players">
        <Flex direction="column" py="3" style={{ overflowY: "auto" }}>
          {Object.entries(playersToRoles).length === 0 &&
            "No players joined yet."}
          {Object.entries(playersToRoles).map(([name, role]) => (
            <Flex justify="between" px="3" key={name}>
              <div>{name}</div>
              <div>{role || "Not yet assigned"}</div>
            </Flex>
          ))}
        </Flex>
        <StartGameButton
          gameStarted={game.gameStarted}
          isLoading={isLoading}
          onClick={() => distributeRoles(availableRolesList)}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
}
