import LoaderOverlay from '../../../../components/loaderOverlay';
import TitleCard from './TitleCard';
import { SimpleGrid, Box, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import librarySubjectStore from '../../../../state/librarySubjectStore';
import { ProviderSkeleton } from './ProviderList';

interface LibrarySubjectProps {
  subjectId: string;
  onSelectSubject: (subjectId: string) => void;
}

const SubjectList: React.FC<LibrarySubjectProps> = ({
  subjectId,
  onSelectSubject
}) => {
  const { fetchLibrarySubjects, isLoading, librarySubjects } =
    librarySubjectStore();

  useEffect(() => {
    fetchLibrarySubjects(subjectId);
  }, [fetchLibrarySubjects, subjectId]);

  return (
    <>
      {!librarySubjects?.length ? (
        <ProviderSkeleton />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
          {librarySubjects.map((subject) => (
            <TitleCard
              key={subject._id}
              data={{ name: subject.name }}
              onClick={() => onSelectSubject(subject._id)}
            />
          ))}
        </SimpleGrid>
      )}
    </>
  );
};

export default SubjectList;
