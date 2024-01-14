import LoaderOverlay from '../../../../components/loaderOverlay';
import libraryTopicStore from '../../../../state/libraryTopicStore';
import TitleCard from './TitleCard';
import { SimpleGrid } from '@chakra-ui/react';
import React, { useEffect } from 'react';

interface LibraryTopicProps {
  subjectId: string;
  onSelectSubject: (subjectId: string) => void;
}

const LibraryTopics: React.FC<LibraryTopicProps> = ({
  subjectId,
  onSelectSubject
}) => {
  const { fetchlibraryTopics, isLoading, libraryTopics } = libraryTopicStore();

  useEffect(() => {
    if (subjectId) {
      fetchlibraryTopics(subjectId);
    }
  }, [subjectId, fetchlibraryTopics]);

  if (!libraryTopics?.length) {
    return <LoaderOverlay />;
  }
  return !libraryTopics?.length ? (
    <LoaderOverlay />
  ) : (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
      {libraryTopics.map((topic) => (
        <TitleCard
          key={topic._id}
          data={{ name: topic.name }}
          onClick={() => onSelectSubject(topic._id)}
        />
      ))}
    </SimpleGrid>
  );
};

export default LibraryTopics;
