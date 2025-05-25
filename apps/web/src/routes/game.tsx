import Frame from "@/components/frame/Frame";
import Button from "@/components/button/Button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="text-center">pokecplise</div>

      <div className="mt-full grid grid-cols-3 mt-full mx-12">
        <div className="col-span-1"></div>

        <div className="w-2/3 mx-auto my-auto">
          <Frame>REPONSE</Frame>
        </div>

        <div className="grid grid-cols-2 gap-3 *:grow *:w-full! my-auto py-8">
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
        </div>
      </div>
    </div>
  );
}
