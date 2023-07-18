import { Spinner, Modal, ModalOverlay } from '@chakra-ui/react';

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
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </ModalOverlay>
  </Modal>
);

export default LoaderOverlay;
