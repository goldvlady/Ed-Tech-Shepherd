import Logo from '../../../../../components/Logo';
import { Flex, Text, Box, useInterval } from '@chakra-ui/react';
import { useState } from 'react';

const LoaderScreen = () => {
  const [loadPercentage, setLoadPercentage] = useState(0);

  // This will increment loadPercentage by 1 every 100ms, but it will never reach 100%
  useInterval(() => {
    if (loadPercentage < 98) {
      setLoadPercentage(loadPercentage + 1);
    }
  }, 1000);

  return (
    <Flex
      width="100%"
      height="100%"
      minHeight={'calc(100vh - 320px)'}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      {/* Logo */}
      <Box mb={2}>
        <Logo noFixedWidth />
      </Box>

      {/* Progress Bar */}
      <Box mb={6} position="relative" width="70%" height="2px">
        <Box
          className="progress-bar-base"
          position="absolute"
          width="100%"
          height="5px"
          bg="#EEEFF2"
          borderRadius="2px"
        />
        <Box
          className="progress-bar"
          position="absolute"
          width={`${loadPercentage}%`}
          height="5px"
          bg={'#207DF7'}
          borderRadius="2px"
          transition="width 0.5s linear" // Add this line
        />
      </Box>
      {/* Custom Text */}
      <Text
        color="var(--text-300, #585F68)"
        textAlign="center"
        fontFamily="Inter"
        fontSize="16px"
        fontWeight="500"
        lineHeight="24px"
        letterSpacing="0.112px"
        maxW="70%"
      >
        Shepherd is prepping your flashcards. This should be as quick as brewing
        a coffee. Feel free to explore, and we'll ping you when they're ready.
      </Text>
    </Flex>
  );
};

export default LoaderScreen;
