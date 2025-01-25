import { useCallback } from "react";
import styles from "./voiceCommandButton.module.css";
import { useVoiceRecognition } from "@/services/VoiceRecognition";
import { processCommand } from "@/controllers/VoiceCommandController";

export function VoiceCommandButton() {
  const handleVoiceCommand = async (transcript: string) => {
    // Process voice command
    console.log("Comando reconhecido:", transcript);
    await processCommand(transcript);
  };

  const [isListening, startVoiceRecognition] =
    useVoiceRecognition(handleVoiceCommand);

  const handleButtonClick = useCallback(
    (event: React.MouseEvent) => {
      // Prevent default and stop propagation
      event.preventDefault();
      event.stopPropagation();

      // Only start if not already listening
      if (!isListening) {
        startVoiceRecognition();
      }
    },
    [startVoiceRecognition, isListening]
  );

  return (
    <button
      onClick={handleButtonClick}
      className={styles.pushButton}
      disabled={isListening}
    >
      {isListening ? "Ouvindo..." : "Acionar comando de voz"}
    </button>
  );
}
