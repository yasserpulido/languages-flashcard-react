import React, { createContext, useCallback, useMemo } from "react";

import { UserData } from "../types";
import { useJapenese, useUI } from "../hooks";

type SettingsContextType = {
  downloadJson: () => void;
  uploadJson: () => void;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const SettingsProvider = ({ children }: Props) => {
  const { userData, storeUserData } = useJapenese();
  const { setResponseMessage } = useUI();

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

  const downloadJson = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(userData)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "userData.json";
    document.body.appendChild(element);
    element.click();
  }, [userData]);

  const uploadJson = useCallback(() => {
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
                storeUserData(parsed);
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
  }, [setResponseMessage, storeUserData]);

  const value = useMemo(
    () => ({
      downloadJson,
      uploadJson,
    }),
    [downloadJson, uploadJson]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
