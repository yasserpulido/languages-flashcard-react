import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

import { ModalMethods } from "../../types";
import { useUI } from "../../hooks";

type Props = {
  children: React.ReactNode;
};

const Modal = forwardRef<ModalMethods, Props>(({ children }, ref) => {
  const { resetResponseMessage } = useUI();
  const dialog = useRef<HTMLDialogElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);
  const modal = document.getElementById("modal");

  useImperativeHandle(ref, () => ({
    open: () => {
      document.body.style.overflow = "hidden";
      if (dialog && "current" in dialog && dialog.current) {
        dialog.current.showModal();
      }
    },
    close: () => {
      document.body.style.overflow = "auto";
      if (dialog && "current" in dialog && dialog.current) {
        dialog.current.close();
      }
      resetResponseMessage();
    },
  }));

  const closeModal = () => {
    document.body.style.overflow = "auto";
    if (ref && "current" in ref && ref.current) {
      ref.current.close();
    }
  };

  const handleDialogClick = (
    event: React.MouseEvent<HTMLDialogElement, MouseEvent>
  ) => {
    if (
      ref &&
      "current" in ref &&
      ref.current &&
      content.current &&
      !content.current.contains(event.target as Node)
    ) {
      closeModal();
    }
  };

  if (!modal) return null;

  return createPortal(
    <dialog
      ref={dialog}
      className="rounded-md drop-shadow-lg backdrop:bg-black/50"
      onClick={handleDialogClick}
    >
      <section ref={content} className="p-4 bg-white rounded-md">
        {children}
      </section>
    </dialog>,
    modal
  );
});

export default Modal;
