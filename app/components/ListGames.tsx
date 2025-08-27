"use client";

import { useEffect } from "react";
import { useList } from "@/app/context/ListContext";

export default function ListContextWrapper({ listId }: { listId: string }) {
  const { setCurrentListId } = useList();

  useEffect(() => {
    setCurrentListId(listId);
  }, [listId, setCurrentListId]);

  return null;
}
