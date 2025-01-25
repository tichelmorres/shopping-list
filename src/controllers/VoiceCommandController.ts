import { addItem, removeItem, getItems } from "@/app/actions/db";
import { convertNumberWord } from "@/services/numberWordMap";

export async function processCommand(transcript: string) {
  const normalizedTranscript = transcript.toLowerCase();

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
    const itemParts = transcript.toLowerCase().split(" ");
    const processedItemParts = itemParts.map((word) => convertNumberWord(word));

    const formattedItemName = processedItemParts
      .map((part, index) =>
        index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part
      )
      .join(" ");

    await addItem(formattedItemName);
    console.log(`Item "${formattedItemName}" adicionado!`);
  }
}
