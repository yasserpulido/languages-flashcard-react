import { Control, Flashcard } from "./components";
import { useDictionary } from "./hooks/use-dictionary";

function App() {
  const { currentFlashcard } = useDictionary();

  if (!currentFlashcard) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col gap-8 justify-center items-center bg-gray-200">
      <Flashcard flashcard={currentFlashcard} />
      <Control />
    </div>
  );
}

export default App;
