import { type ReactNode } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import styles from "./index.module.scss";
import { ReactComponent as CloseIcon } from "@/assets/icons/close_icon.svg";
import useScrollDisable from "@/hooks/useScrollDisable";
import useModalVisibility from "@/hooks/useModalVisibility";
import useModalKeyboardControl from "@/hooks/useModalKeyboardControl";
import useModalAutoCloseOnHistory from "@/hooks/useModalAutoCloseOnHistory";

export interface ModalProps {
  title?: string | ReactNode;
  hasCloseBtn?: boolean;
  children: ReactNode;
  bgColor?: string;
  isOpen: boolean;
  className?: string;
  closeOnDimmedClick?: boolean;
  controlWithKeyboard?: boolean;
  onCloseModal?: () => void;
  usePortal?: boolean;
  portalRootId?: string;
  disableClose?: boolean;
  autoCloseOnHistory?: boolean;
}

const Modal = ({
  title = "",
  hasCloseBtn,
  children,
  bgColor,
  className,
  isOpen,
  closeOnDimmedClick = true,
  controlWithKeyboard = true,
  usePortal = true,
  portalRootId = "modal-root",
  disableClose = false,
  autoCloseOnHistory = true,
  onCloseModal,
}: ModalProps) => {
  const modalElement = usePortal ? document.getElementById(portalRootId) : null;

  const closeModal = () => {
    if (disableClose) return;
    onCloseModal?.();
  };

  useScrollDisable(isOpen);
  useModalKeyboardControl(isOpen, closeModal, controlWithKeyboard);
  const { isVisible, isAnimating } = useModalVisibility(isOpen, 300);

  useModalAutoCloseOnHistory({
    isActive: isOpen && autoCloseOnHistory,
    onClose: () => {
      closeModal();
    },
  });

  const handleDimmedClick = (e: React.MouseEvent) => {
    if (closeOnDimmedClick && e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!isVisible) return null;

  const modalContent = (
    <div
      className={classNames(
        styles.modalBackdrop,
        isAnimating ? styles.visible : styles.hidden,
        className
      )}
      onClick={handleDimmedClick}
    >
      <div
        role="dialog"
        className={`${styles.modalContainer} ${
          isAnimating ? styles.animating : styles.notAnimating
        }`}
        style={{ backgroundColor: bgColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          {title && <h3 className={styles.modalTitle}>{title}</h3>}
          {hasCloseBtn && (
            <button
              type="button"
              aria-label="close"
              className={styles.modalCloseBtn}
              onClick={closeModal}
            >
              <CloseIcon />
            </button>
          )}
        </header>
        <div className={styles.modalContentContainer}>{children}</div>
      </div>
    </div>
  );

  if (usePortal && modalElement) {
    return ReactDOM.createPortal(modalContent, modalElement);
  }

  return modalContent;
};

export default Modal;
