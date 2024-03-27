import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ModalMethods } from "../../types";
import { ButtonRounded } from "../button-rounded";
import { BackCard, FrontCard } from "./components";
import { useFlashcard, useQuiz } from "../../hooks";
import { Button, Modal } from "..";

const Flashcard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentFlashcard,
    showFlashcardBack,
    setShowFlashcardBack,
    markFlashcard,
    resetFlashcardContext,
  } = useFlashcard();
  const { resetQuizContext } = useQuiz();

  const [animationClass, setAnimationClass] = useState("animate-fade");
  const modalRef = useRef<ModalMethods | null>(null);

  if (currentFlashcard === null) {
    return null;
  }

  const playAudio = (audioName: string) => {
    const path = location.pathname.substring(1);
    const folder = path === "dictionary-quiz" ? "dictionary" : "syllabary";
    const audio = new Audio(`/audios/${folder}/${audioName}`);
    audio.play();
  };

  const forceReflow = (node: HTMLElement) => {
    node.offsetWidth;
  };

  const handleFlip = () => {
    setShowFlashcardBack((prev) => !prev);

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
        markFlashcard(currentFlashcard.id, true);
      }, 10);
    } else {
      setAnimationClass("animate-fade-left");
      markFlashcard(currentFlashcard.id, true);
    }
  };

  const handleClickRight = () => {
    if (animationClass === "animate-fade-right") {
      setAnimationClass("");
      setTimeout(() => {
        setAnimationClass("animate-fade-right");
        markFlashcard(currentFlashcard.id, false);
      }, 10);
    } else {
      setAnimationClass("animate-fade-right");
      markFlashcard(currentFlashcard.id, false);
    }
  };

  return (
    <>
      <Modal ref={modalRef}>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Return to Menu
          </h1>
          <hr />
          <p className="text-gray-800 text-center">
            Are you sure you want to return to the menu?
          </p>
          <small className="text-red-500 text-center font-bold">
            You will lose your progress.
          </small>
          <hr />
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => {
                modalRef.current?.close();
              }}
            >
              Cancel
            </button>
            <Button
              onClick={() => {
                resetFlashcardContext();
                resetQuizContext();
                navigate("/");
              }}
              color="secondary"
            >
              Return
            </Button>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col items-center gap-4 w-full">
        <ButtonRounded
          icon="sound"
          onClick={() => {
            playAudio(currentFlashcard.audioName);
          }}
        />
        <div className="flex items-center gap-6 w-full justify-center">
          <ButtonRounded icon="left" onClick={handleClickLeft} />
          <div
            className={`z-10 flashcard-border border-4 p-2 text-wrap rounded-2xl bg-gray-200 sm:min-h-80 min-h-60 sm:w-60 w-48 flex items-center justify-center ${animationClass}`}
          >
            {showFlashcardBack ? <BackCard /> : <FrontCard />}
          </div>
          <ButtonRounded icon="right" onClick={handleClickRight} />
        </div>
        <ButtonRounded icon="flip" onClick={handleFlip} />
      </div>
      <div className="flex flex-col gap-2 mt-8">
        <button
          onClick={() => modalRef.current?.open()}
          className="text-base text-black"
        >
          Return to Menu
        </button>
      </div>
    </>
  );
};

export default Flashcard;
