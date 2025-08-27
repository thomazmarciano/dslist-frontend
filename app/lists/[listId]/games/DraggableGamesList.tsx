"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LoadingLink } from "@/app/components/LoadingLink";
import { useList } from "@/app/context/ListContext"; // Importe o hook

type Game = {
  id: number;
  title: string;
  imgUrl: string;
  shortDescription: string;
  year: string;
};

const SortableGameItem = ({
  game,
  isDragActive,
  listId, // Adicione listId como prop aqui
}: {
  game: Game;
  isDragActive: boolean;
  listId: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: game.id.toString() });

  const [dragJustEnded, setDragJustEnded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const router = useRouter();
  const { setCurrentListId } = useList(); // Use o hook aqui

  // Reset dragJustEnded after drag state changes
  useEffect(() => {
    if (!isDragging && dragJustEnded) {
      const timer = setTimeout(() => setDragJustEnded(false), 300);
      return () => clearTimeout(timer);
    }
    if (isDragging) {
      setDragJustEnded(true);
    }
  }, [isDragging, dragJustEnded]);

  const shouldPreventClick = isDragging || isDragActive || dragJustEnded;

  const handleClick = (e: React.MouseEvent) => {
    if (shouldPreventClick) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    setCurrentListId(listId);

    // If click is allowed, navigate programmatically
    router.push(`/games/${game.id}`);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-lg bg-white overflow-hidden shadow hover:shadow-md cursor-pointer active:cursor-grabbing hover:bg-gray-50 relative"
      onClick={handleClick}
    >
      <LoadingLink href="#">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Image
              src={game.imgUrl}
              alt={`Thumb do jogo ${game.title}`}
              width={102}
              height={100}
              className="object-cover block"
              priority
            />
          </div>

          <div className="flex-1 p-4">
            <h2 className="font-semibold text-lg transition-colors">
              {game.title}
            </h2>
            <p className="text-gray-600 mt-1">{game.shortDescription}</p>
            <p className="text-blue-600 text-sm mt-1">{game.year}</p>
          </div>
        </div>
      </LoadingLink>
    </li>
  );
};

// Static version for SSR
const StaticGameItem = ({ game }: { game: Game }) => {
  return (
    <li className="rounded-lg bg-white overflow-hidden shadow hover:shadow-md">
      <LoadingLink href="#">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Image
              src={game.imgUrl}
              alt={`Thumb do jogo ${game.title}`}
              width={102}
              height={100}
              className="object-cover block"
              priority
            />
          </div>

          <div className="flex-1 p-4">
            <h2 className="font-semibold text-lg transition-colors">
              {game.title}
            </h2>
            <p className="text-gray-600 mt-1">{game.shortDescription}</p>
            <p className="text-blue-600 text-sm mt-1">{game.year}</p>
          </div>
        </div>
      </LoadingLink>
    </li>
  );
};

interface DraggableGamesListProps {
  initialGames: Game[];
  listId: string;
}

export default function DraggableGamesList({
  initialGames,
  listId,
}: DraggableGamesListProps) {
  const [games, setGames] = useState(initialGames);
  const [isReordering, setIsReordering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Only enable drag and drop after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = async () => {
      console.log("Back/forward navigation detected, refreshing data...");
      await fetchUpdatedGames();
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener("popstate", handlePopState);

    // Also listen for page show event (when page is loaded from cache)
    const handlePageShow = async (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log("Page loaded from cache, refreshing data...");
        await fetchUpdatedGames();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [listId]);

  // Reset games when initialGames prop changes (important for SSR)
  useEffect(() => {
    setGames(initialGames);
  }, [initialGames]);

  const fetchUpdatedGames = async () => {
    try {
      console.log(`Fetching updated games for list ${listId}...`);
      const response = await fetch(
        `http://localhost:8080/lists/${listId}/games`,
        {
          cache: "no-store", // Force fresh data
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      if (response.ok) {
        const updatedGames = await response.json();
        console.log("Updated games received:", updatedGames);
        setGames(updatedGames);
      } else {
        console.error("Failed to fetch updated games:", response.status);
      }
    } catch (error) {
      console.error("Erro ao buscar jogos atualizados:", error);
    }
  };

  const handleDragStart = () => {
    setIsDragActive(true);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = games.findIndex(
        (game) => game.id.toString() === active.id
      );
      const newIndex = games.findIndex(
        (game) => game.id.toString() === over.id
      );

      const newGames = arrayMove(games, oldIndex, newIndex);
      setGames(newGames);

      setIsReordering(true);
      try {
        const response = await fetch(
          `http://localhost:8080/lists/${listId}/replacement`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sourceIndex: oldIndex,
              destinationIndex: newIndex,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao reordenar");
        }

        console.log("Ordem atualizada com sucesso");
      } catch (error) {
        console.error("Erro ao reordenar:", error);
        setGames(initialGames);
        alert("Erro ao reordenar os jogos. Tente novamente.");
      } finally {
        setIsReordering(false);
      }
    }

    // Reset drag active state after a short delay
    setTimeout(() => {
      setIsDragActive(false);
    }, 300);
  };

  // Render static version during SSR and initial hydration
  if (!mounted) {
    return (
      <div className="relative">
        <ul className="space-y-4">
          {games.map((game) => (
            <StaticGameItem key={game.id} game={game} />
          ))}
        </ul>
      </div>
    );
  }

  // Render draggable version after hydration
  return (
    <div className="relative">
      {isReordering && (
        <div className="absolute top-0 left-0 right-0 bg-blue-100 text-blue-800 text-sm p-2 rounded-md mb-4 z-10">
          Atualizando ordem...
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={games.map((game) => game.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-4">
            {games.map((game) => (
              <SortableGameItem
                key={game.id}
                game={game}
                isDragActive={isDragActive}
                listId={listId}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
