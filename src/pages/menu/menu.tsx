import { useNavigate } from "react-router-dom";
import { Button } from "../../components";

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
      <div className="w-32 h-32 bg-red-500 rounded-full relative animate-fade-down"></div>
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        Japanese Flashcards
      </h1>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/syllabary-quiz")} color="primary">
          Syllabary Quiz
        </Button>
        <Button onClick={() => navigate("/dictionary-quiz")} color="primary">
          Dictionary Quiz
        </Button>
      </div>
      <span className="text-gray-800 text-center">
        Select a quiz to start learning Japanese with flashcards.
      </span>
      <Button onClick={() => navigate("/settings")} color="secondary">
        Settings
      </Button>
    </div>
  );
};

export default Menu;
