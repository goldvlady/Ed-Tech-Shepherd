// Chakra imports
import { Button, Flex, Link, Text } from '@chakra-ui/react';

// Assets
import banner from '../../../assets/marketBg.svg';

export default function Banner() {
  // Chakra Color Mode
  return (
    <Flex
      direction="column"
      bgImage={banner}
      bgSize="cover"
      maxHeight={'100%'}
      py={{ base: '30px', md: '56px' }}
      px={{ base: '30px', md: '64px' }}
      borderRadius="30px">
      <Text
        fontSize={{ base: '24px', md: '34px' }}
        color="white"
        mb="14px"
        maxW={{
          base: '100%',
          md: '64%',
          lg: '46%',
          xl: '70%',
          '2xl': '50%',
          '3xl': '42%',
        }}
        fontWeight="700"
        lineHeight={{ base: '32px', md: '42px' }}>
        Discover Top Tutors
      </Text>
      <Text
        fontSize="14px"
        color="#E3DAFF"
        maxWidth={{ sm: '85%', md: '55%', lg: '45%' }}
        fontWeight="500"
        mb="40px"
        lineHeight={{ sm: '20px', lg: '28px' }}>
        Find expert instructors to help meet your learning goals with as much flexibility as you
        need
      </Text>
    </Flex>
  );
}
