"use client";

import { useRef, useState, useCallback } from "react";
import styles from "./formulary.module.css";
import { addItem, getItems } from "@/app/actions/db";

export function ShoppingListForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const addToList = useCallback(async () => {
    const value = inputRef.current?.value?.trim();
    if (!value || isAdding) return;

    setIsAdding(true);
    const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);

    try {
      const items = await getItems();
      const baseItemName = formattedValue.replace(/\s+\d+$/, "").trim();
      const itemExists = items.some((item) => {
        const cleanItemValue = item.value.replace(/\s+\d+$/, "").trim();
        return cleanItemValue.toLowerCase() === baseItemName.toLowerCase();
      });

      if (!itemExists) {
        await addItem(formattedValue);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        console.log(`Item similar a "${formattedValue}" já existe.`);
      }
    } catch (error) {
      console.error("Erro adicionando item:", error);
    } finally {
      setIsAdding(false);
    }
  }, [isAdding]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        addToList();
      }
    },
    [addToList]
  );

  return (
    <>
      <input
        ref={inputRef}
        className={styles.inputSection}
        type="text"
        placeholder="Nome do item"
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={addToList}
        className={styles.addButton}
        disabled={isAdding}
        aria-label="Adicionar item à lista"
      >
        {isAdding ? "Adicionando..." : "Adicionar à lista"}
      </button>
    </>
  );
}
