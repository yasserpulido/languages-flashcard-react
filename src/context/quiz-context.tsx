import React, { createContext, useState, useCallback, useMemo } from "react";

import {
  Dictionary,
  DictionaryQuizConfig,
  QuizState,
  SyllabaryQuizConfig,
  Syllable,
} from "../types";
import { shuffleArray } from "../utils";
import { useJapenese } from "../hooks";

type QuizContextType = {
  dictionaryQuizConfig: DictionaryQuizConfig | null;
  maze: Dictionary[] | Syllable[];
  quizState: QuizState;
  syllabaryQuizConfig: SyllabaryQuizConfig | null;
  startDictionaryQuiz: (config: DictionaryQuizConfig) => void;
  startSyllabaryQuiz: (config: SyllabaryQuizConfig) => void;
  removeFlashcardFromMaze: (id: number) => void;
  resetQuizContext: () => void;
};

export const QuizContext = createContext<QuizContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const QuizProvider = ({ children }: Props) => {
  const { dictionaryData, syllabaryData, userData } = useJapenese();

  const [syllabaryQuizConfig, setSyllabaryQuizConfig] =
    useState<SyllabaryQuizConfig | null>(null);
  const [dictionaryQuizConfig, setDictionaryQuizConfig] =
    useState<DictionaryQuizConfig | null>(null);

  const [maze, setMaze] = useState<Dictionary[] | Syllable[]>([]);

  const [quizState, setQuizState] = useState({
    started: false,
    ended: false,
  });

  const startDictionaryQuiz = useCallback(
    (quizConfig: DictionaryQuizConfig) => {
      if (!dictionaryData || !syllabaryData) {
        return;
      }

      const { logographic, category, onlyHard } = quizConfig;

      const filteredDictionaryList = dictionaryData.filter(
        (d) =>
          d.logographic === logographic &&
          (category === "All" || d.categories.includes(category)) &&
          (!onlyHard || userData.dictionary.hardCardsId.includes(d.id))
      );

      setMaze(shuffleArray(filteredDictionaryList));
      setDictionaryQuizConfig(quizConfig);
      setQuizState({ started: true, ended: false });
    },
    [dictionaryData, syllabaryData, userData.dictionary.hardCardsId]
  );

  const startSyllabaryQuiz = useCallback(
    (quizConfig: SyllabaryQuizConfig) => {
      const { syllabary, group, sort, onlyHard } = quizConfig;

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
      setQuizState({ started: true, ended: false });
    },
    [
      syllabaryData.hiragana,
      syllabaryData.katakana,
      userData.syllabary.hiraganaHardCardIds,
      userData.syllabary.katakanaHardCardIds,
    ]
  );

  const removeFlashcardFromMaze = useCallback(
    (id: number) => {
      const isLastItem = maze.length === 1;

      if (isLastItem) {
        setQuizState({ started: false, ended: true });
        setMaze([]);
        return;
      }

      setMaze(
        (prev) =>
          prev.filter((item) => item.id !== id) as Dictionary[] | Syllable[]
      );
    },
    [setMaze, maze]
  );

  const resetQuizContext = useCallback(() => {
    setDictionaryQuizConfig(null);
    setSyllabaryQuizConfig(null);
    setMaze([]);
    setQuizState({ started: false, ended: false });
  }, []);

  const value = useMemo(
    () => ({
      dictionaryQuizConfig,
      maze,
      quizState,
      syllabaryQuizConfig,
      removeFlashcardFromMaze,
      resetQuizContext,
      startDictionaryQuiz,
      startSyllabaryQuiz,
    }),
    [
      dictionaryQuizConfig,
      maze,
      quizState,
      syllabaryQuizConfig,
      removeFlashcardFromMaze,
      resetQuizContext,
      startDictionaryQuiz,
      startSyllabaryQuiz,
    ]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
