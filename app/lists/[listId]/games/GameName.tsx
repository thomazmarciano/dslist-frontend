"use client";

import { useSearchParams } from "next/navigation";
import BackButton from "@/app/games/[gameId]/BackButton";

export default function GameNameHeader() {
  const searchParams = useSearchParams();
  const gameName = searchParams?.get("name") || "Jogo";

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl text-white font-bold mt-6 mb-6">{gameName}</h1>
    </div>
  );
}
