import { Box, Button, Flex, Text, SimpleGrid } from '@chakra-ui/react';
import React, { useState } from 'react';
import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';

type PaginationProps = {
  page: number;
  limit: number;
  count: number;
  totalPages: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
};

const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  count,
  totalPages,
  handlePreviousPage,
  handleNextPage
}) => {
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, count);

  const isOnFirstPage = page === 1;
  const isOnLastPage = page === totalPages;

  return (
    <Box>
      <Flex justifyContent="center" alignItems="center" mt={4} gap={1}>
        <Text fontSize={14} color="text.400">
          {startIndex + 1} - {endIndex} of {count}
        </Text>
        <Button
          onClick={handlePreviousPage}
          isDisabled={isOnFirstPage}
          p={1}
          color={isOnFirstPage ? '#CACCCE' : 'text.300'}
          border="1px solid #EFEFF0"
          bgColor="transparent"
        >
          <RiArrowLeftSLine size="25px" />
        </Button>

        <Button
          onClick={handleNextPage}
          isDisabled={isOnLastPage}
          p={1}
          color={isOnLastPage ? '#CACCCE' : 'text.300'}
          border="1px solid #EFEFF0"
          bgColor="transparent"
        >
          <RiArrowRightSLine size="25px" />
        </Button>
      </Flex>
    </Box>
  );
};

export default Pagination;
