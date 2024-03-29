import React, { createContext, useState, useCallback, useMemo } from "react";

import { ResponseMessage } from "../types";

type UIContextType = {
  responseMessage: ResponseMessage;
  setResponseMessage: (message: ResponseMessage) => void;
  resetResponseMessage: () => void;
};

export const UIContext = createContext<UIContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

export const UIProvider = ({ children }: Props) => {
  const [responseMessage, setResponseMessage] = useState<ResponseMessage>({
    show: false,
    type: "success",
    message: "",
  });

  const resetResponseMessage = useCallback(() => {
    setResponseMessage({ show: false, type: "success", message: "" });
  }, []);

  const value = useMemo(
    () => ({
      responseMessage,
      setResponseMessage,
      resetResponseMessage,
    }),
    [responseMessage, setResponseMessage, resetResponseMessage]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
