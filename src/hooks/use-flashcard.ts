import { useContext } from "react";
import { FlashcardContext } from "../context";

export const useFlashcard = () => {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error("useFlashcard must be used within a FlashcardProvider");
  }
  return context;
};
