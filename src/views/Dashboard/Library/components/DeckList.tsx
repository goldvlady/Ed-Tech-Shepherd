import LoaderOverlay from '../../../../components/loaderOverlay';
import libraryDeckStore from '../../../../state/libraryDeckStore';
import Deck from './Deck';
import { SimpleGrid, Box, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { ProviderSkeleton } from './ProviderList';

interface LibraryDeckProps {
  topicId: string;
  onSelectDeck: (deckId: string) => void;
}

const DeckList: React.FC<LibraryDeckProps> = ({ topicId, onSelectDeck }) => {
  const { fetchlibraryDecks, isLoading, libraryDecks } = libraryDeckStore();

  useEffect(() => {
    if (topicId) {
      fetchlibraryDecks(topicId);
    }
  }, [topicId, fetchlibraryDecks]);

  // if (isLoading && !libraryDecks?.length) {
  //   return <LoaderOverlay />;
  // }
  return !libraryDecks?.length ? (
    <ProviderSkeleton />
  ) : (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
      {libraryDecks.map((deck) => (
        <Deck
          key={deck._id}
          data={{ name: deck.name }}
          onClick={() => onSelectDeck(deck._id)}
        />
      ))}
    </SimpleGrid>
  );
};

export default DeckList;
