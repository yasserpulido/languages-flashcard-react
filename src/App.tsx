import { useRef } from "react";
import { Control, DictionaryQuizConfig, Flashcard } from "./components";
import { SyllabaryQuizConfig } from "./components/syllabary-quiz-config";
import { useDictionary } from "./hooks/use-dictionary";
import { ModalMethods } from "./types";

function App() {
  const syllabaryQuizConfigModal = useRef<ModalMethods>(null);
  const dictionaryQuizConfigModal = useRef<ModalMethods>(null);

  const {
    currentFlashcard,
    stats,
    showMenu,
    startQuiz,
    returnToMenu,
    resetQuiz,
  } = useDictionary();

  return (
    <div className="min-h-screen h-full flex flex-col bg-white p-4">
      <SyllabaryQuizConfig ref={syllabaryQuizConfigModal} />
      <DictionaryQuizConfig ref={dictionaryQuizConfigModal} />
      <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
        {showMenu ? (
          <>
            <div className="w-32 h-32 bg-red-500 rounded-full relative animate-fade-down"></div>
            <h1 className="text-4xl font-bold text-gray-800 text-center">
              Japanese Flashcards
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (syllabaryQuizConfigModal.current) {
                    syllabaryQuizConfigModal.current.open();
                  }
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-1 rounded font-bold shadow-sm shadow-black animate-fade-up"
              >
                Syllabary Quiz
              </button>
              <button
                onClick={() => {
                  if (dictionaryQuizConfigModal.current) {
                    dictionaryQuizConfigModal.current.open();
                  }
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-1 rounded font-bold shadow-sm shadow-black animate-fade-up"
              >
                Dictionary Quiz
              </button>
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
            {currentFlashcard ? (
              <>
                <Flashcard currentFlashcard={currentFlashcard} />
                <Control />
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-gray-800">
                  Quiz Complete!
                </h1>
                <button
                  onClick={resetQuiz}
                  className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-1 rounded font-bold shadow-sm shadow-black"
                >
                  Reset Quiz
                </button>
              </>
            )}

            <button onClick={returnToMenu} className="text-base text-black">
              Return to Menu
            </button>
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
