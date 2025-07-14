import Button from "@/components/button/Button";
import Frame from "@/components/frame/Frame";
import InputBox from "@/components/input/input";
import { Image } from "@nextui-org/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import map from "../../assets/map-demo.png";

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
    <div className="w-full h-screen flex flex-col">
      {/* Top Section (Question) */}
      <div className="text-center text-xl py-4 font-bold">
        QUESTION: BLABLA OLALA LA QUESTION C’EST ?
      </div>

      {/* Middle Content */}
      <div className="flex-1 grid grid-cols-3 gap-4 p-4">
        {/* Left Sidebar */}
        <div className="w-[1/3] flex flex-col">
          <div className="text-lg font-bold mb-2">MENU</div>
          <ul className="space-y-1 ">
            <li className="font-semibold">Equipes</li>
            <li className="font-semibold">Capacites</li>
            <ul className="ml-4 space-y-1">
              <li>Plante</li>
              <li>Eau</li>
              <li>Feu</li>
              <li>Et le reste</li>
            </ul>
          </ul>
        </div>

        {/* Map */}
        <div className="w-[1/3] flex flex-col justify-center items-center">
          <div className="w-100 h-[300px] flex items-center justify-center">
            <Image src={map} width={500} height={250} alt="Map here" />
          </div>

          <span className="mr-4">Proposition</span>
          <div className="flex gap-2 items-center">
            <div className="w-12"></div>
            <div className="px-8 py-2">
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
          <div className="flex gap-2 items-center">
            <div className="w-12"></div>
            <div className="px-8 py-2">
              <Frame>REPONSE</Frame>
            </div>
          </div>
        </div>
        {/* Chat */}
        <div className="w-[1/3] flex flex-col justify-center items-center">
          <div className="w-100 h-[200px] flex flex-col items-center justify-center">
            <Frame className="bg-red-400 text-white">
              <div className="text-lg font-bold">CHAT</div>
              <div className="text-sm">EQUIPE</div>
              <div className="text-sm">GLOBAL</div>
            </Frame>
          </div>
          <div className="w-100 grid grid-cols-2 gap-3 *:grow *:w-full! my-auto py-8">
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
    </div>
  );
}
