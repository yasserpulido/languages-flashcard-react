import { useQuiz } from "../../hooks";
import { Flashcard, SyllabaryQuizConfig } from "../../components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SyllabaryQuiz = () => {
  const navigate = useNavigate();
  const { quizStarted, quizEnded } = useQuiz();

  useEffect(() => {
    if (quizEnded) {
      console.log("Game Ended");
      navigate("/gameover");
    }
  }, [quizEnded, navigate]);

  return <>{!quizStarted ? <SyllabaryQuizConfig /> : <Flashcard />}</>;
};

export default SyllabaryQuiz;
