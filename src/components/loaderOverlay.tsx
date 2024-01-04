import { Modal, ModalOverlay } from '@chakra-ui/react';
import ShepherdSpinner from '../views/Dashboard/components/shepherd-spinner';
import React from 'react';
const LoaderOverlay = () => (
  <Modal
    onClose={() => {
      return;
    }}
    isOpen
  >
    <ModalOverlay
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent background
      }}
    >
      <ShepherdSpinner />
    </ModalOverlay>
  </Modal>
);

export default LoaderOverlay;
