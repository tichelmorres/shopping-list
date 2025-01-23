"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { addItem, getItems, removeItem } from "./actions";

export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_RENDER_WEB_APP_API_BASE_URL;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<{ id: string; value: string }[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formatItem = useCallback((itemValue: string) => {
    return itemValue.charAt(0).toUpperCase() + itemValue.slice(1);
  }, []);

  const clearInputField = useCallback(() => {
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  useEffect(() => {
    let client: Client;

    const initializeConnection = async () => {
      try {
        const initialItems = await getItems();
        setItems(initialItems);
        setIsLoading(false);

        const socket = new SockJS(`${API_BASE_URL}/ws`);
        client = new Client({
          webSocketFactory: () => socket,
          onConnect: () => {
            console.log("Connected to WebSocket");

            client.subscribe("/topic/shopping-list", (message) => {
              const updatedList = JSON.parse(message.body);
              setItems(updatedList);
            });
          },
          onDisconnect: () => {
            console.log("Disconnected from WebSocket");
          },
          onStompError: (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
          },
        });

        client.activate();
      } catch (error) {
        console.error("Error initializing connection:", error);
        setIsLoading(false);
      }
    };

    initializeConnection();

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [API_BASE_URL]);

  const addToList = useCallback(async () => {
    const value = inputRef.current?.value?.trim();
    if (!value || isAdding) return;

    setIsAdding(true);
    const formattedValue = formatItem(value);

    try {
      await addItem(formattedValue);
      clearInputField();
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setIsAdding(false);
    }
  }, [isAdding, formatItem, clearInputField]);

  const handleRemoveItem = useCallback(async (itemId: string | null) => {
    if (!itemId) return;

    try {
      await removeItem(itemId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }, []);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        addToList();
      }
    },
    [addToList]
  );

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
        onKeyPress={handleKeyPress}
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
