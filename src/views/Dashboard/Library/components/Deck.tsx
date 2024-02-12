import React from 'react';
import { Box, Flex, Text, Image } from '@chakra-ui/react';

interface DeckProps {
  data: {
    name: string;
  };
  onClick: () => void;
}

const flashcardQuestions = [
  'What psychological theory posits that people operate based on complex systems of beliefs, desires, and intentions when interacting socially?',
  'In the context of environmental science, explain the significance of the Keystone XL pipeline controversy.',
  "Discuss the principles behind the architectural design movement known as 'Brutalism' and its impact on 20th-century architecture.",
  'What are the implications of the Heisenberg Uncertainty Principle in quantum mechanics for our understanding of particle behavior?',
  'How did the Peace of Westphalia, signed in 1648, redefine the concept of state sovereignty in international relations?'
];

function getRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * flashcardQuestions.length);
  return flashcardQuestions[randomIndex];
}

const Deck: React.FC<DeckProps> = ({ data, onClick }) => {
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  const randomQuestion = getRandomQuestion();

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        onClick={handleCardClick}
        cursor="pointer"
      >
        <Box position="relative" height="300px">
          <Image
            src="/images/deck-image.png"
            alt={`${data.name} deck thumbnail`}
            objectFit="cover"
            width="full"
            height="full"
            cursor="pointer"
            onClick={handleCardClick}
          />
          <Box
            position="absolute"
            top="10%"
            left="20%"
            width="60%"
            height="60%"
            overflow="hidden"
            p="4"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Text fontSize="sm" fontFamily={'inter'} noOfLines={6}>
              {`Our curated questions about ${data.name}`}
            </Text>
          </Box>
        </Box>
        <Flex p="4" align="center" justify="space-between">
          <Box flex="1" cursor="pointer">
            <Text fontWeight="bold">{data.name}</Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Deck;
