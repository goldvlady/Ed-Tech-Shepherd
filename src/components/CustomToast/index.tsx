import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import React from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';

const CustomToast = ({ title, status }) => {
  return (
    <Box bg="#F1F9F1" p={3} boxShadow="md" borderRadius="8px" color="#66bd6a">
      <Flex alignItems="center" gap={2}>
        <BsFillCheckCircleFill />
        <Text fontSize={14}>{title}</Text>
      </Flex>
    </Box>
  );
};

export default CustomToast;
