import { useState } from "react";

import { Dictionary, Syllable } from "../../types";
import { ButtonRounded } from "../button-rounded";
import { BackCard, FrontCard } from "./components";
import { useDictionary } from "../../hooks";

const Flashcard = () => {
  const [animationClass, setAnimationClass] = useState("animate-fade");
  const {
    showFlashcard,
    isDictionaryQuiz,
    currentFlashcard,
    markDifficulty,
    toggleFlashcard,
  } = useDictionary();

  if (currentFlashcard === null) {
    return null;
  }

  const playAudio = (audioName: string) => {
    const folder = isDictionaryQuiz ? "dictionary" : "syllabary";
    const audio = new Audio(`/audios/${folder}/${audioName}`);
    audio.play();
  };

  const forceReflow = (node: HTMLElement) => {
    node.offsetWidth;
  };

  const handleFlip = () => {
    toggleFlashcard();

    if (animationClass !== "animate-rotate-y") {
      setAnimationClass("animate-rotate-y");
    } else {
      const flashcardElement = document.querySelector(
        ".flashcard-border"
      ) as HTMLElement;
      if (flashcardElement) {
        forceReflow(flashcardElement);
        setAnimationClass("");
        setTimeout(() => setAnimationClass("animate-rotate-y"), 10);
      }
    }
  };

  const handleClickLeft = () => {
    if (animationClass === "animate-fade-left") {
      setAnimationClass("");
      setTimeout(() => {
        setAnimationClass("animate-fade-left");
        markDifficulty(currentFlashcard.id, true);
      }, 10);
    } else {
      setAnimationClass("animate-fade-left");
      markDifficulty(currentFlashcard.id, true);
    }
  };

  const handleClickRight = () => {
    if (animationClass === "animate-fade-right") {
      setAnimationClass("");
      setTimeout(() => {
        setAnimationClass("animate-fade-right");
        markDifficulty(currentFlashcard.id, false);
      }, 10);
    } else {
      setAnimationClass("animate-fade-right");
      markDifficulty(currentFlashcard.id, false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <ButtonRounded
        icon="sound"
        onClick={() => {
          if (isDictionaryQuiz) {
            playAudio((currentFlashcard as Dictionary).audioName);
          } else {
            playAudio((currentFlashcard as Syllable).audioName);
          }
        }}
      />
      <div className="flex items-center gap-6 w-full justify-center">
        <ButtonRounded icon="left" onClick={handleClickLeft} />
        <div
          className={`z-10 flashcard-border border-4 p-2 text-wrap rounded-2xl bg-gray-200 sm:min-h-80 min-h-60 sm:w-60 w-48 flex items-center justify-center ${animationClass}`}
        >
          {showFlashcard ? <BackCard /> : <FrontCard />}
        </div>
        <ButtonRounded icon="right" onClick={handleClickRight} />
      </div>
      <ButtonRounded icon="flip" onClick={handleFlip} />
    </div>
  );
};

export default Flashcard;
