import Link from "next/link";

export default async function GamesPage() {
  const res = await fetch("http://localhost:8080/lists", {
    cache: "no-store", // garante que não vai usar cache
  });

  if (!res.ok) {
    throw new Error("Erro ao carregar jogos");
  }

  const games = await res.json();

  return (
    <main className="min-h-screen bg-[#0A1A3A] p-6">
      <h1 className="text-3xl text-white font-bold c-[red] mb-6">
        Lista de Games
      </h1>

      <ul className="space-y-4">
        {games.map((game: any) => (
          <Link key={game.id} className="p-4" href={`/lists/${game.id}/games`}>
            <li className="rounded-lg bg-white p-4 shadow hover:shadow-md transition">
              <h2 className="text-xl font-semibold">{game.name}</h2>
            </li>
          </Link>
        ))}
      </ul>
    </main>
  );
}
