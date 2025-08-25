"use client";

import { useSearchParams } from "next/navigation";

export default function GameNameHeader() {
  const searchParams = useSearchParams();
  const gameName = searchParams?.get("name") || "Jogo";

  return <h1 className="text-2xl font-bold mb-6">{gameName}</h1>;
}
