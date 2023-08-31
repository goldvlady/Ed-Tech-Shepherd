import resourceStore from '../../../state/resourceStore';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Spacer,
  Flex
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router';

const StudentBountyCard = ({ bounty }) => {
  const navigate = useNavigate();
  const handleItemClick = () => {
    // openApplyBounty();
    navigate(`/dashboard/bounties/${bounty.id}`);
  };
  const { courses: courseList, levels: levelOptions } = resourceStore();
  function getSubject(id) {
    return courseList.map((course) => {
      if (course._id === id) {
        return course.label;
      }
    });
  }
  return (
    <Box
      width="100%"
      boxShadow="md"
      p={4}
      _hover={{
        boxShadow: 'lg', // Add a shadow on hover
        transition: 'box-shadow 0.2s ease-in-out'
      }}
      borderRadius="md"
      backgroundColor="white"
      mb={4}
      onClick={handleItemClick}
    >
      <Flex direction="row">
        <Box>
          <Text fontSize="md" fontWeight="semibold" color="#000" mb={2}>
            {bounty.course ? getSubject(bounty.course) : bounty.subject}
          </Text>
          <Badge colorScheme="teal" mb={2}>
            {bounty.type}
          </Badge>
          <Text fontSize="sm" color="gray.500" mb={2}>
            Interested Tutors:
            {bounty.interestedTutors ? bounty.interestedTutors : 3}
          </Text>
          <Text fontSize="sm" color="gray.500" mb={2}>
            Expiry Date: {bounty.expiryDate}
          </Text>
        </Box>
        <Spacer />
        <Box textAlign={'right'}>
          <Text fontSize="xl" fontWeight="bold" color="#207df7">
            ${bounty.reward}.00
          </Text>
          <Text fontSize="sm" color="gray.500" mb={2}>
            Duration: {bounty.duration ? bounty.duration : 30} mins
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default StudentBountyCard;
