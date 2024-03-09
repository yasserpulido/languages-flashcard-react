import { createContext, useEffect, useState } from "react";
import { Flashcard } from "../types";

type DictionaryContextType = {
  currentFlashcard: Flashcard | null;
  showFlashcard: boolean;
  goNext: () => void;
  toggleFlashcard: () => void;
};

export const DictionaryContext = createContext<DictionaryContextType>({
  currentFlashcard: null,
  showFlashcard: false,
  goNext: () => {},
  toggleFlashcard: () => {},
});

type DictionaryProviderProps = {
  children: React.ReactNode;
};

const DictionaryProvider = ({ children }: DictionaryProviderProps) => {
  const [dictionary, setDictionary] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFlashcard, setShowFlashcard] = useState(false);

  useEffect(() => {
    const fetchDictorionary = async () => {
      const response = await fetch("/dictionary.json");
      const { japanese } = await response.json();

      setDictionary(japanese);
    };

    fetchDictorionary();
  }, []);

  const toggleFlashcard = () => {
    setShowFlashcard((prev) => !prev);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % dictionary.length);
    setShowFlashcard(false);
  };

  return (
    <DictionaryContext.Provider
      value={{
        currentFlashcard: dictionary[currentIndex],
        showFlashcard,
        goNext,
        toggleFlashcard,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};

export default DictionaryProvider;
