import { Volume } from "grommet-icons";
import { Flashcard as FlashcardType } from "../../types";
import { useDictionary } from "../../hooks/use-dictionary";

type Props = {
  flashcard: FlashcardType;
};

const Flashcard = ({ flashcard }: Props) => {
  const { showFlashcard } = useDictionary();

  const { audioName, romanji, translation, word } = flashcard;

  const playAudio = (audioName: string) => {
    const audio = new Audio(`/audios/${audioName}`);
    audio.play();
  };

  return (
    <div className="bg-blue-500 w-96 h-96 rounded-lg flex flex-col justify-evenly items-center shadow-md shadow-black">
      <div className="font-bold text-xl text-white flex flex-col items-center gap-1">
        <div className="flex gap-2 items-center">
          <span onClick={() => playAudio(audioName)} className="cursor-pointer">
            <Volume color="white" size="medium" />
          </span>
          <span>{word}</span>
        </div>
        <span className="text-sm text-gray-200">({romanji})</span>
      </div>
      <hr className="w-3/4" />
      <div className="text-white">
        <span className="text-base text-gray-200">
          {showFlashcard ? translation : "Click to see translation"}
        </span>
      </div>
    </div>
  );
};

export default Flashcard;
