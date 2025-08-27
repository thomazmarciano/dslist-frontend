import { notFound } from "next/navigation";
import { GameNameHeader } from "./GameName";
import DraggableGamesList from "./DraggableGamesList";
import ListContextWrapper from "@/app/components/ListGames";

type Game = {
  id: number;
  title: string;
  imgUrl: string;
  shortDescription: string;
  year: string;
};

async function getGamesByList(listId: string): Promise<Game[]> {
  const res = await fetch(`http://localhost:8080/lists/${listId}/games`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Erro ao buscar jogos:", res.status);
    return [];
  }

  return res.json();
}

export default async function GamesPage({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  const { listId } = await params;
  const games = await getGamesByList(listId);

  if (!games.length) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A1A3A] p-6">
      <div className="max-w-3xl mx-auto p-6">
        <ListContextWrapper listId={listId} />
        <GameNameHeader name={listId} />
        <DraggableGamesList initialGames={games} listId={listId} />
      </div>
    </main>
  );
}
