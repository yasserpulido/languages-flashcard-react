import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import App from "./App.tsx";
import {
  JapaneseProvider,
  FlashcardProvider,
  QuizProvider,
  SettingsProvider,
  UIProvider,
} from "./context";
import { GameOver, Menu, Settings, Playground } from "./pages";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Menu />,
      },
      {
        path: "syllabary-quiz",
        element: <Playground />,
      },
      {
        path: "dictionary-quiz",
        element: <Playground />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "gameover",
        element: <GameOver />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UIProvider>
      <JapaneseProvider>
        <QuizProvider>
          <FlashcardProvider>
            <SettingsProvider>
              <RouterProvider router={router} />
            </SettingsProvider>
          </FlashcardProvider>
        </QuizProvider>
      </JapaneseProvider>
    </UIProvider>
  </React.StrictMode>
);
