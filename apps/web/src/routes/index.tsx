import Button from "@/components/button/Button";
import Frame from "@/components/frame/Frame";
import { trpc } from "@/router";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data } = useQuery(trpc.hello.queryOptions());

  return (
    <>
      <div>{data}</div>

      <div className="text-center">pokecplise</div>
      <Button color={"#a60d0d"} reverseFont={true}>
        CAPACITES
      </Button>
      <Button color={"#d2a828"} reverseFont={true}>
        OBJETS
      </Button>
      <Button color={"#5da93c"} reverseFont={true}>
        ???
      </Button>
      <Button color={"#515aa8"} reverseFont={true}>
        ???
      </Button>
      <Frame>REPONSE</Frame>
    </>
  );
}
