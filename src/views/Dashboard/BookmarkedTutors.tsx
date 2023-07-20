import bookmarkedTutorsStore from '../../state/bookmarkedTutorsStore';
import TutorCard from './components/TutorCard';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useCallback, useEffect } from 'react';

function BookmarkedTutors() {
  const { fetchBookmarkedTutors, tutors: allTutors } = bookmarkedTutorsStore();
  const doFetchBookmarkedTutors = useCallback(async () => {
    await fetchBookmarkedTutors();
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchBookmarkedTutors();
  }, [doFetchBookmarkedTutors]);

  const [tutorGrid] = useAutoAnimate();

  return (
    <>
      <Box p={3} minH={'100vh'}>
        {' '}
        <Flex alignItems={'center'} gap={1}>
          <Box>
            <Text fontSize={24} fontWeight={600} color="text.200" mb={0}>
              Saved Tutors
            </Text>
            <Text fontSize={16} fontWeight={400} color="text.300">
              Keep up with tutors you’ve saved their profile
            </Text>
          </Box>
        </Flex>
        <SimpleGrid
          columns={[2, null, 3]}
          spacing="20px"
          ref={tutorGrid}
          mt={4}
        >
          {allTutors.map((tutor: any) => (
            <TutorCard
              key={tutor.tutor?._id}
              id={tutor.tutor?._id}
              name={`${tutor.tutor.user.name.first} ${tutor.tutor.user.name.last}`}
              levelOfEducation={'BSC'}
              avatar={tutor.tutor.user.avatar}
              saved={true}
              description={tutor.tutor?.description}
              rate={tutor.tutor?.rate}
              rating={tutor.tutor?.rating}
              reviewCount={tutor.tutor?.reviewCount}
            />
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}

export default BookmarkedTutors;
