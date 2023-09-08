import DragAndDrop from '../DragandDrop';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react';
import React, { useState } from 'react';

// ... Your DragAndDrop component code here ...

interface UploadModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  accept?: string;
  onClose: () => void;
  onUpload: (file: File) => void; // Callback function for when the "Upload" button is clicked
  // You can add more props as needed
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isLoading,
  accept
}) => {
  const [file, setFile] = useState<File | null>(null);

  const hasFile = Boolean(file);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Document</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DragAndDrop
            accept={accept}
            onFileUpload={(file: File) => {
              setFile(file);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={isLoading}
            isDisabled={!hasFile}
            colorScheme="blue"
            mr={3}
            onClick={() => onUpload(file as File)}
          >
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadModal;
