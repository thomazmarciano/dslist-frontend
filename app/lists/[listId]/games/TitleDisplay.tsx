"use client";
import { useEffect, useState } from "react";
import { useList } from "@/app/context/ListContext";

export default function TitleDisplay() {
  const { currentListId } = useList();
  const [listTitle, setListTitle] = useState("");

  useEffect(() => {
    async function fetchListTitle() {
      if (!currentListId) {
        setListTitle("Voltar para as Listas");
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/lists`);

        if (!res.ok) {
          console.error("Failed to fetch lists:", res.status, res.statusText);
          setListTitle("Erro ao Carregar Listas");
          return;
        }

        const lists = await res.json();
        const currentList = lists.find(
          (list: { id: number; name: string }) =>
            list.id.toString() === currentListId
        );

        if (currentList) {
          setListTitle(currentList.name);
        } else {
          setListTitle("Lista Não Encontrada");
        }
      } catch (error) {
        console.error("Erro ao buscar o título da lista:", error);
        setListTitle("Erro ao Carregar");
      }
    }

    fetchListTitle();
  }, [currentListId]);

  return (
    <h1 className="text-2xl text-white font-bold mt-6 mb-6">{listTitle}</h1>
  );
}
