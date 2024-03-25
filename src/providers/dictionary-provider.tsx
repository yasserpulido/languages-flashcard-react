import { createContext, useEffect, useState } from "react";
import { Dictionary, Japanese, Syllabary, Syllable } from "../types";

type UserData = {
  syllabary: {
    hiraganaHardCardIds: number[];
    katakanaHardCardIds: number[];
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

type ResponseMessage = {
  show: boolean;
  type: "error" | "success";
  message: string;
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
  responseMessage: ResponseMessage;
  resetResponseMessage: () => void;
  uploadJson: () => void;
  downloadJson: () => void;
  markDifficulty: (id: number, isHard: boolean) => void;
  returnToMenu: () => void;
  startDictionaryQuiz: (quizConfig: DictionaryQuizConfig) => void;
  startSyllabaryQuiz: (quizConfig: SyllabaryQuizConfig) => void;
  toggleFlashcard: () => void;
};

const userDataDefault: UserData = {
  syllabary: {
    hiraganaHardCardIds: [],
    katakanaHardCardIds: [],
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
  responseMessage: {
    show: false,
    type: "success",
    message: "",
  },
  resetResponseMessage: () => {},
  uploadJson: () => {},
  downloadJson: () => {},
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
  const [responseMessage, setResponseMessage] = useState<ResponseMessage>({
    show: false,
    type: "success",
    message: "",
  });
  const [syllabaryQuizConfig, setSyllabaryQuizConfig] =
    useState<SyllabaryQuizConfig | null>(null);

  useEffect(() => {
    const fetchDictorionary = async () => {
      const response = await fetch("/data.json");
      const { languages } = await response.json();

      setJapanese(languages.japanese);

      const categories = languages.japanese.dictionary.flatMap(
        (d: Dictionary) => d.categories
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

        let hardAlreadyMarked;

        if (syllabaryQuizConfig?.syllabary === "hiragana") {
          hardAlreadyMarked = syllabary.hiraganaHardCardIds.includes(id);
        } else {
          hardAlreadyMarked = syllabary.katakanaHardCardIds.includes(id);
        }

        if (isHard && hardAlreadyMarked) {
          return prev;
        }

        if (isHard && !hardAlreadyMarked) {
          if (syllabaryQuizConfig?.syllabary === "hiragana") {
            syllabary.hiraganaHardCardIds.push(id);
          } else {
            syllabary.katakanaHardCardIds.push(id);
          }
        } else {
          if (syllabaryQuizConfig?.syllabary === "hiragana") {
            syllabary.hiraganaHardCardIds =
              syllabary.hiraganaHardCardIds.filter((i) => i !== id);
          } else {
            syllabary.katakanaHardCardIds =
              syllabary.katakanaHardCardIds.filter((i) => i !== id);
          }
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
        syllabary === "hiragana"
          ? userData.syllabary.hiraganaHardCardIds
          : userData.syllabary.katakanaHardCardIds;

      result = result.filter((r) => hardIds.includes(r.id));
    }

    setMaze(sort === "random" ? shuffleArray(result) : result);
    setShowMenu(false);
    setIsDictionaryQuiz(false);
    setIsWritingQuiz(quizConfig.writing || false);
    setSyllabaryQuizConfig(quizConfig);
  };

  const startDictionaryQuiz = (quizConfig: DictionaryQuizConfig) => {
    if (!japanese) return;

    const { logographic, category, onlyHard } = quizConfig;

    const dictionaryList =
      category === "All"
        ? japanese.dictionary
        : japanese.dictionary.filter((d) => d.categories.includes(category));

    console.log(dictionaryList);

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

  const isValidUserData = (obj: unknown): obj is UserData => {
    const hasRequiredProps = (o: object): o is UserData =>
      "syllabary" in o &&
      "dictionary" in o &&
      "lastPlayed" in o &&
      typeof o["syllabary"] === "object" &&
      typeof o["dictionary"] === "object" &&
      typeof o["lastPlayed"] === "string";

    const hasValidSyllabary = (o: UserData) =>
      Array.isArray(o.syllabary.hiraganaHardCardIds) &&
      o.syllabary.hiraganaHardCardIds.every((id) => typeof id === "number") &&
      Array.isArray(o.syllabary.katakanaHardCardIds) &&
      o.syllabary.katakanaHardCardIds.every((id) => typeof id === "number");

    const hasValidDictionary = (o: UserData) =>
      Array.isArray(o.dictionary.hardCardsId) &&
      o.dictionary.hardCardsId.every((id) => typeof id === "number");

    return (
      obj !== null &&
      typeof obj === "object" &&
      hasRequiredProps(obj) &&
      hasValidSyllabary(obj) &&
      hasValidDictionary(obj)
    );
  };

  const downloadJson = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(userData)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "userData.json";
    document.body.appendChild(element);
    element.click();
  };

  const uploadJson = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    fileInput.click();

    fileInput.onchange = (event) => {
      const input = event.target as HTMLInputElement;

      if (input && input.files) {
        const file = input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result;

            try {
              const parsed = JSON.parse(content as string);

              if (isValidUserData(parsed)) {
                setUserData(parsed);
                localStorage.setItem("userData", JSON.stringify(parsed));
                setResponseMessage({
                  show: true,
                  type: "success",
                  message: "Progress data uploaded successfully.",
                });
              } else {
                setResponseMessage({
                  show: true,
                  type: "error",
                  message:
                    "The content of the file is not a valid progress data JSON.",
                });
              }
            } catch (error) {
              setResponseMessage({
                show: true,
                type: "error",
                message: "Error parsing the uploaded file.",
              });
            }
          };
          reader.readAsText(file);
        }
      }
    };
  };

  const resetResponseMessage = () => {
    setResponseMessage({
      show: false,
      type: "success",
      message: "",
    });
  };

  return (
    <DictionaryContext.Provider
      value={{
        currentFlashcard: maze[0],
        dictionary: japanese?.dictionary || [],
        dictionaryCategories,
        isDictionaryQuiz,
        isWritingQuiz,
        showFlashcard,
        showMenu,
        stats,
        syllabary: japanese?.syllabary || { hiragana: [], katakana: [] },
        userData,
        responseMessage,
        resetResponseMessage,
        downloadJson,
        markDifficulty,
        returnToMenu,
        startDictionaryQuiz,
        startSyllabaryQuiz,
        toggleFlashcard,
        uploadJson,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};

export default DictionaryProvider;
