import { useSM2Modified } from "../../hooks";
import { useDictionary } from "../../hooks/use-dictionary";

const Control = () => {
  const { toggleFlashcard, goNext, currentFlashcard } = useDictionary();
  const { EF, interval, lastReviewed, repetitions, update } = useSM2Modified();

  const handleReview = (rating: number) => {
    update(rating);
    // Aquí iría el código para enviar los datos a Firebase
    const wordData = {
      id: currentFlashcard?.id,
      interval,
      EF,
      repetitions,
      lastReviewed: lastReviewed.toISOString(),
    };
    console.log("Guardar en Firebase:", wordData);
    // Imagina que aquí haces una llamada a Firebase para guardar `wordData`
    goNext();
  };

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
          onClick={() => handleReview(0)}
          className="bg-red-500 hover:bg-red-400 text-base text-white px-4 py-1 rounded font-bold shadow-sm shadow-black"
        >
          Hard
        </button>
        <button
          onClick={() => handleReview(1)}
          className="bg-yellow-500 hover:bg-yellow-400 text-base text-white px-4 py-1 rounded font-bold shadow-sm shadow-black"
        >
          Good
        </button>
        <button
          onClick={() => handleReview(2)}
          className="bg-green-500 hover:bg-green-400 text-base text-white px-4 py-1 rounded font-bold shadow-sm shadow-black"
        >
          Easy
        </button>
      </div>
    </div>
  );
};

export default Control;
