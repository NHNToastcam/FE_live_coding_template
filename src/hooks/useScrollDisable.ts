import { useLayoutEffect, useState } from "react";

const useScrollDisable = (isOpen: boolean) => {
  const mainContainerId = document.getElementById("mainContainer");
  const [scrollY, setScrollY] = useState<number | null>(null);

  useLayoutEffect(() => {
    const isFirstOpen = isOpen && scrollY === null;

    if (!mainContainerId) return;

    if (isFirstOpen) {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      mainContainerId.style.top = `-${currentScrollY}px`;
      mainContainerId.setAttribute("data-modal-open", "true");
    }

    if (!isOpen && scrollY !== null) {
      // 모달이 닫힐 때 스크롤 복원
      mainContainerId.removeAttribute("data-modal-open");
      mainContainerId.style.top = "";
      window.scrollTo(0, scrollY);
      setScrollY(null);
    }

    return () => {
      if (scrollY !== null) {
        mainContainerId.removeAttribute("data-modal-open");
        mainContainerId.style.top = "";
        window.scrollTo(0, scrollY);
      }
    };
  }, [isOpen, scrollY, mainContainerId]);

  return scrollY;
};

export default useScrollDisable;
