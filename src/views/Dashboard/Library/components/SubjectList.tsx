import LoaderOverlay from '../../../../components/loaderOverlay';
import TitleCard from './TitleCard';
import { SimpleGrid, Box, Text } from '@chakra-ui/react';
import React from 'react';

interface LibrarySubjectProps {
  subjects: Array<{ _id: string; name: string }>;
  onSelectSubject: (subjectId: string) => void;
}

const SubjectList: React.FC<LibrarySubjectProps> = ({
  subjects,
  onSelectSubject
}) => {
  if (!subjects?.length) {
    return (
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'start'}
        height={'calc(100vh - 350px)'}
      >
        <Box
          width={'100%'}
          display={'flex'}
          height="100%"
          justifyContent={'center'}
          flexDirection={'column'}
          alignItems={'center'}
        >
          <img
            src="/images/empty_illustration.svg"
            alt="empty directory icon"
          />
          <Text
            color="text.300"
            fontFamily="Inter"
            fontSize="16px"
            fontStyle="normal"
            fontWeight="500"
            lineHeight="21px"
            letterSpacing="0.112px"
          >
            No cards to display
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
      {subjects.map((subject) => (
        <TitleCard
          key={subject._id}
          data={{ name: subject.name }}
          onClick={() => onSelectSubject(subject._id)}
        />
      ))}
    </SimpleGrid>
  );
};

export default SubjectList;
