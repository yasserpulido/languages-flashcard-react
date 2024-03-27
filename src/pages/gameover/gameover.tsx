import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components";
import { useFlashcard, useJapenese, useQuiz } from "../../hooks";

const GameOver = () => {
  const navigate = useNavigate();
  const { storeUserDataWhenQuizEnds } = useJapenese();
  const { resetFlashcardContext, flashcardMarked } = useFlashcard();
  const {
    quizState,
    resetQuizContext,
    syllabaryQuizConfig,
    dictionaryQuizConfig,
  } = useQuiz();

  const totalEasy =
    flashcardMarked.syllabary.hiragana.easy.length +
    flashcardMarked.syllabary.katakana.easy.length +
    flashcardMarked.dictionary.easy.length;
  const totalHard =
    flashcardMarked.syllabary.hiragana.hard.length +
    flashcardMarked.syllabary.katakana.hard.length +
    flashcardMarked.dictionary.hard.length;

  let isOnlyHardFlashcards = false;

  if (syllabaryQuizConfig) {
    isOnlyHardFlashcards = syllabaryQuizConfig.onlyHard;
  } else if (dictionaryQuizConfig) {
    isOnlyHardFlashcards = dictionaryQuizConfig.onlyHard;
  }

  useEffect(() => {
    const { ended, started } = quizState;

    if (!started && !ended) {
      navigate("/");
    }
  }, [navigate, quizState]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center gap-4">
        <span className="text-2xl font-bold text-gray-800">
          Hard: {totalHard}
        </span>
        <span className="text-2xl font-bold text-gray-800">
          Easy: {totalEasy}
        </span>
      </div>
      <h1 className="text-4xl font-bold text-gray-800">Quiz Complete!</h1>
      <div className="flex justify-center">
        <Button
          onClick={() => {
            storeUserDataWhenQuizEnds(flashcardMarked, isOnlyHardFlashcards);
            resetFlashcardContext();
            resetQuizContext();
            navigate("/");
          }}
          color="success"
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default GameOver;
