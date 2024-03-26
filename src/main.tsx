import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import App from "./App.tsx";
import {
  DictionaryProvider,
  FlashcardProvider,
  QuizProvider,
  SettingsProvider,
  UIProvider,
  UserDataProvider,
} from "./context";
import { GameOver, Menu, SyllabaryQuiz, DictionaryQuiz, Settings } from "./pages";

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
        element: <SyllabaryQuiz />,
      },
      {
        path: "dictionary-quiz",
        element: <DictionaryQuiz />,
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
    <DictionaryProvider>
      <UserDataProvider>
        <UIProvider>
          <QuizProvider>
            <FlashcardProvider>
              <SettingsProvider>
                <RouterProvider router={router} />
              </SettingsProvider>
            </FlashcardProvider>
          </QuizProvider>
        </UIProvider>
      </UserDataProvider>
    </DictionaryProvider>
  </React.StrictMode>
);
