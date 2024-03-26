import { createContext, useEffect, useState } from "react";
import {
  Dictionary,
  DictionaryContextType,
  Japanese,
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

export const DictionaryContext = createContext<
  DictionaryContextType | undefined
>(undefined);

type DictionaryProviderProps = {
  children: React.ReactNode;
};

export const DictionaryProvider = ({ children }: DictionaryProviderProps) => {
  const [japanese, setJapanese] = useState<Japanese | null>(null);
  const [userData, setUserData] = useState<UserData>(userDataDefault);
  const [dictionaryCategories, setDictionaryCategories] = useState<string[]>(
    []
  );

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

  return (
    <DictionaryContext.Provider
      value={{
        dictionaryCategories,
        userData,
        dictionaryData: japanese?.dictionary || [],
        syllabaryData: japanese?.syllabary || { hiragana: [], katakana: [] },
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};
