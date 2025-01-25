import { useCallback, useRef, useState } from "react";

// Define interfaces for TypeScript type safety
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: { transcript: string };
}

interface WebkitSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

// Declare global WebkitSpeechRecognition for browser compatibility
declare global {
  interface Window {
    webkitSpeechRecognition: new () => WebkitSpeechRecognition;
  }
}

export function useVoiceRecognition(
  onTranscript?: (transcript: string) => void
): [boolean, () => void] {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<WebkitSpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startVoiceRecognition = useCallback(() => {
    if (isListening) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = "pt-BR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.trim();

        // Call the optional callback if provided
        if (onTranscript) {
          onTranscript(transcript);
        }
      };

      recognition.onerror = (event: ErrorEvent) => {
        console.error("Erro no reconhecimento de voz:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        timeoutRef.current = setTimeout(() => {
          setIsListening(false);
          recognitionRef.current = null;
        }, 1000);
      };

      recognition.start();
    } else {
      alert("Reconhecimento de voz não suportado");
    }
  }, [isListening, onTranscript]);

  return [isListening, startVoiceRecognition];
}
