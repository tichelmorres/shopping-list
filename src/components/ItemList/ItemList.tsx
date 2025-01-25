"use client";

import { useState, useCallback } from "react";
import styles from "./itemList.module.css";
import { useWebSocket } from "@/components/WebSocketContext/WebSocketContext";
import { removeItem, getItems } from "@/app/actions/db";

export function ItemList() {
  const { items } = useWebSocket();
  const [pressTimers, setPressTimers] = useState<{
    [key: string]: NodeJS.Timeout;
  }>({});
  const longPressThreshold = 6000; // 6 seconds

  const handleRemoveItem = async (itemId: string | null) => {
    if (!itemId) return;

    try {
      await removeItem(itemId);
    } catch (error) {
      console.error("Erro removendo item:", error);
    }
  };

  const handleTouchStart = useCallback((itemId: string) => {
    const timer = setTimeout(async () => {
      const allItems = await getItems();
      if (allItems.length > 0) {
        for (const item of allItems) {
          await removeItem(item.id);
        }
        console.log("Todos os itens removidos!");
      }
    }, longPressThreshold);

    setPressTimers((prev) => ({ ...prev, [itemId]: timer }));
  }, []);

  const handleTouchEnd = useCallback(
    (itemId: string) => {
      if (pressTimers[itemId]) {
        clearTimeout(pressTimers[itemId]);
        setPressTimers((prev) => {
          const newTimers = { ...prev };
          delete newTimers[itemId];
          return newTimers;
        });
      }
    },
    [pressTimers]
  );

  return (
    <ul className={styles.list}>
      {items.map(({ id, value }) => (
        <button
          key={id}
          onClick={() => handleRemoveItem(id)}
          onMouseDown={() => handleTouchStart(id)}
          onMouseUp={() => handleTouchEnd(id)}
          onMouseLeave={() => handleTouchEnd(id)}
          onTouchStart={() => handleTouchStart(id)}
          onTouchEnd={() => handleTouchEnd(id)}
          onTouchCancel={() => handleTouchEnd(id)}
          className={styles.itemSlot}
        >
          <li className={styles.item}>{value}</li>
        </button>
      ))}
    </ul>
  );
}
