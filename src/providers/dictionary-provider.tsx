import { createContext, useEffect, useState } from "react";
import { Dictionary, Japanese, Syllabary, Syllable } from "../types";

type Stats = {
  easy: number[];
  hard: number[];
};

type SyllabaryQuizConfig = {
  syllabary: string;
  group: string;
  sort: string;
  writing: boolean;
};

type DictionaryQuizConfig = {
  logographic: string;
  category: string;
};

type DictionaryContextType = {
  currentFlashcard: Dictionary | Syllable | null;
  dictionaryCategories: string[];
  isDictionaryQuiz: boolean;
  isWritingQuiz: boolean;
  showFlashcard: boolean;
  showMenu: boolean;
  stats: Stats;
  markEasy: (id: number) => void;
  markHard: (id: number) => void;
  resetQuiz: () => void;
  returnToMenu: () => void;
  startDictionaryQuiz: (quizConfig: DictionaryQuizConfig) => void;
  startSyllabaryQuiz: (quizConfig: SyllabaryQuizConfig) => void;
  toggleFlashcard: () => void;
};

export const DictionaryContext = createContext<DictionaryContextType>({
  currentFlashcard: null,
  dictionaryCategories: [],
  isDictionaryQuiz: false,
  isWritingQuiz: false,
  showFlashcard: false,
  showMenu: false,
  stats: {
    easy: [],
    hard: [],
  },
  markEasy: () => {},
  markHard: () => {},
  resetQuiz: () => {},
  returnToMenu: () => {},
  startDictionaryQuiz: () => {},
  startSyllabaryQuiz: () => {},
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
  const [syllabaryQuizConfig, setSyllabaryQuizConfig] =
    useState<SyllabaryQuizConfig | null>(null);
  const [dictionaryQuizConfig, setDictionaryQuizConfig] =
    useState<DictionaryQuizConfig | null>(null);
  const [dictionaryCategories, setDictionaryCategories] = useState<string[]>(
    []
  );

  useEffect(() => {
    const fetchDictorionary = async () => {
      const response = await fetch("/data.json");
      const { languages } = await response.json();

      setJapanese(languages.japanese);

      const categories = languages.japanese.dictionary.map(
        (d: Dictionary) => d.category
      );

      const uniqueCategories = Array.from(new Set(categories));

      setDictionaryCategories(uniqueCategories as string[]);
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

  const startSyllabaryQuiz = (quizConfig: SyllabaryQuizConfig) => {
    setSyllabaryQuizConfig(quizConfig);

    const { syllabary, group, sort } = quizConfig;

    const syllabaryList = japanese?.syllabary
      .map((s) => s[syllabary as keyof Syllabary])
      .flat();

    if (!syllabaryList) return;

    const result =
      group === "all"
        ? syllabaryList
        : syllabaryList.filter((s) => s.type === group.toLowerCase());

    setMaze(sort === "random" ? shuffleArray(result) : result);
    setStats({ easy: [], hard: [] });
    setShowMenu(false);
    setIsDictionaryQuiz(false);
    setIsWritingQuiz(quizConfig.writing || false);
  };

  const startDictionaryQuiz = (quizConfig: DictionaryQuizConfig) => {
    setDictionaryQuizConfig(quizConfig);

    if (!japanese) return;

    const { logographic, category } = quizConfig;

    const dictionaryList =
      category === "All"
        ? japanese.dictionary
        : japanese.dictionary.filter((d) => d.category === category);

    const result = dictionaryList.filter((d) => d.logographic === logographic);

    setMaze(shuffleArray(result));
    setStats({ easy: [], hard: [] });
    setShowMenu(false);
    setIsDictionaryQuiz(true);
    setIsWritingQuiz(false);
  };

  const returnToMenu = () => {
    setMaze([]);
    setShowMenu(true);
    setIsDictionaryQuiz(false);
    setIsWritingQuiz(false);
    setShowFlashcard(false);
    setStats({ easy: [], hard: [] });
    setDictionaryQuizConfig(null);
    setSyllabaryQuizConfig(null);
  };

  const resetQuiz = () => {
    if (isDictionaryQuiz) {
      startDictionaryQuiz(dictionaryQuizConfig as DictionaryQuizConfig);
    } else if (syllabaryQuizConfig) {
      startSyllabaryQuiz(syllabaryQuizConfig);
    }
  };

  return (
    <DictionaryContext.Provider
      value={{
        currentFlashcard: maze[0],
        dictionaryCategories,
        isDictionaryQuiz,
        isWritingQuiz,
        showFlashcard,
        showMenu,
        stats,
        markEasy,
        markHard,
        resetQuiz,
        returnToMenu,
        startDictionaryQuiz,
        startSyllabaryQuiz,
        toggleFlashcard,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};

export default DictionaryProvider;
