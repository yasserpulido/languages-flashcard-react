import { createContext, useEffect, useState } from "react";
import { Dictionary, Japanese, Syllabary, Syllable } from "../types";

type Stats = {
  easy: number[];
  hard: number[];
};

type Quiz = {
  type: "syllabary" | "dictionary";
  config?: {
    syllabary: string;
    group: string;
    sort: string;
  };
  writing?: boolean;
};

type DictionaryContextType = {
  currentFlashcard: Dictionary | Syllable | null;
  showFlashcard: boolean;
  stats: Stats;
  showMenu: boolean;
  isDictionaryQuiz: boolean;
  isWritingQuiz: boolean;
  returnToMenu: () => void;
  startQuiz: (quizConfig: Quiz) => void;
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
  isDictionaryQuiz: false,
  isWritingQuiz: false,
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
  const [japanese, setJapanese] = useState<Japanese | null>(null);
  const [maze, setMaze] = useState<Dictionary[] | Syllable[]>([]);
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [stats, setStats] = useState<Stats>({ easy: [], hard: [] });
  const [showMenu, setShowMenu] = useState(true);
  const [isDictionaryQuiz, setIsDictionaryQuiz] = useState(false);
  const [isWritingQuiz, setIsWritingQuiz] = useState(false);

  useEffect(() => {
    const fetchDictorionary = async () => {
      const response = await fetch("/data.json");
      const { languages } = await response.json();

      setJapanese(languages.japanese);
    };

    fetchDictorionary();
  }, []);

  const toggleFlashcard = () => {
    setShowFlashcard((prev) => !prev);
  };

  const markEasy = (id: number) => {
    setMaze(
      (prevState: Dictionary[] | Syllable[]) =>
        prevState.filter((s) => s.id !== id) as typeof prevState
    );

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
    setMaze((prevState: Dictionary[] | Syllable[]) => {
      const flashcardIndex = prevState.findIndex(
        (flashcard) => flashcard.id === id
      );

      if (flashcardIndex === -1) return prevState;

      const flashcard = prevState[flashcardIndex];

      return [
        ...prevState.slice(0, flashcardIndex),
        ...prevState.slice(flashcardIndex + 1),
        flashcard,
      ] as typeof prevState;
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

  const shuffleArray = (array: Dictionary[] | Syllable[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  };

  const startQuiz = (quizConfig: Quiz) => {
    const isDictionaryQuiz = quizConfig.type === "dictionary";

    if (!isDictionaryQuiz && quizConfig.config) {
      const { syllabary, group, sort } = quizConfig.config;

      const syllabaryList = japanese?.syllabary
        .map((s) => s[syllabary as keyof Syllabary])
        .flat();

      if (!syllabaryList) return;

      const result =
        group === "ALL"
          ? syllabaryList
          : syllabaryList.filter((s) => s.type === group.toLowerCase());

      setMaze(sort === "random" ? shuffleArray(result) : result);
      setStats({ easy: [], hard: [] });
      setShowMenu(false);
      setIsDictionaryQuiz(false);
      setIsWritingQuiz(quizConfig.writing || false);
    } else {
      if (!japanese) return;

      const dictionaryShuffled = shuffleArray(japanese.dictionary);

      if (dictionaryShuffled.length > 5) {
        dictionaryShuffled.length = 5;
      }

      setMaze(dictionaryShuffled);
      setStats({ easy: [], hard: [] });
      setShowMenu(false);
      setIsDictionaryQuiz(true);
    }
  };

  const returnToMenu = () => {
    setMaze([]);
    setShowMenu(true);
    setIsDictionaryQuiz(false);
    setIsWritingQuiz(false);
  };

  return (
    <DictionaryContext.Provider
      value={{
        currentFlashcard: maze[0],
        showFlashcard,
        stats,
        showMenu,
        isDictionaryQuiz,
        isWritingQuiz,
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
