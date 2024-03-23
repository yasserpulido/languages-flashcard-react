import { useRef } from "react";
import { CircleInformation } from "grommet-icons";

import {
  Button,
  DictionaryQuizConfig,
  Flashcard,
  Settings,
  SyllabaryQuizConfig,
} from "./components";
import { useDictionary } from "./hooks";
import { ModalMethods } from "./types";

function App() {
  const syllabaryQuizConfigModal = useRef<ModalMethods>(null);
  const dictionaryQuizConfigModal = useRef<ModalMethods>(null);
  const settingsModal = useRef<ModalMethods>(null);

  const { currentFlashcard, showMenu, stats, returnToMenu } = useDictionary();

  return (
    <div className="min-h-screen h-full flex flex-col bg-white p-4 sm:w-2/5 w-full m-auto">
      <SyllabaryQuizConfig ref={syllabaryQuizConfigModal} />
      <DictionaryQuizConfig ref={dictionaryQuizConfigModal} />
      <Settings ref={settingsModal} />
      <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
        {showMenu ? (
          <>
            <div className="w-32 h-32 bg-red-500 rounded-full relative animate-fade-down"></div>
            <h1 className="text-4xl font-bold text-gray-800 text-center">
              Japanese Flashcards
            </h1>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  if (syllabaryQuizConfigModal.current) {
                    syllabaryQuizConfigModal.current.open();
                  }
                }}
                color="primary"
              >
                Syllabary Quiz
              </Button>
              <Button
                onClick={() => {
                  if (dictionaryQuizConfigModal.current) {
                    dictionaryQuizConfigModal.current.open();
                  }
                }}
                color="primary"
              >
                Dictionary Quiz
              </Button>
            </div>
            <button
              onClick={() => {
                if (settingsModal.current) {
                  settingsModal.current.open();
                }
              }}
              className="text-base text-black"
            >
              Settings
            </button>
          </>
        ) : (
          <>
            {currentFlashcard ? (
              <>
                <Flashcard />
                <div className="flex gap-2">
                  <button
                    onClick={returnToMenu}
                    className="text-base text-black"
                  >
                    Return to Menu
                  </button>
                  {currentFlashcard && (
                    <div className="relative flex flex-col items-center group">
                      <CircleInformation size="small" />
                      <div className="absolute bottom-0 mb-6 flex-col items-center hidden group-hover:flex">
                        <span className="relative z-10 p-2 text-xs leading-none text-white bg-black shadow-lg rounded-md w-40">
                          If you go back to the menu, this session will not be
                          saved.
                        </span>
                        <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold text-gray-800">
                    Hard: {stats.hard.length}
                  </span>
                  <span className="text-2xl font-bold text-gray-800">
                    Easy: {stats.easy.length}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-gray-800">
                  Quiz Complete!
                </h1>
                <Button onClick={returnToMenu} color="success">
                  Done
                </Button>
              </>
            )}
          </>
        )}
      </div>
      <footer className="mt-auto">
        <p className="text-gray-500 text-sm text-center">
          Developed with ❤ by{" "}
          <a href="https://yasserpulido.com/" target="_blank" rel="noreferrer">
            <span className="hover:text-gray-600">Yasser Pulido</span>
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
