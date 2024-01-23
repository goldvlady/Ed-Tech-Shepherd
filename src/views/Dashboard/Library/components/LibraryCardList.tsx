import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import LoaderOverlay from '../../../../components/loaderOverlay';
import flashcardStore from '../../../../state/flashcardStore';
import libraryCardStore from '../../../../state/libraryCardStore';
import userStore from '../../../../state/userStore';
import { LibraryCardData } from '../../../../types';
import LibraryCard from './LibraryCard';
import AddToDeckModal from './AddToDeckModal';
import { SimpleGrid, Box, Button, Flex, Select } from '@chakra-ui/react';
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

const LibraryCardList: React.FC<LibraryCardProps> = ({ deckId }) => {
  const { fetchLibraryCards, libraryCards } = libraryCardStore();
  const { user } = userStore();
  const {
    createFlashCard,
    isLoading,
    fetchFlashcards,
    flashcards,
    editFlashcard
  } = flashcardStore();
  // State for tracking selected cards and modal visibility
  const [selectedCards, setSelectedCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const toast = useCustomToast();

  // useEffect(() => {
  //   fetchFlashcards()
  // },[fetchFlashcards])

  useEffect(() => {
    if (deckId) {
      fetchLibraryCards(deckId, selectedDifficulty);
    }
  }, [deckId, fetchLibraryCards, selectedDifficulty, setSelectedDifficulty]);

  const onSubmitFlashcard = async (formData, selectedCards, isNewDeck) => {
    const questions = selectedCards.map((card) => {
      return {
        questionType: 'openEnded',
        question: card.front,
        answer: card.back,
        explanation: card.explanation || '',
        numberOfAttempts: 0,
        currentStep: 0,
        totalSteps: 0,
        currentStudy: null
      };
    });
    const data = {
      deckname: formData.deckname,
      studyType: formData.studyType,
      subject: selectedCards[0].subject.name,
      level: formData.level,
      topic: selectedCards[0].topic.name,
      studyPeriod: 'noRepeat' as const,
      questions: questions,
      scores: [],
      source: 'shepherd' as const,
      currentStudy: null
    };
    try {
      if (isNewDeck) {
        const response = await createFlashCard(data, 'manual');
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
      } else {
        const response = await editFlashcard(formData.selectedDeckId, data);
        if (response) {
          toast({
            title: `${data.deckname} updated`,
            position: 'top-right',
            status: 'success',
            isClosable: true
          });
        } else {
          toast({
            title: `Failed to update ${data.deckname}, try again`,
            position: 'top-right',
            status: 'error',
            isClosable: true
          });
        }
      }
    } catch (error) {
      toast({
        title: isNewDeck
          ? 'Failed to create flashcard, try again'
          : `Failed to updage ${data.deckname}, try again`,
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };

  const options = (card: LibraryCardData) => [
    {
      label: 'Save',
      onClick: () => {
        console.log('Save');
      },
      icon: <YourFlashCardIcon />
    }
  ];

  const handleCardSelect = (card, isSelected) => {
    setSelectedCards((prev) =>
      isSelected ? [...prev, card] : prev.filter((car) => car.id !== card.id)
    );
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleFormSubmit = (formData, isNewDeck) => {
    onSubmitFlashcard(formData, selectedCards, isNewDeck);
    toggleModal();
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

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
      <Flex justify="row" justifyContent="space-between" mb="4">
        {
          <Select
            placeholder="Filter by difficulty"
            onChange={handleDifficultyChange}
            width={{ base: '60%', sm: '50%', md: '40%', lg: '20%' }}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Difficult">Difficult</option>
            {/* Add More options similar to Data */}
          </Select>
        }
        {selectedCards.length > 0 && (
          <Button onClick={toggleModal}>Add to Deck</Button>
        )}
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
        {libraryCards.map((card) => (
          <LibraryCard
            key={card._id}
            question={card.front}
            difficulty={card.difficulty}
            answer={card.back}
            explanation={card.explainer}
            options={options(card)}
            onSelect={(isSelected) => handleCardSelect(card, isSelected)}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default LibraryCardList;
