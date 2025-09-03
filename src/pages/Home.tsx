import Modal from "@/components/Modal";
import { useState } from "react";

export function HomePage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => setIsOpen((prev) => !prev)}>toggle</button>

      <Modal isOpen={isOpen} onCloseModal={() => setIsOpen(false)}>
        test
      </Modal>
    </div>
  );
}
