import { Volume } from "grommet-icons";
import { Flashcard as FlashcardType } from "../../types";
import { useDictionary } from "../../hooks/use-dictionary";
import { useEffect, useState } from "react";

type Props = {
  flashcard: FlashcardType;
};

const Flashcard = ({ flashcard }: Props) => {
  const [animationClass, setAnimationClass] = useState("animate-rotate-y");
  const { showFlashcard } = useDictionary();

  const { audioName, romaji, translation, word } = flashcard;

  const playAudio = (audioName: string) => {
    const audio = new Audio(`/audios/${audioName}`);
    audio.play();
  };

  useEffect(() => {
    setAnimationClass("");
    const timeoutId = setTimeout(() => {
      setAnimationClass("animate-rotate-y");
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [flashcard]);

  return (
    <div
      className={`bg-blue-500 h-96 max-w-96 p-4 w-full rounded-lg flex flex-col justify-evenly items-center shadow-md shadow-black ${animationClass}`}
    >
      <div className="font-bold text-xl text-white flex flex-col items-center gap-1">
        <div className="flex gap-2 items-center">
          <span onClick={() => playAudio(audioName)} className="cursor-pointer">
            <Volume color="white" size="medium" />
          </span>
          <span>{word}</span>
        </div>
        <span className="text-sm text-gray-200">({romaji})</span>
      </div>
      <hr className="w-3/4" />
      <div className="text-white">
        <span className="text-base text-gray-200">
          {showFlashcard ? translation : "Click on show to see translation"}
        </span>
      </div>
    </div>
  );
};

export default Flashcard;
