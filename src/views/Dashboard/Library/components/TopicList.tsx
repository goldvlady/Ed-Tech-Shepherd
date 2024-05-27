import LoaderOverlay from '../../../../components/loaderOverlay';
import libraryTopicStore from '../../../../state/libraryTopicStore';
import { ProviderSkeleton } from './ProviderList';
import TitleCard from './TitleCard';
import { SimpleGrid, Box, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';

interface LibraryTopicProps {
  subjectId: string;
  onSelectTopic: (topicId: string) => void;
}

const TopicList: React.FC<LibraryTopicProps> = ({
  subjectId,
  onSelectTopic
}) => {
  const { fetchlibraryTopics, isLoading, libraryTopics } = libraryTopicStore();

  useEffect(() => {
    if (subjectId) {
      fetchlibraryTopics(subjectId);
    }
  }, [subjectId, fetchlibraryTopics]);

  // if (isLoading && !libraryTopics?.length) {
  //   return <LoaderOverlay />;
  // }
  return !libraryTopics?.length ? (
    <ProviderSkeleton />
  ) : (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
      {libraryTopics.map((topic) => (
        <TitleCard
          key={topic._id}
          data={{ name: topic.name }}
          onClick={() => onSelectTopic(topic._id)}
        />
      ))}
    </SimpleGrid>
  );
};

export default TopicList;
