import { UploadIcon, WardIcon } from '../../../../components/icons';
import {
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  QuizQuestion,
  TRUE_FALSE
} from '../../../../types';
import { useQuizState } from '../context';
import { QuestionIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Input,
  HStack,
  Button,
  InputGroup,
  InputLeftElement,
  Tooltip
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

// DownloadIcon

const UploadQuizForm = ({ addQuestion, handleSetTitle }) => {
  const {
    quizData,
    goToNextStep,
    setQuestions,
    goToQuestion,
    currentQuestionIndex,
    questions
  } = useQuizState();

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    type: MULTIPLE_CHOICE_SINGLE, //default question type option
    question: '',
    options: [],
    answer: ''
  });

  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      setCurrentQuestion(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questions]);

  const handleChangeQuestionType = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setCurrentQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value
    }));
  };

  const handleQuestionAdd = () => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[currentQuestionIndex] = currentQuestion;
      // console.log('updatedQuestions', updatedQuestions);
      return updatedQuestions;
    });
    // if (questions.length > currentQuestionIndex + 1) {
    goToQuestion((prevIndex) => prevIndex + 1);

    addQuestion(currentQuestion);

    setCurrentQuestion({
      type: 'multipleChoiceSingle',
      question: '',
      options: [],
      answer: ''
    });
    // }
  };

  const handlePreviousQuestion = () => {
    goToQuestion((prevIndex: number) => prevIndex - 1);
  };

  return (
    <Box width={'100%'} mt="20px" padding="0 10px">
      <FormControl mb={7}>
        <FormLabel color={'text.500'}>Enter a topic</FormLabel>
        <InputGroup
          flexDirection={'row'}
          alignItems={'center'}
          height={'48px'}
          sx={{
            'input[type=text]': {
              paddingLeft: '32px'
            }
          }}
        >
          <InputLeftElement
            pointerEvents="none"
            flexDirection={'row'}
            alignItems={'center'}
            mt={'4px'}
            mr={'4px'}
            children={
              <UploadIcon
                className={'h-[20px]'}
                onClick={() => {
                  ('');
                }}
              />
            }
          />
          <Input
            type="text"
            placeholder="Upload doc"
            paddingLeft={'40px'}
            _placeholder={{
              color: 'text.200',
              fontSize: '14px'
            }}
          />
        </InputGroup>
        <FormHelperText textColor={'text.300'}>
          Shepherd supports .pdf, .ppt, .jpg & .txt document formats
        </FormHelperText>
      </FormControl>

      <FormControl mb={7}>
        <FormLabel color={'text.500'}>Question type:</FormLabel>
        <Select
          height={'48px'}
          sx={{
            padding: '8px'
          }}
          name="type"
          value={currentQuestion.type}
          onChange={handleChangeQuestionType}
          textColor={'text.700'}
        >
          <option value={MULTIPLE_CHOICE_SINGLE}>Multiple Choice</option>
          <option value={OPEN_ENDED}>Open Ended</option>
          <option value={TRUE_FALSE}>True/False</option>
        </Select>
      </FormControl>

      <FormControl mb={7}>
        <FormLabel color={'text.500'}>
          Number of questions
          <Tooltip
            hasArrow
            label="Number of questions to create"
            placement="right-end"
          >
            <QuestionIcon mx={2} w={3} h={3} />
          </Tooltip>
        </FormLabel>
        <Input textColor={'text.700'} height={'48px'} type="number" />
      </FormControl>

      {/* 
      {currentQuestion.questionType && (
        <FormControl mb={4}>
          <FormLabel>Answer:</FormLabel>
          {currentQuestion.questionType === 'multipleChoiceSingle' && (
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
      )} */}

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
          width={'180px'}
          borderRadius="8px"
          p="10px 20px"
          fontSize="14px"
          lineHeight="20px"
          variant="solid"
          colorScheme="primary"
          onClick={handleQuestionAdd}
          ml={5}
        >
          <WardIcon className={'h-[20px] w-[20px] mx-2'} onClick={() => ''} />
          Generate
        </Button>
        )
      </HStack>
    </Box>
  );
};

export default UploadQuizForm;
