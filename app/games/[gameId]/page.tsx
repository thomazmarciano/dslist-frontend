import Image from "next/image";
import { notFound } from "next/navigation";
import StarRating from "./StarRating";
import { LoadingLink } from "@/app/components/LoadingLink";

type Game = {
  id: number;
  title: string;
  imgUrl: string;
  shortDescription: string;
  longDescription: string;
  year: string;
  genre: string;
  platforms: string;
  score: number;
};

async function getGameById(gameId: string): Promise<Game | null> {
  try {
    const res = await fetch(`http://localhost:8080/games/${gameId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Erro ao buscar jogo:", res.status);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Erro ao buscar jogo:", error);
    return null;
  }
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const game = await getGameById(gameId);

  let listId: number;
  if (parseInt(gameId) <= 5) {
    listId = 1;
  } else {
    listId = 2;
  }

  if (!game) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A1A3A] p-6">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <LoadingLink
            href={`/lists/${listId}/games`} //here should be listId
            className="text-white hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar
          </LoadingLink>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3">
              <Image
                src={game.imgUrl}
                alt={`Capa do jogo ${game.title}`}
                width={400}
                height={600}
                className="w-full h-64 lg:h-full object-cover"
                priority
              />
            </div>

            <div className="flex-1 p-6 lg:p-8">
              <div className="text-blue-600 font-medium text-lg mb-2">
                {game.year}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {game.title}
              </h1>

              <div className="space-y-2 mb-6">
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <span>
                    <strong>Gênero:</strong> {game.genre}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <span>
                    <strong>Plataformas:</strong> {game.platforms}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <StarRating rating={game.score} />
              </div>

              <div className="text-gray-700 leading-relaxed">
                <p>{game.longDescription || game.shortDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
