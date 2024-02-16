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
import userStore from '../../state/userStore';
import PlansModal from '../PlansModal';

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
  const { hasActiveSubscription, fileSizeLimitMB, fileSizeLimitBytes } =
    userStore.getState();

  const [file, setFile] = useState<File | null>(null);

  const hasFile = Boolean(file);
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');

  if (togglePlansModal) {
    return (
      <PlansModal
        togglePlansModal={togglePlansModal}
        setTogglePlansModal={setTogglePlansModal}
        message={plansModalMessage} // Pass the message to the modal
        subMessage={plansModalSubMessage}
      />
    );
  } else {
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
                // Check if the file size exceeds the limit
                if (!file || file.size > fileSizeLimitBytes) {
                  // Set the modal state and messages
                  setPlansModalMessage(
                    !hasActiveSubscription
                      ? `Let's get you on a plan so you can upload larger files!`
                      : `Oops! Your file is too big. Your current plan allows for files up to ${fileSizeLimitMB} MB.`
                  );
                  setPlansModalSubMessage(
                    !hasActiveSubscription
                      ? `You're currently limited to files under ${fileSizeLimitMB} MB.`
                      : 'Consider upgrading to upload larger files.'
                  );
                  setTogglePlansModal(true);
                } else {
                  setFile(file);
                }
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
  }
};

export default UploadModal;
