// app/lists/[listId]/games/page.tsx
import { notFound } from "next/navigation";
import GameNameHeader from "./GameName";

type Game = {
  id: number;
  title: string; // ajuste pro nome do campo que vem da sua API
  platform?: string;
};

async function getGamesByList(listId: string): Promise<Game[]> {
  const res = await fetch(`http://localhost:8080/lists/${listId}/games`, {
    cache: "no-store", // evita cache em dev
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
  params: { listId: string };
}) {
  const { listId } = params;
  const games = await getGamesByList(listId);

  if (!games.length) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <GameNameHeader />

      <ul className="space-y-4">
        {games.map((game) => (
          <li
            key={game.id}
            className="rounded-lg bg-white p-4 shadow hover:shadow-md transition"
          >
            <h2 className="font-semibold">{game.title}</h2>
            {game.platform && (
              <p className="text-gray-600">Plataforma: {game.platform}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
