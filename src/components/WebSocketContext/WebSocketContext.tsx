"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getItems } from "@/app/actions";

type Item = {
  id: string;
  value: string;
};

type WebSocketContextType = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_RENDER_WEB_APP_API_BASE_URL;
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchInitialItems = async () => {
      try {
        const initialItems = await getItems();
        setItems(initialItems);
      } catch (error) {
        console.error("Erro ao buscar itens iniciais:", error);
      }
    };

    fetchInitialItems();
  }, []);

  useEffect(() => {
    const socket = new SockJS(`${API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Conectado ao WebSocket");

        client.subscribe("/topic/shopping-list", (message) => {
          try {
            const updatedList = JSON.parse(message.body);
            setItems(updatedList);
          } catch (error) {
            console.error("Erro ao processar mensagem do WebSocket:", error);
          }
        });
      },
      onDisconnect: () => {
        console.log("Desconectado do WebSocket");
      },
      onStompError: (frame) => {
        console.error("Erro no broker:", frame.headers["message"]);
        console.error("Detalhes:", frame.body);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [API_BASE_URL]);

  return (
    <WebSocketContext.Provider value={{ items, setItems }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (context === undefined) {
    throw new Error(
      "useWebSocket deve ser usado dentro de um WebSocketProvider"
    );
  }

  return context;
};
