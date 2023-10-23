import { WardIcon } from '../../../../components/icons';
import { QuizQuestion } from '../../../../types';
import { useQuizState } from '../context';
import { QuestionIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Input,
  HStack,
  Button,
  Textarea,
  Tooltip
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

// DownloadIcon

const TextQuizForm = ({ addQuestion }) => {
  const { setQuestions, goToQuestion, currentQuestionIndex, questions } =
    useQuizState();

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    type: 'multipleChoiceSingle', //default question type option
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
        <FormLabel color={'text.500'}>Enter a text</FormLabel>
        <Textarea
          h={'200px'}
          _placeholder={{
            color: 'text.700',
            fontSize: '14px'
          }}
          placeholder="Generate questions from your notes. 
          Type or copy and paste from your notes. 
          Maximum 200 characters. Premium subscribers get up to 5000 characters"
          size="lg"
        />
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
          <option value="multipleChoiceSingle">Multiple Choice</option>
          <option value="openEnded">Open Ended</option>
          <option value="trueFalse">True/False</option>
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

export default TextQuizForm;
