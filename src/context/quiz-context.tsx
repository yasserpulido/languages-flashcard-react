import React, { createContext, useState, useCallback, useMemo } from "react";
import {
  Dictionary,
  DictionaryQuizConfig,
  SyllabaryQuizConfig,
  Syllable,
} from "../types";
import { useDictionary } from "../hooks";
import { shuffleArray } from "../utils";

type QuizContextType = {
  isDictionaryQuiz: boolean;
  isWritingQuiz: boolean;
  maze: Dictionary[] | Syllable[];
  quizEnded: boolean;
  quizStarted: boolean;
  showRomaji: boolean;
  syllabaryQuizConfig: SyllabaryQuizConfig | null;
  setIsDictionaryQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWritingQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  setMaze: React.Dispatch<React.SetStateAction<Dictionary[] | Syllable[]>>;
  setQuizStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setQuizEnded: React.Dispatch<React.SetStateAction<boolean>>;
  startDictionaryQuiz: (config: DictionaryQuizConfig) => void;
  startSyllabaryQuiz: (config: SyllabaryQuizConfig) => void;
};

export const QuizContext = createContext<QuizContextType | undefined>(
  undefined
);

type QuizProviderProps = {
  children: React.ReactNode;
};

export const QuizProvider = ({ children }: QuizProviderProps) => {
  const { dictionaryData, syllabaryData, userData } = useDictionary();

  const [maze, setMaze] = useState<Dictionary[] | Syllable[]>([]);
  const [showRomaji, setShowRomaji] = useState(false);
  const [syllabaryQuizConfig, setSyllabaryQuizConfig] =
    useState<SyllabaryQuizConfig | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [isDictionaryQuiz, setIsDictionaryQuiz] = useState(false);
  const [isWritingQuiz, setIsWritingQuiz] = useState(false);

  const startDictionaryQuiz = useCallback(
    (quizConfig: DictionaryQuizConfig) => {
      if (!dictionaryData || !syllabaryData) {
        return;
      }

      const { logographic, category, onlyHard, showRomaji } = quizConfig;

      const filteredDictionaryList = dictionaryData.filter(
        (d) =>
          d.logographic === logographic &&
          (category === "All" || d.categories.includes(category)) &&
          (!onlyHard || userData.dictionary.hardCardsId.includes(d.id))
      );

      setMaze(shuffleArray(filteredDictionaryList));
      setShowRomaji(showRomaji);
      setQuizStarted(true);
      setIsDictionaryQuiz(true);
    },
    [dictionaryData, syllabaryData, userData.dictionary.hardCardsId]
  );

  const startSyllabaryQuiz = useCallback(
    (quizConfig: SyllabaryQuizConfig) => {
      const { syllabary, group, sort, onlyHard, writing } = quizConfig;

      const syllabaryList =
        syllabary === "hiragana"
          ? syllabaryData.hiragana
          : syllabaryData.katakana;

      if (!syllabaryList) return;

      let filteredList =
        group === "all"
          ? syllabaryList
          : syllabaryList.filter((s) => s.type === group.toLowerCase());

      if (onlyHard) {
        const hardIds =
          syllabary === "hiragana"
            ? userData.syllabary.hiraganaHardCardIds
            : userData.syllabary.katakanaHardCardIds;

        filteredList = filteredList.filter((r) => hardIds.includes(r.id));
      }

      const finalList =
        sort === "random" ? shuffleArray(filteredList) : filteredList;

      setMaze(finalList);
      setSyllabaryQuizConfig(quizConfig);
      setQuizStarted(true);
      setIsWritingQuiz(writing);
    },
    [
      syllabaryData.hiragana,
      syllabaryData.katakana,
      userData.syllabary.hiraganaHardCardIds,
      userData.syllabary.katakanaHardCardIds,
    ]
  );

  const value = useMemo(
    () => ({
      isDictionaryQuiz,
      isWritingQuiz,
      maze,
      quizEnded,
      quizStarted,
      showRomaji,
      syllabaryQuizConfig,
      setIsDictionaryQuiz,
      setIsWritingQuiz,
      setMaze,
      setQuizEnded,
      setQuizStarted,
      startDictionaryQuiz,
      startSyllabaryQuiz,
    }),
    [
      isDictionaryQuiz,
      isWritingQuiz,
      maze,
      quizEnded,
      quizStarted,
      showRomaji,
      startDictionaryQuiz,
      startSyllabaryQuiz,
      syllabaryQuizConfig,
    ]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
