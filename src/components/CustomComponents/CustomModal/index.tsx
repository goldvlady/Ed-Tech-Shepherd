import { StyledModalBoby } from "./styles";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import React from "react";

interface ICustomModalProps {
  modalTitle: string;
  onClose: () => void;
  isOpen: boolean;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  modalSize?: "xs" | "sm" | "md" | "lg" | "xl";
  style?: {
    height: string;
    width: string;
  };
}

const CustomModal = ({
  modalTitle,
  onClose,
  children,
  isOpen,
  footerContent,
  modalSize,
  style,
}: ICustomModalProps) => {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      size={modalSize}
    >
      <ModalOverlay
        bg="rgba(0, 0, 0, 0.6)"
        backdropFilter="blur(0.9px)"
        zIndex="overlay"
      />
      <ModalContent
        height={style?.height ?? "350px"}
        width={style?.width ?? "100%"}
      >
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <StyledModalBoby>{children}</StyledModalBoby>
        {footerContent && <ModalFooter>{footerContent}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
