import { initializeApp } from "firebase/app";
import {
  getDatabase,
  push,
  set,
  ref,
  onValue,
  remove,
} from "firebase/database";

const appSettings = {
  databaseURL: "https://realtime-database-16115-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

export async function writeToDB(inputValue: string): Promise<string | null> {
  const newItemRef = push(shoppingListInDB);
  await set(newItemRef, inputValue);
  return newItemRef.key;
}

export function readFromDB(
  callback: (itemsList: { id: string; value: string }[]) => void
): () => void {
  return onValue(shoppingListInDB, (snapshot) => {
    const items = snapshot.val();
    const itemsList = items
      ? Object.entries(items).map(([id, value]) => ({
          id,
          value: String(value),
        }))
      : [];
    callback(itemsList);
  });
}

export async function removeFromDB(itemId: string | null): Promise<void> {
  if (!itemId) return;
  const itemRef = ref(database, `shoppingList/${itemId}`);
  await remove(itemRef);
}
