/**
 * Main page component for the Shopping List application.
 * Implements a responsive interface for managing shopping list items.
 *
 * Key Features:
 * - Real-time item management (add/remove)
 * - Input validation
 * - Loading state handling
 * - Duplicate item prevention
 * - Character limit enforcement (70 chars)
 * - Case-insensitive item comparison
 *
 * State Management:
 * - items: Array of shopping list items
 * - isAdding: Loading state for item addition
 * - isLoading: Initial data fetching state
 *
 * Error Handling:
 * - Input validation for alphanumeric characters and spaces
 * - Error messaging for duplicates and invalid inputs
 * - API error catch blocks with console logging
 */

"use client";

import { addItem, getItems, removeItem } from "@/db";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<{ id: string; value: string }[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Loading state to prevent hydration mismatch
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
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

    const isValidInput = (input: string) => /^[a-zA-Z0-9\s]+$/.test(input);
    if (!isValidInput(value)) {
      alert("Entrada inválida. Use apenas letras, números e espaços.");
      return;
    }

    const truncatedValue = value.length > 70 ? value.slice(0, 70) : value;

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
      const itemId = await addItem(formattedValue);
      setItems((prevItems) => [
        ...prevItems,
        { id: itemId, value: formattedValue },
      ]);
      clearInputField();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveItem = async (itemId: string | null) => {
    if (!itemId) return;
    try {
      await removeItem(itemId);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  // Show loading state
  if (isLoading) {
    return <div className={styles.container}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div style={{ position: "relative", width: "260px", height: "260px" }}>
        <Image
          src="/blue-cat-chef.png"
          alt="Um gato azul com chapéu de Master Chef."
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
      <input
        ref={inputRef}
        className={styles.inputSection}
        type="text"
        placeholder="Nome do item"
      />
      <button
        onClick={addToList}
        className={styles.addButton}
        disabled={isAdding}
        aria-label="Adicionar item à lista"
      >
        {isAdding ? "Adicionando..." : "Adicionar à lista"}
      </button>
      <ul className={styles.list}>
        {items.map(({ id, value }) => (
          <button
            key={id}
            onClick={() => handleRemoveItem(id)}
            className={styles.itemSlot}
          >
            <li className={styles.item}>{value}</li>
          </button>
        ))}
      </ul>
    </div>
  );
}
