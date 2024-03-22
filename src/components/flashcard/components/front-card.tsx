import { useDictionary } from "../../../hooks";
import { Dictionary, Syllable } from "../../../types";

const FrontCard = () => {
  const { currentFlashcard, isDictionaryQuiz, isWritingQuiz } = useDictionary();

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
    <span className={`font-bold text-black ${classes} text-center`}>
      {handleFlashcardTop()}
    </span>
  );
};

export default FrontCard;
