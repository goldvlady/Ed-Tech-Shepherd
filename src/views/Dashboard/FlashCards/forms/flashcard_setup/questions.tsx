import { useFlashCardState, FlashcardQuestion } from '../../context/flashcard';
import { HStack, Textarea } from '@chakra-ui/react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

const FlashCardQuestionsPage = () => {
  const {
    flashcardData,
    goToNextStep,
    setQuestions,
    goToQuestion,
    currentQuestionIndex,
    questions
  } = useFlashCardState();

  const [currentQuestion, setCurrentQuestion] = useState<FlashcardQuestion>({
    questionType: '',
    question: '',
    options: [],
    answer: ''
  });

  const questionVariants = {
    hidden: { x: '-100vw' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 120 } },
    exit: { x: '100vw', transition: { ease: 'easeInOut' } }
  };

  const answerVariants = {
    hidden: { y: '100vh' },
    visible: { y: 0, transition: { type: 'spring', stiffness: 120 } },
    exit: { y: '-100vh', transition: { ease: 'easeInOut' } }
  };

  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      setCurrentQuestion(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questions]);

  const questionsCount = flashcardData.numQuestions;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('option')) {
      const optionIndex = Number(name.replace('option', ''));
      setCurrentQuestion((prevQuestion) => {
        const newOptions = [...(prevQuestion.options || [])];
        newOptions[optionIndex] = value;
        return {
          ...prevQuestion,
          options: newOptions
        };
      });
    } else {
      setCurrentQuestion((prevQuestion) => ({
        ...prevQuestion,
        [name]: value
      }));
    }
  };

  const handleQuestionSubmit = () => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[currentQuestionIndex] = currentQuestion;
      return updatedQuestions;
    });
    if (questions.length > currentQuestionIndex + 1) {
      goToQuestion((prevIndex) => prevIndex + 1);
      setCurrentQuestion({
        questionType: '',
        question: '',
        options: [],
        answer: ''
      });
    }
  };

  const handlePreviousQuestion = () => {
    goToQuestion((prevIndex: number) => prevIndex - 1);
  };

  const handleSubmit = () => {
    goToNextStep();
  };
  const isFinalQuestion = currentQuestionIndex === questionsCount - 1;

  return (
    <Box width={'100%'} mt="40px">
      <motion.div
        variants={questionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Box
          px={'12px'}
          py={'6px'}
          mb="40px"
          borderRadius="md"
          background={'#F4F5F6'}
          width={'fit-content'}
          display="flex"
          justifyContent={'center'}
          alignItems="center"
        >
          <Text fontSize="sm" lineHeight="normal" color="#6E7682">
            Question goes here {currentQuestionIndex + 1}/{questions.length}
          </Text>
          <Text
            fontSize="sm"
            lineHeight="normal"
            color="#6E7682"
            ml="6px"
          ></Text>
          <FiChevronRight color="#6E7682" />
        </Box>
        <FormControl mb={4}>
          <FormLabel>Select question type:</FormLabel>
          <Select
            name="questionType"
            placeholder="e.g. Multiple choice"
            value={currentQuestion.questionType}
            onChange={handleChange}
          >
            <option value="multipleChoice">Multiple Choice</option>
            <option value="openEnded">Open Ended</option>
            <option value="trueFalse">True/False</option>
            {/* <option value="fillTheBlank">Fill the Blank</option> */}
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Enter your question:</FormLabel>
          <Textarea
            _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
            name="question"
            placeholder="Enter your question here"
            value={currentQuestion.question}
            onChange={handleChange}
          />
        </FormControl>
        <>
          {currentQuestion.questionType === 'multipleChoice' &&
            Array.from({ length: 4 }).map((_, index) => (
              <FormControl key={index} mb={4}>
                <FormLabel>{`Option ${String.fromCharCode(
                  65 + index
                )}:`}</FormLabel>
                <Input
                  type="text"
                  name={`option${index}`}
                  _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  value={currentQuestion.options?.[index] || ''}
                  onChange={handleChange}
                />
              </FormControl>
            ))}
        </>
        <motion.div
          variants={answerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {currentQuestion.questionType && (
            <FormControl mb={4}>
              <FormLabel>Answer:</FormLabel>
              {currentQuestion.questionType === 'multipleChoice' && (
                <Select
                  name="answer"
                  placeholder="Select answer"
                  value={currentQuestion.answer}
                  onChange={handleChange}
                >
                  <option value="optionA">Option A</option>
                  <option value="optionB">Option B</option>
                  <option value="optionC">Option C</option>
                  <option value="optionD">Option D</option>
                </Select>
              )}

              {currentQuestion.questionType === 'trueFalse' && (
                <Select
                  name="answer"
                  placeholder="Select answer"
                  value={currentQuestion.answer}
                  onChange={handleChange}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </Select>
              )}
              {currentQuestion.questionType === 'openEnded' && (
                <Textarea
                  _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
                  name="answer"
                  placeholder="Select answer"
                  value={currentQuestion.answer}
                  onChange={handleChange}
                />
              )}
            </FormControl>
          )}
        </motion.div>

        <HStack
          w="100%"
          alignItems={'center'}
          justifyContent={'end'}
          marginTop="40px"
          align={'flex-end'}
        >
          {currentQuestionIndex > 0 && (
            <Button
              aria-label="Edit"
              height={'fit-content'}
              width={'fit-content'}
              variant="unstyled"
              fontWeight={500}
              p={0}
              color={'#207DF7'}
              _hover={{ bg: 'none', padding: '0px' }}
              _active={{ bg: 'none', padding: '0px' }}
              _focus={{ boxShadow: 'none' }}
              colorScheme="primary"
              onClick={handlePreviousQuestion}
              mr={2}
            >
              Previous
            </Button>
          )}
          (
          <Button
            borderRadius="8px"
            p="10px 20px"
            fontSize="14px"
            lineHeight="20px"
            variant="solid"
            colorScheme="primary"
            onClick={() => {
              handleQuestionSubmit();
            }}
            ml={5}
          >
            Next Question
          </Button>
          )
        </HStack>
      </motion.div>
    </Box>
  );
};

export default FlashCardQuestionsPage;
