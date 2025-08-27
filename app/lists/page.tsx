import { LoadingLink } from "@/app/components/LoadingLink";

export default async function GamesPage() {
  const res = await fetch("http://localhost:8080/lists", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao carregar jogos");
  }

  const games = await res.json();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A1A3A] p-6">
      <div className="w-3xl mx-auto p-6">
        <h1 className="text-3xl text-white font-bold c-[red] mb-6">
          Lista de Games
        </h1>

        <ul className="space-y-4">
          {games.map((game: any) => (
            <li
              key={game.id}
              className="rounded-lg bg-white p-4 shadow hover:shadow-md transition"
            >
              <LoadingLink className="block" href={`/lists/${game.id}/games`}>
                <h2 className="text-xl font-semibold">{game.name}</h2>
              </LoadingLink>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
