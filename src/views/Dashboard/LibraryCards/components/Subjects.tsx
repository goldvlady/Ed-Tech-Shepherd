import LoaderOverlay from '../../../../components/loaderOverlay';
import TitleCard from './TitleCard';
import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';

interface LibrarySubjectProps {
  subjects: Array<{ _id: string; name: string }>;
  onSelectSubject: (subjectId: string) => void;
}

const LibrarySubjects: React.FC<LibrarySubjectProps> = ({
  subjects,
  onSelectSubject
}) => {
  if (!subjects?.length) {
    return <LoaderOverlay />;
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

export default LibrarySubjects;
