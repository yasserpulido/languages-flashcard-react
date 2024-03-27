import React, { createContext, useState, useCallback, useMemo } from "react";

import { Dictionary, FlashcardMarked, Syllable } from "../types";
import { useQuiz } from "../hooks";

type FlashcardContextType = {
  currentFlashcard: Dictionary | Syllable | null;
  flashcardMarked: FlashcardMarked;
  showFlashcardBack: boolean;
  markFlashcard: (id: number, isHard: boolean) => void;
  setShowFlashcardBack: React.Dispatch<React.SetStateAction<boolean>>;
  resetFlashcardContext: () => void;
};

export const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const FlashcardProvider = ({ children }: Props) => {
  const {
    maze,
    syllabaryQuizConfig,
    dictionaryQuizConfig,
    removeFlashcardFromMaze,
  } = useQuiz();

  const [showFlashcardBack, setShowFlashcardBack] = useState(false);
  const [flashcardMarked, setFlashcardMarked] = useState<FlashcardMarked>({
    dictionary: {
      easy: [],
      hard: [],
    },
    syllabary: {
      hiragana: {
        easy: [],
        hard: [],
      },
      katakana: {
        easy: [],
        hard: [],
      },
    },
  });

  const markFlashcard = useCallback(
    (id: number, isHard: boolean) => {
      removeFlashcardFromMaze(id);

      const isDictionaryQuiz = !!dictionaryQuizConfig;

      setShowFlashcardBack(false);

      if (isDictionaryQuiz) {
        setFlashcardMarked((prev) => {
          const { dictionary } = prev;

          return {
            ...prev,
            dictionary: {
              ...dictionary,
              [isHard ? "hard" : "easy"]: [
                ...dictionary[isHard ? "hard" : "easy"],
                id,
              ],
            },
          };
        });
      } else {
        const isHiragana = syllabaryQuizConfig?.syllabary === "hiragana";

        setFlashcardMarked((prev) => {
          const { syllabary } = prev;

          return {
            ...prev,
            syllabary: {
              ...syllabary,
              [isHiragana ? "hiragana" : "katakana"]: {
                ...syllabary[isHiragana ? "hiragana" : "katakana"],
                [isHard ? "hard" : "easy"]: [
                  ...syllabary[isHiragana ? "hiragana" : "katakana"][
                    isHard ? "hard" : "easy"
                  ],
                  id,
                ],
              },
            },
          };
        });
      }
    },
    [
      dictionaryQuizConfig,
      syllabaryQuizConfig?.syllabary,
      removeFlashcardFromMaze,
    ]
  );

  const resetFlashcardContext = useCallback(() => {
    setFlashcardMarked({
      dictionary: {
        easy: [],
        hard: [],
      },
      syllabary: {
        hiragana: {
          easy: [],
          hard: [],
        },
        katakana: {
          easy: [],
          hard: [],
        },
      },
    });
    setShowFlashcardBack(false);
  }, []);

  const value = useMemo(
    () => ({
      currentFlashcard: maze[0] || null,
      flashcardMarked,
      showFlashcardBack,
      markFlashcard,
      setShowFlashcardBack,
      resetFlashcardContext,
    }),
    [
      flashcardMarked,
      maze,
      showFlashcardBack,
      markFlashcard,
      resetFlashcardContext,
    ]
  );

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};
