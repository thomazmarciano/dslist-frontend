"use client";

import BackButton from "@/app/games/[gameId]/BackButton";
import TitleDisplay from "./TitleDisplay";

interface GameNameHeaderProps {
  name: string;
}

export function GameNameHeader({ name }: GameNameHeaderProps) {
  return (
    <div>
      <BackButton />
      <TitleDisplay />
    </div>
  );
}
