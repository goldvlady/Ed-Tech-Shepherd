import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';

const SubscriptionRedirectModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>You've already subscribed!</ModalHeader>

        <ModalBody padding={'0 24px'}>
          <p className="text-[16px]">
            {' '}
            You currently have an active subscription from our mobile app. To
            make changes to your plan, please go to the app.
          </p>
        </ModalBody>
        <img alt="file" src="/images/coming-soon.svg" />
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubscriptionRedirectModal;
