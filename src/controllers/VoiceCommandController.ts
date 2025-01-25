import { addItem, removeItem, getItems } from "@/app/actions/db";
import { convertNumberWord } from "@/services/numberWordMap";

export async function processCommand(transcript: string) {
  const normalizedTranscript = transcript.toLowerCase();

  const removeMatch =
    normalizedTranscript.match(/remover\s+(.+)/) ||
    normalizedTranscript.match(/(.+)\s+(?:ok|okay)/);

  const removeAllMatch = normalizedTranscript.match(/limpar\s+a\s+lista/);

  if (removeMatch) {
    const itemName = removeMatch[1].trim();
    if (itemName) {
      const cleanItemName = itemName.replace(/\s+\d+$/, "").trim();

      const formattedItemName =
        cleanItemName.charAt(0).toUpperCase() + cleanItemName.slice(1);

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
  } else if (removeAllMatch) {
    const items = await getItems();
    if (items.length > 0) {
      for (const item of items) {
        await removeItem(item.id);
      }
      console.log("Lista limpa!");
    } else {
      console.log("Nenhum item para remover.");
    }
  } else {
    const itemParts = transcript.toLowerCase().split(" ");
    const processedItemParts = itemParts.map((word) => convertNumberWord(word));

    const formattedItemName = processedItemParts
      .map((part, index) =>
        index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part
      )
      .join(" ");

    const items = await getItems();
    const baseItemName = formattedItemName.replace(/\s+\d+$/, "").trim();
    const itemExists = items.some((item) => {
      const cleanItemValue = item.value.replace(/\s+\d+$/, "").trim();
      return cleanItemValue.toLowerCase() === baseItemName.toLowerCase();
    });

    if (!itemExists) {
      await addItem(formattedItemName);
      console.log(`Item "${formattedItemName}" adicionado!`);
    } else {
      console.log(`Item similar a "${formattedItemName}" já existe.`);
    }
  }
}
