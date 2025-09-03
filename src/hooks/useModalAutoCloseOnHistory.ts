// hooks/useModalBackClose.ts
import { useEffect, useRef } from "react";

interface UseModalBackCloseProps {
  isActive: boolean;
  onClose: () => void;
}

const useModalAutoCloseOnHistory = ({
  isActive,
  onClose,
}: UseModalBackCloseProps) => {
  const hasClosedRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;

    const handlePopState = () => {
      if (hasClosedRef.current) return;

      hasClosedRef.current = true;
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      hasClosedRef.current = false;
    };
  }, [isActive, onClose]);
};

export default useModalAutoCloseOnHistory;
