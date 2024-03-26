import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { useFlashcard, useQuiz, useUserData } from "../../hooks";
import { useEffect } from "react";

const GameOver = () => {
  const navigate = useNavigate();
  const { setUserDataAndStore } = useUserData();
  const { stats, returnToMenu } = useFlashcard();
  const { quizEnded } = useQuiz();

  useEffect(() => {
    if (!quizEnded) {
      navigate("/");
    }
  }, [navigate, quizEnded]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center gap-4">
        <span className="text-2xl font-bold text-gray-800">
          Hard: {stats.hard.length}
        </span>
        <span className="text-2xl font-bold text-gray-800">
          Easy: {stats.easy.length}
        </span>
      </div>
      <h1 className="text-4xl font-bold text-gray-800">Quiz Complete!</h1>
      <div className="flex justify-center">
        <Button
          onClick={() => {
            setUserDataAndStore();
            navigate("/");
            returnToMenu();
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
