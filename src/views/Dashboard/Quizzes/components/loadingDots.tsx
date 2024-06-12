import React from 'react';
import {
  Box,
  Flex,
  keyframes,
  usePrefersReducedMotion
} from '@chakra-ui/react';

const loadingAnimation = keyframes`
  0% { transform: translateX(0); opacity: 1; }
  50% { transform: translateX(7px); opacity: 0.5; }
  100% { transform: translateX(0); opacity: 1; }
`;

export const LoadingDots = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation = prefersReducedMotion
    ? undefined
    : `${loadingAnimation} 1s infinite ease-in-out`;

  return (
    <Box>
      <Flex justifyContent="center" alignItems="center">
        <Box
          as="span"
          bg="gray.500"
          borderRadius="full"
          h="8px"
          w="8px"
          mr="4px"
          animation={animation}
        />
        <Box
          as="span"
          bg="gray.500"
          borderRadius="full"
          h="8px"
          w="8px"
          mr="4px"
          animation={animation}
          style={{ animationDelay: '0.2s' }}
        />
        <Box
          as="span"
          bg="gray.500"
          borderRadius="full"
          h="8px"
          w="8px"
          animation={animation}
          style={{ animationDelay: '0.4s' }}
        />
      </Flex>
    </Box>
  );
};
