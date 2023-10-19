import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

interface QuizQuestion {
  questionType: string;
  question: string;
  options: string[];
  answer: string;
}

// interface QuizPreviewerProps {
//   questions: QuizQuestion[];
// }

const QuizPreviewer = ({ questions }) => {
  return (
    <Box
      //   width={['100%', '100%', '50%', '70%']}
      padding={['0 10%', '0 20%', '0 20%', '0 20%']}
    >
      <Text
        fontFamily="Inter"
        fontWeight="500"
        fontSize="18px"
        lineHeight="23px"
        color="#212224"
        mt={10}
      >
        Review Your Quiz
      </Text>
      {/* Render questions preview */}
      {questions.map((question, index) => (
        <Box key={index} mt={10} bg="white" padding="10px 30px">
          {/* <Text fontSize="md" fontWeight="semibold">
            {question.questionType === 'multipleChoice'
              ? 'Multiple Choice:'
              : question.questionType === 'trueFalse'
              ? 'True/False:'
              : 'Open Ended:'}
          </Text> */}
          <HStack>
            <Text fontSize="md" mt={2} fontWeight="semibold">
              {index + 1}.
            </Text>
            <Text fontSize="md" mt={2} fontWeight="semibold">
              {question.question}
            </Text>
          </HStack>
          {question.questionType === 'multipleChoice' && (
            <Box mt={2}>
              {question.options.map((option, optionIndex) => (
                <Box key={optionIndex}>
                  <input
                    type="radio"
                    id={`option${optionIndex}`}
                    name={`question${index}`}
                  />
                  <label htmlFor={`option${optionIndex}`}>{option}</label>
                </Box>
              ))}
            </Box>
          )}
          {question.questionType === 'trueFalse' && (
            <Box mt={2}>
              <input
                type="radio"
                id={`true${index}`}
                name={`question${index}`}
              />
              <label htmlFor={`true${index}`}>True</label>
              <br />
              <input
                type="radio"
                id={`false${index}`}
                name={`question${index}`}
              />
              <label htmlFor={`false${index}`}>False</label>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default QuizPreviewer;
