import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import LoaderOverlay from '../../../../components/loaderOverlay';
import flashcardStore from '../../../../state/flashcardStore';
import libraryCardStore from '../../../../state/libraryCardStore';
import userStore from '../../../../state/userStore';
import { LibraryCardData } from '../../../../types';
import LibraryCard from '../../FlashCards/components/libraryCardPreview';
import AddToDeckModal from './addtoDeckModal';
import { SimpleGrid, Box, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledImage = styled(Box)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 50%;
  height: 26px;
  width: 26px;
  border: 0.6px solid #eaeaeb;
  box-shadow: 0 2px 10px rgba(63, 81, 94, 0.1);
`;

const YourFlashCardIcon = () => (
  <StyledImage marginRight="10px">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="10"
      height="14"
    >
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  </StyledImage>
);

interface LibraryCardProps {
  deckId: string;
}

const LibraryCards: React.FC<LibraryCardProps> = ({ deckId }) => {
  const { fetchLibraryCards, libraryCards } = libraryCardStore();
  const { user } = userStore();
  const { createFlashCard, isLoading, fetchFlashcards } = flashcardStore();
  // State for tracking selected cards and modal visibility
  const [selectedCards, setSelectedCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useCustomToast();

  useEffect(() => {
    if (deckId) {
      fetchLibraryCards(deckId);
    }
  }, [deckId, fetchLibraryCards]);

  const onSubmitFlashcard = async (card) => {
    const data = {
      deckname: 'library',
      studyType: 'longTermRetention',
      subject: card.subject.name,
      level: card.difficulty,
      topic: card.topic.name,
      studyPeriod: 'noRepeat',
      questions: [
        {
          questionType: 'openEnded',
          question: card.front,
          answer: card.back,
          numberOfAttempts: 0,
          currentStep: 0,
          totalSteps: 0,
          currentStudy: null
        }
      ],
      scores: [],
      source: 'shepherd',
      currentStudy: null
    };
    try {
      console.log('\nData: ', data);
      const response = await createFlashCard({ data }, 'manual');
      if (response) {
        if (response.status === 200) {
          toast({
            title: 'Card saved to your flashcards',
            position: 'top-right',
            status: 'success',
            isClosable: true
          });
        } else {
          toast({
            title: 'Failed to save card, try again',
            position: 'top-right',
            status: 'error',
            isClosable: true
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Failed to create flashcard, try again',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };

  const options = (card: LibraryCardData) => [
    {
      label: 'Save',
      onClick: () => onSubmitFlashcard(card),
      icon: <YourFlashCardIcon />
    }
  ];

  // Function to handle card selection
  const handleCardSelect = (cardId, isSelected) => {
    setSelectedCards((prev) =>
      isSelected ? [...prev, cardId] : prev.filter((id) => id !== cardId)
    );
  };

  // Function to toggle modal
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Function to log form data and selected cards
  const handleFormSubmit = (formData) => {
    console.log('Form Data:', formData);
    console.log('Selected Cards:', selectedCards);
    toggleModal();
  };

  // const [selectedCards, setSelectedCards] = useState(new Set());

  // const handleSelectCard = (cardId, isSelected) => {
  //   setSelectedCards((prevSelectedCards) => {
  //     const newSelectedCards = new Set(prevSelectedCards);
  //     if (isSelected) {
  //       newSelectedCards.add(cardId);
  //     } else {
  //       newSelectedCards.delete(cardId);
  //     }
  //     return newSelectedCards;
  //   });
  // };

  if (!libraryCards?.length) {
    return <LoaderOverlay />;
  }
  return !libraryCards?.length ? (
    <LoaderOverlay />
  ) : (
    <>
      {isModalOpen && (
        <AddToDeckModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          onSubmit={handleFormSubmit}
        />
      )}
      {selectedCards.length > 0 && (
        <Button onClick={toggleModal}>Add to Deck</Button>
      )}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
        {libraryCards.map((card) => (
          <LibraryCard
            key={card._id}
            question={card.front}
            difficulty={card.difficulty}
            answer={card.back}
            explanation={card.explainer}
            options={options(card)}
            onSelect={(isSelected) => handleCardSelect(card._id, isSelected)}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default LibraryCards;
