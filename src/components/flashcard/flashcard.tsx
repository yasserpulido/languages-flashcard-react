import { Volume } from "grommet-icons";
import { useDictionary } from "../../hooks/use-dictionary";
import { useEffect, useState } from "react";
import { Dictionary, Syllable } from "../../types";

type Props = {
  currentFlashcard: Dictionary | Syllable;
};

const Flashcard = ({ currentFlashcard }: Props) => {
  const [animationClass, setAnimationClass] = useState("animate-rotate-y");
  const { showFlashcard, isDictionaryQuiz, isWritingQuiz } = useDictionary();

  const playAudio = (audioName: string) => {
    const folder = isDictionaryQuiz ? "dictionary" : "syllabary";
    const audio = new Audio(`/audios/${folder}/${audioName}`);
    audio.play();
  };

  useEffect(() => {
    setAnimationClass("");
    const timeoutId = setTimeout(() => {
      setAnimationClass("animate-rotate-y");
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [currentFlashcard]);

  const handleFlashcardTop = () => {
    if (isDictionaryQuiz) {
      return (currentFlashcard as Dictionary).word;
    } else if (isWritingQuiz) {
      return (currentFlashcard as Syllable).romaji;
    } else {
      return (currentFlashcard as Syllable).kana;
    }
  };

  const handleFlashcardBottom = () => {
    if (isDictionaryQuiz) {
      return (currentFlashcard as Dictionary).translation;
    } else if (isWritingQuiz) {
      return (
        <span className="text-4xl">{(currentFlashcard as Syllable).kana}</span>
      );
    } else {
      return (currentFlashcard as Syllable).romaji;
    }
  };

  return (
    <div
      className={`bg-blue-500 h-96 max-w-96 p-4 w-full rounded-lg flex flex-col justify-evenly items-center shadow-md shadow-black ${animationClass}`}
    >
      <div
        className={`font-bold ${
          isDictionaryQuiz || isWritingQuiz ? "text-xl" : "text-5xl"
        } text-white flex flex-col items-center gap-1`}
      >
        <div className="flex gap-2 items-center">
          <span
            onClick={() => playAudio(currentFlashcard.audioName)}
            className="cursor-pointer"
          >
            <Volume color="white" size="medium" />
          </span>
          {handleFlashcardTop()}
        </div>
        {isDictionaryQuiz && (
          <span className="text-sm text-gray-200">
            ({currentFlashcard.romaji})
          </span>
        )}
      </div>
      <hr className="w-3/4" />
      <div className="text-white">
        <div className="text-base text-gray-200">
          {showFlashcard
            ? handleFlashcardBottom()
            : "Click on show to see translation"}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
