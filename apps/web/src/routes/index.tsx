import Button from "@/components/button/Button";
import InputBox from "@/components/input/input";
import { authClient } from "@/utils/auth-client";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.hello.queryOptions());

  const { data: activeGames } = useSubscription(
    trpc.game.onActiveGamesChange.subscriptionOptions()
  );

  console.log(activeGames);

  const isInGame = (gameId: string) => {
    return activeGames?.some(
      (game) =>
        game.id === gameId &&
        game.players.some(
          (player) => player.userId === protectedData?.session?.user?.id
        )
    );
  };

  const { data: protectedData, error: protectedError } = useQuery(
    trpc.protected.queryOptions()
  );

  const joinGameMutation = useMutation(
    trpc.game.joinGame.mutationOptions({
      onSuccess: (game) => {
        console.log("Joined game:", game);
      },
    })
  );

  const leaveGameMutation = useMutation(
    trpc.game.leaveGame.mutationOptions({
      onSuccess: (game) => {
        console.log("Left game:", game);
      },
    })
  );

  const createGameMutation = useMutation(
    trpc.game.createGame.mutationOptions({
      onSuccess: (game) => {
        console.log("Created game:", game);
      },
    })
  );

  const [gameName, setGameName] = useState("");
  const onChange = (newValue: string) => {
    if (newValue && newValue !== gameName) {
      setGameName(newValue);
    }
  };

  const joinGame = (gameId: string) => {
    console.log("Joining a game with ID:", gameId);
    joinGameMutation.mutate({ gameId });
  };

  const leaveGame = (gameId: string) => {
    console.log("Leaving a game with ID:", gameId);
    leaveGameMutation.mutate({ gameId });
  };

  const createGame = () => {
    console.log("Creating game with name:", gameName);
    createGameMutation.mutate({ name: gameName });
    onChange("");
  };

  return (
    <div className="h-screen flex flex-col items-center gap-8">
      <h1 className="text-[6rem] font-bold pt-[12vh]">Pokéclipse</h1>

      <div>{data}</div>

      <Button
        color="#5da93c"
        reverseFont={true}
        onClick={() =>
          authClient.signIn.social({
            provider: "discord",
            callbackURL: "http://localhost:3000",
          })
        }
      >
        Se connecter
      </Button>

      <div>
        {activeGames?.map((game: { id: string }) => (
          <Button
            key={game.id}
            color="#000000"
            reverseFont={true}
            onClick={() =>
              isInGame(game.id) ? leaveGame(game.id) : joinGame(game.id)
            }
          >
            {isInGame(game.id) ? "Quitter" : "Rejoindre"} la partie: {game.id}
          </Button>
        ))}
      </div>

      <InputBox
        className="grow-0"
        value={gameName}
        size={6}
        type="text"
        onChange={(newValue) => onChange(newValue)}
      />

      <Button color="#5da93c" reverseFont={true} onClick={createGame}>
        Créer une partie
      </Button>

      {!!protectedData?.session && (
        <>
          <div>{protectedData?.session?.user?.id}</div>
          <div>{protectedData?.session?.user?.name}</div>
          <img src={protectedData?.session?.user?.image ?? ""} />
        </>
      )}
      <div className="text-red-500">{protectedError?.message}</div>
    </div>
  );
}
