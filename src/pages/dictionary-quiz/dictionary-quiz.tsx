import { useEffect } from "react";

import { useQuiz } from "../../hooks";
import { DictionaryQuizConfig, Flashcard } from "../../components";
import { useNavigate } from "react-router-dom";

const DictionaryQuiz = () => {
  const navigate = useNavigate();
  const { quizStarted, quizEnded } = useQuiz();

  useEffect(() => {
    if (quizEnded) {
      navigate("/gameover");
    }
  }, [quizEnded, navigate]);

  return <>{!quizStarted ? <DictionaryQuizConfig /> : <Flashcard />}</>;
};

export default DictionaryQuiz;
