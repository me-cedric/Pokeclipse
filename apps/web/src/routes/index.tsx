import { trpc } from "@/router";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Button from "@/components/button/Button";
import { useSubscription } from "@trpc/tanstack-react-query";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data } = useQuery(trpc.hello.queryOptions());

  const { data: activeGames } = useSubscription(
    trpc.activeGames.subscriptionOptions()
  );

  return (
    <div className="h-screen flex flex-col items-center gap-8">
      <h1 className="text-[6rem] font-bold pt-[12vh]">Pokéclipse</h1>

      <div>{data}</div>

      <Button color="#5da93c" reverseFont={true}>
        Se connecter
      </Button>

      <div>
        {activeGames?.map((game) => <div key={game.id}>{game.id}</div>)}
      </div>
    </div>
  );
}
