import { createContext, useEffect, useState } from "react";
import { Flashcard } from "../types";

type Stats = {
  easy: number[];
  hard: number[];
};

type DictionaryContextType = {
  currentFlashcard: Flashcard | null;
  showFlashcard: boolean;
  stats: Stats;
  showMenu: boolean;
  returnToMenu: () => void;
  startQuiz: () => void;
  markEasy: (id: number) => void;
  markHard: (id: number) => void;
  toggleFlashcard: () => void;
};

export const DictionaryContext = createContext<DictionaryContextType>({
  currentFlashcard: null,
  showFlashcard: false,
  stats: {
    easy: [],
    hard: [],
  },
  showMenu: false,
  returnToMenu: () => {},
  startQuiz: () => {},
  markEasy: () => {},
  markHard: () => {},
  toggleFlashcard: () => {},
});

type DictionaryProviderProps = {
  children: React.ReactNode;
};

const DictionaryProvider = ({ children }: DictionaryProviderProps) => {
  const [dictionary, setDictionary] = useState<Flashcard[]>([]);
  const [maze, setMaze] = useState<Flashcard[]>([]);
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [stats, setStats] = useState<Stats>({ easy: [], hard: [] });
  const [showMenu, setShowMenu] = useState(true);

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

  const markEasy = (id: number) => {
    setMaze((prev) => prev.filter((word) => word.id !== id));
    setShowFlashcard(false);

    setStats((prev) => {
      if (prev.easy.includes(id)) return prev;

      const hardIndex = prev.hard.indexOf(id);

      if (hardIndex !== -1) {
        prev.hard.splice(hardIndex, 1);
      }

      return { ...prev, easy: [...prev.easy, id] };
    });
  };

  const markHard = (id: number) => {
    setMaze((prevState) => {
      const flashcardIndex = prevState.findIndex(
        (flashcard) => flashcard.id === id
      );

      if (flashcardIndex === -1) return prevState;

      const flashcard = prevState[flashcardIndex];

      return [
        ...prevState.slice(0, flashcardIndex),
        ...prevState.slice(flashcardIndex + 1),
        flashcard,
      ];
    });

    setShowFlashcard(false);

    setStats((prev) => {
      if (prev.hard.includes(id)) return prev;

      const easyIndex = prev.easy.indexOf(id);

      if (easyIndex !== -1) {
        prev.easy.splice(easyIndex, 1);
      }

      return { ...prev, hard: [...prev.hard, id] };
    });
  };

  const shuffleArray = (array: Flashcard[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  };

  const startQuiz = () => {
    const dictionaryShuffled = shuffleArray([...dictionary]);

    if (dictionaryShuffled.length > 5) {
      dictionaryShuffled.length = 5;
    }

    setMaze(dictionaryShuffled);
    setStats({ easy: [], hard: [] });
    setShowMenu(false);
  };

  const returnToMenu = () => {
    setMaze([]);
    setShowMenu(true);
  };

  return (
    <DictionaryContext.Provider
      value={{
        currentFlashcard: maze[0],
        showFlashcard,
        stats,
        showMenu,
        returnToMenu,
        startQuiz,
        markEasy,
        markHard,
        toggleFlashcard,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};

export default DictionaryProvider;
