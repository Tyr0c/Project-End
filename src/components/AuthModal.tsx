import { Modal } from "@mantine/core";
import { ReactNode } from "react";

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
  type: "login" | "register";
  children: ReactNode;
}

const AuthModal = ({ opened, onClose, type, children }: AuthModalProps) => {
  const title =
    type === "login" ? "Log in to your account" : "Create an account";

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      {children}
    </Modal>
  );
};

export default AuthModal;
