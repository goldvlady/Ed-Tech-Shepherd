import React from 'react';
import { Box, Divider, Flex, Spacer, Text } from '@chakra-ui/react';
import { IoIosArrowDroprightCircle } from 'react-icons/io';

function SubjectCard({ title, score, scoreColor, date }) {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg="white"
    >
      <Box>
        <Text fontSize="16px" fontWeight="500" p={4}>
          {title}
        </Text>
        <Divider mb={2} color="#EAEBEB" />
        <Box mb={2} border="1px solid #EAEBEB" borderRadius={6} p={2} m={4}>
          <Flex alignItems="center" fontSize="12px" fontWeight={500}>
            <Text mb={1}>Readiness Score</Text>
            <Spacer />
            <Text color="gray.700" fontSize="base" ml={2}>
              {score}%
            </Text>
          </Flex>{' '}
          <Box
            bg="gray.200"
            h="3"
            rounded="full"
            w="full"
            mb={2}
            overflow="hidden"
          >
            <Box
              bg={`${scoreColor}.500`}
              h="3"
              rounded="full"
              width={`${score}%`}
            ></Box>
          </Box>
        </Box>
        <Flex m={4}>
          {' '}
          <Text color="#6E7682" fontSize="12px">
            Created {date}
          </Text>
          <Spacer />
          <IoIosArrowDroprightCircle color="#ECEDEF" />
        </Flex>
      </Box>
    </Box>
  );
}
export default SubjectCard;
