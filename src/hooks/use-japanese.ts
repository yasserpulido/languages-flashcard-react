import { useContext } from "react";
import { JapaneseContext } from "../context";

export const useJapenese = () => {
  const context = useContext(JapaneseContext);

  if (!context) {
    throw new Error("useJapenese must be used within a JapeneseProvider");
  }

  return context;
};
