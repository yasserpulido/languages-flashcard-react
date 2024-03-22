import { useDictionary } from "../../../hooks";
import { Dictionary, Syllable } from "../../../types";

const BackCard = () => {
  const { currentFlashcard, isWritingQuiz, isDictionaryQuiz } = useDictionary();

  let classes = "text-base"

  if (!isDictionaryQuiz && !isWritingQuiz) {
    classes = "text-xl"
  } else if (isWritingQuiz) {
    classes = "text-6xl"
  }

  const handleFlashcardBottom = () => {
    if (isDictionaryQuiz) {
      return (currentFlashcard as Dictionary).translation;
    } else if (isWritingQuiz) {
      return (currentFlashcard as Syllable).kana;
    } else {
      return (currentFlashcard as Syllable).romaji;
    }
  };

  console.log({ isWritingQuiz, isDictionaryQuiz });

  return (
    <span className={`text-black text-center ${classes}`}>
      {handleFlashcardBottom()}
    </span>
  );
};

export default BackCard;
