import { Spinner } from '@chakra-ui/react';

const LoaderOverlay = () => (
  <div
    style={{
      position: 'absolute',
      zIndex: 1,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
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
  </div>
);

export default LoaderOverlay;
