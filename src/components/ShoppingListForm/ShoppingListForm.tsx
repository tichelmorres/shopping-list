"use client";

import { useRef, useState, useCallback } from "react";
import styles from "@/app/page.module.css";
import { addItem } from "@/app/actions";

export function ShoppingListForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const addToList = useCallback(async () => {
    const value = inputRef.current?.value?.trim();
    if (!value || isAdding) return;

    setIsAdding(true);
    const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);

    try {
      await addItem(formattedValue);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      console.error("Error adding item:", error);
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
