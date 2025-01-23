"use client";

import Image from "next/image";
import { WebSocketProvider } from "@/components/WebSocketContext/WebSocketContext";
import { ShoppingListForm } from "@/components/ShoppingListForm/ShoppingListForm";
import { ItemList } from "@/components/ItemList/ItemList";
import styles from "@/app/page.module.css";

export default function Home() {
  return (
    <WebSocketProvider>
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
        <ShoppingListForm />
        <ItemList />
      </div>
    </WebSocketProvider>
  );
}
