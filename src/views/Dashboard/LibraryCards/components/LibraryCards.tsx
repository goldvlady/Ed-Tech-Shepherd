import LoaderOverlay from '../../../../components/loaderOverlay';
import libraryCardStore from '../../../../state/libraryCardStore';
import LibraryCard from '../../FlashCards/components/libraryCardPreview';
import { SimpleGrid } from '@chakra-ui/react';
import React, { useEffect } from 'react';

interface LibraryCardProps {
  topicId: string;
}

const LibraryCards: React.FC<LibraryCardProps> = ({ topicId }) => {
  const { fetchLibraryCards, libraryCards } = libraryCardStore();

  useEffect(() => {
    if (topicId) {
      fetchLibraryCards(topicId);
    }
  }, [topicId, fetchLibraryCards]);

  if (!libraryCards?.length) {
    return <LoaderOverlay />;
  }
  return !libraryCards?.length ? (
    <LoaderOverlay />
  ) : (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
      {libraryCards.map((card) => (
        <LibraryCard
          key={card._id}
          question={card.front}
          difficulty={card.difficulty}
          answer={card.back}
          explanation={card.explainer}
        />
      ))}
    </SimpleGrid>
  );
};

export default LibraryCards;
