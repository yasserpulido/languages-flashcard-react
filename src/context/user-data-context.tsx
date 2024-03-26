import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";

import { UserData } from "../types";

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

type UserDataContextType = {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  setUserDataAndStore: () => void;
};

export const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

type UserDataProviderProps = {
  children: React.ReactNode;
};

export const UserDataProvider = ({ children }: UserDataProviderProps) => {
  const [userData, setUserData] = useState(userDataDefault);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const setUserDataAndStore = useCallback(() => {
    const lastPlayed = new Date().toLocaleString();

    setUserData((prev) => ({
      ...prev,
      lastPlayed: lastPlayed,
    }));

    localStorage.setItem(
      "userData",
      JSON.stringify({ ...userData, lastPlayed })
    );
  }, [userData]);

  const value = useMemo(
    () => ({ userData, setUserData, setUserDataAndStore }),
    [setUserDataAndStore, userData]
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
