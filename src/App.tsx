import { Control, Flashcard } from "./components";
import { useDictionary } from "./hooks/use-dictionary";

function App() {
  const { currentFlashcard, stats, showMenu, startQuiz, returnToMenu } = useDictionary();

  return (
    <div className="min-h-screen flex flex-col gap-8 justify-center items-center bg-gray-200">
      {showMenu ? (
        <>
          <h1 className="text-4xl font-bold text-gray-800">
            Japanese Flashcards
          </h1>

          <button
            onClick={startQuiz}
            className="bg-blue-500 hover:bg-blue-400 text-base text-white px-4 py-1 rounded font-bold shadow-sm shadow-black animate-fade-up"
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
            <h1 className="text-4xl font-bold text-gray-800">Quiz Complete!</h1>
          )}
          <button onClick={returnToMenu} className="text-base text-black">
            Return to Menu
          </button>
        </>
      )}
    </div>
  );
}

export default App;
