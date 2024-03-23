import { createContext, useEffect, useState } from "react";
import { Dictionary, Japanese, Syllabary, Syllable } from "../types";

type UserData = {
  syllabary: {
    hiraganaHardCardIds: number[];
  };
  dictionary: {
    hardCardsId: number[];
  };
  lastPlayed: string;
};

type Stats = {
  easy: number[];
  hard: number[];
};

type SyllabaryQuizConfig = {
  syllabary: string;
  group: string;
  sort: string;
  writing: boolean;
  onlyHard: boolean;
};

type DictionaryQuizConfig = {
  logographic: string;
  category: string;
  onlyHard: boolean;
};

type DictionaryContextType = {
  currentFlashcard: Dictionary | Syllable | null;
  dictionaryCategories: string[];
  isDictionaryQuiz: boolean;
  isWritingQuiz: boolean;
  showFlashcard: boolean;
  showMenu: boolean;
  stats: Stats;
  userData: UserData;
  dictionary: Dictionary[];
  syllabary: Syllabary;
  markDifficulty: (id: number, isHard: boolean) => void;
  returnToMenu: () => void;
  startDictionaryQuiz: (quizConfig: DictionaryQuizConfig) => void;
  startSyllabaryQuiz: (quizConfig: SyllabaryQuizConfig) => void;
  toggleFlashcard: () => void;
};

const userDataDefault: UserData = {
  syllabary: {
    hiraganaHardCardIds: [],
  },
  dictionary: {
    hardCardsId: [],
  },
  lastPlayed: "",
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
  userData: userDataDefault,
  dictionary: [],
  syllabary: {
    hiragana: [],
    katakana: [],
  },
  markDifficulty: () => {},
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
  const [stats, setStats] = useState<Stats>({
    easy: [],
    hard: [],
  });
  const [userData, setUserData] = useState<UserData>(userDataDefault);
  const [showMenu, setShowMenu] = useState(true);
  const [isDictionaryQuiz, setIsDictionaryQuiz] = useState(false);
  const [isWritingQuiz, setIsWritingQuiz] = useState(false);
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

    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const toggleFlashcard = () => {
    setShowFlashcard((prev) => !prev);
  };

  const markDifficulty = (id: number, isHard: boolean) => {
    setMaze(
      (prevState: Dictionary[] | Syllable[]) =>
        prevState.filter((s) => s.id !== id) as typeof prevState
    );

    setShowFlashcard(false);

    if (isDictionaryQuiz) {
      setUserData((prev) => {
        const { dictionary } = prev;

        const hardAlreadyMarked = dictionary.hardCardsId.includes(id);

        if (isHard && hardAlreadyMarked) {
          return prev;
        }

        if (isHard && !hardAlreadyMarked) {
          return {
            ...prev,
            dictionary: {
              hardCardsId: [...dictionary.hardCardsId, id],
            },
          };
        }

        return {
          ...prev,
          dictionary: {
            hardCardsId: dictionary.hardCardsId.filter((i) => i !== id),
          },
        };
      });
    } else {
      setUserData((prev) => {
        const { syllabary } = prev;

        const hardAlreadyMarked = syllabary.hiraganaHardCardIds.includes(id);

        if (isHard && hardAlreadyMarked) {
          return prev;
        }

        if (isHard && !hardAlreadyMarked) {
          syllabary.hiraganaHardCardIds.push(id);
        } else {
          syllabary.hiraganaHardCardIds = syllabary.hiraganaHardCardIds.filter(
            (i) => i !== id
          );
        }

        return {
          ...prev,
          syllabary: syllabary,
        };
      });
    }

    setStats((prev) => {
      const { easy, hard } = prev;

      return {
        easy: isHard ? easy : [...easy, id],
        hard: isHard ? [...hard, id] : hard,
      };
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
    const { syllabary, group, sort, onlyHard } = quizConfig;

    const syllabaryList =
      syllabary === "hiragana"
        ? japanese?.syllabary.hiragana
        : japanese?.syllabary.katakana;

    if (!syllabaryList) return;

    let result =
      group === "all"
        ? syllabaryList
        : syllabaryList.filter((s) => s.type === group.toLowerCase());

    if (onlyHard) {
      const hardIds =
        syllabary === "hiragana" ? userData.syllabary.hiraganaHardCardIds : [];

      result = result.filter((r) => hardIds.includes(r.id));
    }

    setMaze(sort === "random" ? shuffleArray(result) : result);
    setShowMenu(false);
    setIsDictionaryQuiz(false);
    setIsWritingQuiz(quizConfig.writing || false);
  };

  const startDictionaryQuiz = (quizConfig: DictionaryQuizConfig) => {
    if (!japanese) return;

    const { logographic, category, onlyHard } = quizConfig;

    const dictionaryList =
      category === "All"
        ? japanese.dictionary
        : japanese.dictionary.filter((d) => d.category === category);

    let result = dictionaryList.filter((d) => d.logographic === logographic);

    if (onlyHard) {
      const hardIds = userData.dictionary.hardCardsId;

      result = result.filter((r) => hardIds.includes(r.id));
    }

    setMaze(shuffleArray(result));
    setShowMenu(false);
    setIsDictionaryQuiz(true);
    setIsWritingQuiz(false);
  };

  const returnToMenu = () => {
    if (!maze.length) {
      const lastPlayed = new Date().toLocaleString();

      setUserData((prev) => ({
        ...prev,
        lastPlayed: lastPlayed,
      }));

      localStorage.setItem(
        "userData",
        JSON.stringify({ ...userData, lastPlayed })
      );
    }

    setMaze([]);
    setStats({
      easy: [],
      hard: [],
    });
    setShowMenu(true);
    setIsDictionaryQuiz(false);
    setIsWritingQuiz(false);
    setShowFlashcard(false);
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
        userData,
        dictionary: japanese?.dictionary || [],
        syllabary: japanese?.syllabary || { hiragana: [], katakana: [] },
        markDifficulty,
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
