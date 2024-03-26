import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

import { Dictionary, Stats, Syllable } from "../types";
import { useQuiz, useUserData } from "../hooks";

type FlashcardContextType = {
  currentFlashcard: Dictionary | Syllable | null;
  showFlashcard: boolean;
  stats: Stats;
  markDifficulty: (id: number, isHard: boolean) => void;
  returnToMenu: () => void;
  setShowFlashcard: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined
);

type FlashcardProviderProps = {
  children: React.ReactNode;
};

export const FlashcardProvider = ({ children }: FlashcardProviderProps) => {
  const { setUserData } = useUserData();
  const {
    maze,
    setMaze,
    setIsDictionaryQuiz,
    setIsWritingQuiz,
    isDictionaryQuiz,
    syllabaryQuizConfig,
    quizStarted,
    setQuizEnded,
    setQuizStarted,
  } = useQuiz();

  const [showFlashcard, setShowFlashcard] = useState(false);
  const [stats, setStats] = useState<Stats>({
    easy: [],
    hard: [],
  });

  useEffect(() => {
    if (quizStarted && maze.length === 0) {
      setQuizEnded(true);
    }
  }, [maze.length, setQuizEnded, quizStarted]);

  const markDifficulty = useCallback(
    (id: number, isHard: boolean) => {
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
    },
    [isDictionaryQuiz, setMaze, setUserData, syllabaryQuizConfig]
  );

  const returnToMenu = useCallback(() => {
    setMaze([]);
    setStats({
      easy: [],
      hard: [],
    });
    setIsDictionaryQuiz(false);
    setIsWritingQuiz(false);
    setShowFlashcard(false);
    setQuizEnded(false);
    setQuizStarted(false);
  }, [
    setIsDictionaryQuiz,
    setIsWritingQuiz,
    setMaze,
    setQuizEnded,
    setQuizStarted,
  ]);

  const value = useMemo(
    () => ({
      currentFlashcard: maze[0] || null,
      showFlashcard,
      stats,
      markDifficulty,
      setShowFlashcard,
      returnToMenu,
    }),
    [markDifficulty, maze, returnToMenu, showFlashcard, stats]
  );

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};
