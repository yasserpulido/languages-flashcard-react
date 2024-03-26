import { useFlashcard, useQuiz } from "../../../hooks";
import { Dictionary, Syllable } from "../../../types";

const FrontCard = () => {
  const { showRomaji, isDictionaryQuiz, isWritingQuiz } = useQuiz();
  const { currentFlashcard } = useFlashcard();

  const classes = isDictionaryQuiz || isWritingQuiz ? "text-xl" : "text-6xl";

  const handleFlashcardTop = () => {
    if (isDictionaryQuiz) {
      return (currentFlashcard as Dictionary).word;
    } else if (isWritingQuiz) {
      return (currentFlashcard as Syllable).romaji;
    } else {
      return (currentFlashcard as Syllable).kana;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <span className={`font-bold text-black ${classes} text-center`}>
        {handleFlashcardTop()}
      </span>
      {isDictionaryQuiz && showRomaji && (
        <span className="text-center text-gray-600 text-sm">
          ({(currentFlashcard as Dictionary).romaji})
        </span>
      )}
    </div>
  );
};

export default FrontCard;
