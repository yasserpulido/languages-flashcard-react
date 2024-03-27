import { createContext, useEffect, useState } from "react";
import {
  Dictionary,
  FlashcardMarked,
  Japanese,
  Syllabary,
  UserData,
} from "../types";

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

type DictionaryContextType = {
  dictionaryCategories: string[];
  userData: UserData;
  dictionaryData: Dictionary[];
  syllabaryData: Syllabary;
  storeUserData: (data: UserData) => void;
  storeUserDataWhenQuizEnds: (
    flashcardMarked: FlashcardMarked,
    isOnlyHardFlashcards: boolean
  ) => void;
};

export const JapaneseContext = createContext<DictionaryContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const JapaneseProvider = ({ children }: Props) => {
  const [japanese, setJapanese] = useState<Japanese | null>(null);
  const [dictionaryCategories, setDictionaryCategories] = useState<string[]>(
    []
  );

  const getInitialUserData = () => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : userDataDefault;
  };

  const [userData, setUserData] = useState<UserData>(getInitialUserData);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    const fetchDictorionary = async () => {
      const response = await fetch("/data.json");
      const { japanese } = await response.json();

      setJapanese(japanese);

      const dictionary = japanese.dictionary;

      getDictionaryCategories(dictionary);
    };

    fetchDictorionary();
  }, []);

  const getDictionaryCategories = (dictionary: Dictionary[]) => {
    const categories = dictionary.flatMap((d: Dictionary) => d.categories);

    const uniqueCategories = Array.from(new Set(categories));

    setDictionaryCategories(uniqueCategories as string[]);
  };

  const storeUserDataWhenQuizEnds = (
    flashcardMarked: FlashcardMarked,
    isOnlyHardFlashcards: boolean
  ) => {
    const lastPlayed = new Date().toLocaleString();

    setUserData((prev) => {
      let hiraganaHardCardIds = prev.syllabary.hiraganaHardCardIds.filter(
        (id) => !flashcardMarked.syllabary.hiragana.easy.includes(id)
      );
      let katakanaHardCardIds = prev.syllabary.katakanaHardCardIds.filter(
        (id) => !flashcardMarked.syllabary.katakana.easy.includes(id)
      );
      let hardCardsId = prev.dictionary.hardCardsId.filter(
        (id) => !flashcardMarked.dictionary.easy.includes(id)
      );

      if (
        !isOnlyHardFlashcards ||
        flashcardMarked.syllabary.hiragana.hard.length > 0 ||
        flashcardMarked.syllabary.katakana.hard.length > 0 ||
        flashcardMarked.dictionary.hard.length > 0
      ) {
        const updateHardIds = (currentIds: number[], newHardIds: number[]) =>
          Array.from(new Set([...currentIds, ...newHardIds]));

        hiraganaHardCardIds = updateHardIds(
          hiraganaHardCardIds,
          flashcardMarked.syllabary.hiragana.hard
        );
        katakanaHardCardIds = updateHardIds(
          katakanaHardCardIds,
          flashcardMarked.syllabary.katakana.hard
        );
        hardCardsId = updateHardIds(
          hardCardsId,
          flashcardMarked.dictionary.hard
        );
      }

      return {
        ...prev,
        syllabary: {
          ...prev.syllabary,
          hiraganaHardCardIds,
          katakanaHardCardIds,
        },
        dictionary: {
          ...prev.dictionary,
          hardCardsId,
        },
        lastPlayed: lastPlayed,
      };
    });
  };

  const storeUserData = (data: UserData) => {
    setUserData(data);
  };

  return (
    <JapaneseContext.Provider
      value={{
        dictionaryCategories,
        userData,
        dictionaryData: japanese?.dictionary || [],
        syllabaryData: japanese?.syllabary || { hiragana: [], katakana: [] },
        storeUserData,
        storeUserDataWhenQuizEnds,
      }}
    >
      {children}
    </JapaneseContext.Provider>
  );
};
