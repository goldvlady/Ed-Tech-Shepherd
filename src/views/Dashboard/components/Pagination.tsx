import resourceStore from '../../../state/resourceStore';
import TutorCard from './TutorCard';
import { Box, Button, Flex, Text, SimpleGrid } from '@chakra-ui/react';
import React, { useState } from 'react';

type PaginationProps = {
  page: number;
  limit: number;
  count: number;
  currentPage: number;
  totalPages: number;
  handlePageChange: (currentPage: number) => void;
  //   tutors: any[];
};

const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  count,
  currentPage,
  totalPages,
  handlePageChange
  //   tutors
}) => {
  const { courses: courseList, levels: levelOptions } = resourceStore();

  //   const renderTutors = () => {
  //     const startIndex = (currentPage - 1) * limit;
  //     const endIndex = Math.min(startIndex + limit, count);
  //     const visibleTutors = tutors.slice(startIndex, endIndex);

  //     return (
  //       <SimpleGrid columns={[1, 2, 3]} spacing={4}>
  //         {visibleTutors.map((tutor: any) => (
  //           <TutorCard
  //             key={tutor._id}
  //             id={tutor._id}
  //             name={`${tutor.user.name.first} ${tutor.user.name.last} `}
  //             levelOfEducation={tutor.highestLevelOfEducation}
  //             avatar={tutor.user.avatar}
  //             rate={tutor.rate}
  //             description={tutor.description}
  //             rating={tutor.rating}
  //             reviewCount={tutor.reviewCount}
  //             saved={checkBookmarks(tutor._id)}
  //             courses={tutor.coursesAndLevels.map((course) => course)}
  //             handleSelectedCourse={handleSelectedCourse}
  //           />
  //         ))}
  //       </SimpleGrid>
  //     );
  //   };

  return (
    <Box>
      {/* Pagination controls */}
      <Flex justifyContent="center" mt={4}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          mr={2}
        >
          Previous
        </Button>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          ml={2}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default Pagination;
