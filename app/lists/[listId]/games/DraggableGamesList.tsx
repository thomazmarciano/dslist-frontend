"use client";

import { useState } from "react";
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

type Game = {
  id: number;
  title: string;
  imgUrl: string;
  shortDescription: string;
  year: string;
};

const SortableGameItem = ({ game }: { game: Game }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: game.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const router = useRouter();

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-lg bg-white overflow-hidden shadow hover:shadow-md cursor-pointer active:cursor-grabbing hover:bg-gray-50"
    >
      <LoadingLink href={`/games/${game.id}`}>
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
  };

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
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={games.map((game) => game.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-4">
            {games.map((game) => (
              <SortableGameItem key={game.id} game={game} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
