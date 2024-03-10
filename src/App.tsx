import { Control, Flashcard } from "./components";
import { useDictionary } from "./hooks/use-dictionary";

function App() {
  const { currentFlashcard, stats, showMenu, startQuiz, returnToMenu } =
    useDictionary();

  return (
    <div className="min-h-screen h-full flex flex-col bg-gray-200 p-4">
      <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
        {showMenu ? (
          <>
            <h1 className="text-4xl font-bold text-gray-800 text-center">
              Japanese Flashcards
            </h1>

            <button
              onClick={startQuiz}
              className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-1 rounded font-bold shadow-sm shadow-black animate-fade-up"
            >
              Start Quiz
            </button>
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
                <Flashcard flashcard={currentFlashcard} />
                <Control />
              </>
            ) : (
              <h1 className="text-4xl font-bold text-gray-800">
                Quiz Complete!
              </h1>
            )}
            <button onClick={returnToMenu} className="text-base text-black">
              Return to Menu
            </button>
          </>
        )}
      </div>
      <footer className="mt-auto">
        <p className="text-gray-500 text-sm text-center">
          Created by{" "}
          <a href="https://yasserpulido.com/" target="_blank" rel="noreferrer">
            <span className="hover:text-gray-600">Yasser Pulido</span>
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
