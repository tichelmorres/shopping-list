"use client";

import { writeToDB, readFromDB, removeFromDB } from "@/db";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<{ id: string | null; value: string }[]>(
    []
  );
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Listener para sincronizar os dados com o Firebase
    const subscribe = readFromDB(setItems);

    // Cleanup do listener ao desmontar o componente
    return () => subscribe();
  }, []);

  const clearInputField = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatItem = (itemValue: string) => {
    return itemValue.charAt(0).toUpperCase() + itemValue.slice(1);
  };

  const addToList = async () => {
    const value = inputRef.current?.value?.trim();
    if (!value || isAdding) return;

    // Limita o tamanho do valor a 70 caracteres
    const truncatedValue = value.length > 70 ? value.slice(0, 70) : value;

    // Verifica duplicidade no estado local
    if (
      items.some(
        (item) => item.value.toLowerCase() === truncatedValue.toLowerCase()
      )
    ) {
      alert("Este item já está presente na lista!");
      return;
    }

    setIsAdding(true);
    try {
      const formattedValue = formatItem(truncatedValue);
      await writeToDB(formattedValue);
      clearInputField();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const removeItem = async (itemId: string | null) => {
    try {
      await removeFromDB(itemId);
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Image
        src="https://mystickermania.com/cdn/stickers/cute-cats/blue-cat-cook-512x512.png"
        alt="Um gato azul com chapéu de Master Chef."
        width={260}
        height={260}
      />
      <input
        ref={inputRef}
        className={styles.inputSection}
        type="text"
        placeholder="Nome do item"
      />
      <button onClick={addToList} className={styles.addButton}>
        Adicionar à lista
      </button>
      <ul className={styles.list}>
        {items.map(({ id, value }) => (
          <button
            key={id}
            onClick={() => removeItem(id)}
            className={styles.itemSlot}
          >
            <li key={id} className={styles.item}>
              {value}
            </li>
          </button>
        ))}
      </ul>
    </div>
  );
}
