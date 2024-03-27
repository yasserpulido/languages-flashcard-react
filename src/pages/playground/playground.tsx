import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useQuiz } from "../../hooks";
import {
  DictionaryQuizConfig,
  Flashcard,
  SyllabaryQuizConfig,
} from "../../components";

const Playground = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizState } = useQuiz();

  const { started, ended } = quizState;

  useEffect(() => {
    if (!started && ended) {
      navigate("/gameover");
    }
  }, [ended, started, navigate]);

  const getQuizComponent = () => {
    const isDictionaryQuiz = location.pathname === "/dictionary-quiz";

    if (isDictionaryQuiz) {
      return <DictionaryQuizConfig />;
    }

    return <SyllabaryQuizConfig />;
  };

  return <>{!started ? getQuizComponent() : <Flashcard />}</>;
};

export default Playground;
