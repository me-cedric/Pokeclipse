import Button from "@/components/button/Button";
import Frame from "@/components/frame/Frame";
import InputBox from "@/components/input/input";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/game")({
  component: RouteComponent,
});

function RouteComponent() {
  const [value, setValue] = useState("");
  const onChange = (newValue: string) => {
    if (newValue && newValue !== value) {
      setValue(newValue);
    }
  };
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="text-center">pokecplise</div>

      <div className="mt-full grid grid-cols-4 mt-full mx-12">
        <div className="col-span-1"></div>
        <div className="col-span-2">
          <Frame>Content</Frame>
        </div>
      </div>

      <div className="mt-full grid grid-cols-3 mt-full mx-12">
        <div className="col-span-1"></div>

        <div className="w-2/3 flex flex-col items-center mx-auto my-auto">
          <span className="mr-4">Proposition</span>
          <InputBox
            className="grow-0"
            value={value}
            size={6}
            type="text"
            onChange={(newValue) => onChange(newValue)}
          />
          <span>{value}</span>
        </div>
      </div>

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
