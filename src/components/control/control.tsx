import { useDictionary } from "../../hooks/use-dictionary";

const Control = () => {
  const { toggleFlashcard, currentFlashcard, markEasy, markHard } = useDictionary();

  if (!currentFlashcard) {
    return null;
  }
  
  return (
    <div className="flex flex-col items-center gap-8">
      <button
        onClick={toggleFlashcard}
        className="bg-gray-500 hover:bg-gray-400 text-base text-white px-4 py-1 rounded font-bold shadow-sm shadow-black"
      >
        Show
      </button>
      <div className="flex justify-between items-center gap-8">
        <button
          onClick={() => markHard(currentFlashcard.id)}
          className="bg-red-500 hover:bg-red-400 text-base text-white px-4 py-1 rounded font-bold shadow-sm shadow-black"
        >
          Hard
        </button>
        <button
          onClick={() => markEasy(currentFlashcard.id)}
          className="bg-green-500 hover:bg-green-400 text-base text-white px-4 py-1 rounded font-bold shadow-sm shadow-black "
        >
          Easy
        </button>
      </div>
     
    </div>
  );
};

export default Control;
