"use client";

import styles from "./itemList.module.css";
import { useWebSocket } from "@/components/WebSocketContext/WebSocketContext";
import { removeItem } from "@/app/actions/db";

export function ItemList() {
  const { items } = useWebSocket();

  const handleRemoveItem = async (itemId: string | null) => {
    if (!itemId) return;

    try {
      await removeItem(itemId);
    } catch (error) {
      console.error("Erro removendo item:", error);
    }
  };

  return (
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
  );
}
