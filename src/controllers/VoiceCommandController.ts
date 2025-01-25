import { addItem, removeItem, getItems } from "@/app/actions/db";

export async function processCommand(transcript: string) {
  const normalizedTranscript = transcript.toLowerCase();

  // Regex to extract item names more robustly
  const removeMatch =
    normalizedTranscript.match(/remover\s+(.+)/) ||
    normalizedTranscript.match(/(.+)\s+(?:ok|okay)/);

  if (removeMatch) {
    const itemName = removeMatch[1].trim();
    if (itemName) {
      // Remove quantity from the end of the item name
      const cleanItemName = itemName.replace(/\s+\d+$/, "").trim();

      const formattedItemName =
        cleanItemName.charAt(0).toUpperCase() + cleanItemName.slice(1);

      // Fetch existing items and find the matching item's ID
      const items = await getItems();
      const itemToRemove = items.find((item) =>
        item.value.toLowerCase().startsWith(formattedItemName.toLowerCase())
      );

      if (itemToRemove) {
        await removeItem(itemToRemove.id);
        console.log(`Item "${formattedItemName}" removido!`);
      } else {
        console.log(`Item "${formattedItemName}" não encontrado.`);
      }
    }
  } else {
    const itemName = transcript;
    if (itemName) {
      const formattedItemName =
        itemName.charAt(0).toUpperCase() + itemName.slice(1);
      await addItem(formattedItemName);
      console.log(`Item "${formattedItemName}" adicionado!`);
    }
  }
}
