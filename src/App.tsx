import { useRef } from "react";
import { Control, Flashcard, Modal } from "./components";
import { useDictionary } from "./hooks/use-dictionary";
import { ModalAuthMethods } from "./types";
import { SYLLABARY_GROUP_OPTIONS } from "./constants";

function App() {
  const modal = useRef<ModalAuthMethods>(null);
  const {
    currentFlashcard,
    stats,
    showMenu,
    startQuiz,
    returnToMenu,
    resetQuiz,
  } = useDictionary();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const syllabary = formData.get("syllabary") as string;
    const group = formData.get("group") as string;
    const sort = formData.get("sort") as string;
    const writing = formData.get("writing") !== null;

    startQuiz({
      type: "syllabary",
      config: { syllabary, group, sort },
      writing,
    });

    if (modal.current) {
      modal.current.close();
    }

    form.reset();
  };

  return (
    <div className="min-h-screen h-full flex flex-col bg-white p-4">
      <Modal ref={modal}>
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Syllabary Quiz
        </h1>
        <hr className="my-4" />
        <p className="text-gray-800 text-center">
          Select the correct syllabary and group.
        </p>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="syllabary" className="block text-gray-800">
              Syllabary:
            </label>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="syllabary"
                value="hiragana"
                defaultChecked
              />
              <label className="ml-2">Hiragana</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="syllabary" value="katakana" disabled />
              <label className="ml-2">Katakana</label>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="group" className="block text-gray-800">
              Group:
            </label>
            <select name="group" className="block w-full">
              {SYLLABARY_GROUP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <input type="radio" name="sort" value="ordered" defaultChecked />
              <label className="ml-2">Ordered</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="sort" value="random" />
              <label className="ml-2">Random</label>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <input type="checkbox" name="writing" value="writing" />
              <label className="ml-2" htmlFor="writing">
                {" "}
                Is writing quiz?
              </label>
            </div>
          </div>
          <hr className="my-4" />
          <div className="mt-4 text-right">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-1 rounded font-bold shadow-sm shadow-black"
            >
              Start Quiz
            </button>
          </div>
        </form>
      </Modal>
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
                  if (modal.current) {
                    modal.current.open();
                  }
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-1 rounded font-bold shadow-sm shadow-black animate-fade-up"
              >
                Syllabary Quiz
              </button>
              <button
                onClick={() => startQuiz({ type: "dictionary" })}
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
