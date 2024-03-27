import { useFlashcard, useQuiz } from "../../../hooks";
import { Dictionary, Syllable } from "../../../types";

const BackCard = () => {
  const { syllabaryQuizConfig  } = useQuiz();
  const { currentFlashcard } = useFlashcard();

  const isDictionaryQuiz = !syllabaryQuizConfig;
  
  const isWritingQuiz = syllabaryQuizConfig && syllabaryQuizConfig.writing;

  let classes = "text-base";

  if (!isDictionaryQuiz && !isWritingQuiz) {
    classes = "text-xl";
  } else if (isWritingQuiz) {
    classes = "text-6xl";
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

  return (
    <span className={`text-black text-center ${classes}`}>
      {handleFlashcardBottom()}
    </span>
  );
};

export default BackCard;
