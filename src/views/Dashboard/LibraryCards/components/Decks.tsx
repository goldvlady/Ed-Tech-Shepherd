import LoaderOverlay from '../../../../components/loaderOverlay';
import libraryDeckStore from '../../../../state/libraryDeckStore';
import TitleCard from './TitleCard';
import { SimpleGrid } from '@chakra-ui/react';
import React, { useEffect } from 'react';

interface LibraryDeckProps {
  topicId: string;
  onSelectDeck: (deckId: string) => void;
}

const LibraryDecks: React.FC<LibraryDeckProps> = ({
  topicId,
  onSelectDeck
}) => {
  const { fetchlibraryDecks, isLoading, libraryDecks } = libraryDeckStore();

  useEffect(() => {
    if (topicId) {
      fetchlibraryDecks(topicId);
    }
  }, [topicId, fetchlibraryDecks]);

  if (!libraryDecks?.length) {
    return <LoaderOverlay />;
  }
  return !libraryDecks?.length ? (
    <LoaderOverlay />
  ) : (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
      {libraryDecks.map((deck) => (
        <TitleCard
          key={deck._id}
          data={{ name: deck.name }}
          onClick={() => onSelectDeck(deck._id)}
        />
      ))}
    </SimpleGrid>
  );
};

export default LibraryDecks;
