import { useEffect } from "react";

const modalStack: (() => void)[] = [];
let isListenerAttached = false;

const globalHandler = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    const close = modalStack[modalStack.length - 1];
    if (close) {
      close();
      event.stopImmediatePropagation();
    }
  }
};

export default function useModalKeyboardControl(
  isOpen: boolean,
  closeModal: () => void,
  controlWithKeyboard: boolean = true,
) {
  useEffect(() => {
    if (controlWithKeyboard && isOpen) {
      modalStack.push(closeModal);
    }

    if (controlWithKeyboard && !isListenerAttached) {
      window.addEventListener("keydown", globalHandler);
      isListenerAttached = true;
    }

    return () => {
      const idx = modalStack.lastIndexOf(closeModal);
      if (idx > -1) {
        modalStack.splice(idx, 1);
      }
      if (modalStack.length === 0 && isListenerAttached) {
        window.removeEventListener("keydown", globalHandler);
        isListenerAttached = false;
      }
    };
  }, [isOpen, controlWithKeyboard, closeModal]);
}
