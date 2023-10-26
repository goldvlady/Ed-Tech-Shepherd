import TableTag from '../../../../components/CustomComponents/CustomTag';
import ApiService from '../../../../services/ApiService';
import { QuizQuestion, QuizQuestionOption } from '../../../../types';
import { useQuizState } from '../context';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Input,
  HStack,
  Button
} from '@chakra-ui/react';
import { forEach, isEmpty, keys, omit, toLower, values } from 'lodash';
import { useEffect, useState } from 'react';

const ManualQuizForm = ({
  addQuestion,
  openTags,
  tags,
  removeTag,
  isLoadingButton,
  title,
  handleSetTitle
}) => {
  const { setQuestions, goToQuestion, currentQuestionIndex, questions } =
    useQuizState();

  const [currentQuestion, setCurrentQuestion] = useState<
    Omit<QuizQuestion, 'options'> & {
      options?: Record<string, QuizQuestionOption> | QuizQuestionOption[];
    }
  >({
    type: 'multipleChoiceSingle', //default question type option
    question: '',
    options: {},
    answer: ''
  });

  // const [title, setTitle] = useState('');

  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      const options = {};
      if (questions[currentQuestionIndex].type === 'trueFalse') {
        forEach(questions[currentQuestionIndex].options, (option) => {
          const { content } = option;
          options[toLower(content)] = option;
        });
      }
      if (questions[currentQuestionIndex].type === 'multipleChoiceSingle') {
        forEach(questions[currentQuestionIndex].options, (option, index) => {
          options[`option${String.fromCharCode(65 + index)}`] = option;
        });
      }
      setCurrentQuestion({
        ...questions[currentQuestionIndex],
        options
      });
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

  const handleQuestionAdd = async () => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions] as any;
      updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        options: values(currentQuestion.options)
      };
      // console.log('updatedQuestions', updatedQuestions);
      return updatedQuestions;
    });
    // if (questions.length > currentQuestionIndex + 1) {
    goToQuestion((prevIndex) => prevIndex + 1);

    let data: any = {
      ...currentQuestion,
      options: values(currentQuestion?.options)
    };

    if (currentQuestion.type === 'openEnded') {
      data = omit(data, ['options']);
    }

    // addTitle(title);
    addQuestion(data);

    setTimeout(() => {
      setCurrentQuestion({
        type: 'multipleChoiceSingle',
        question: '',
        options: {},
        answer: ''
      });
    });

    // }
  };

  const handleChangeOption = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setCurrentQuestion((prevQuestion: any) => {
      if (prevQuestion.options) {
        const newOptions = { ...prevQuestion.options };
        newOptions[name] = { content: value, isCorrect: false };
        return {
          ...prevQuestion,
          options: newOptions
        };
      }
    });
  };

  const handleSetOptionAnswer = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentQuestion((prevQuestion: any) => {
      let newOptions = {};
      const optionKeys = keys(prevQuestion.options);

      newOptions = { ...prevQuestion.options };
      if (prevQuestion.type === 'trueFalse') {
        newOptions = {
          true: {
            content: 'True',
            isCorrect: false
          },
          false: {
            content: 'False',
            isCorrect: false
          }
        };
      }
      if (prevQuestion.type === 'multipleChoiceSingle') {
        forEach(optionKeys, (key) => {
          newOptions[key] = {
            ...newOptions[key],
            isCorrect: false
          };
        });
      }

      const prev = newOptions[value];
      newOptions[value] = { ...prev, isCorrect: true };

      return {
        ...prevQuestion,
        options: newOptions,
        [name]: value
      };
    });
  };

  // const handlePreviousQuestion = () => {
  //   goToQuestion((prevIndex: number) => prevIndex - 1);
  // };

  return (
    <Box width={'100%'} mt="20px" padding="0 10px">
      {!isEmpty(tags) && (
        <HStack
          flexWrap={'wrap'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          mb={4}
        >
          {tags.map((tag, idx) => (
            <TableTag
              key={tag}
              label={tag}
              onClick={() => removeTag(idx)}
              showClose
            />
          ))}
        </HStack>
      )}
      <FormControl mb={4}>
        <FormLabel color={'text.500'}>Enter a title</FormLabel>
        <Input
          value={title}
          type="text"
          _placeholder={{
            color: 'text.200',
            fontSize: '14px'
          }}
          height={'48px'}
          onChange={(e) => handleSetTitle(e.target.value)}
          autoComplete="off"
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel color={'text.500'}>Select question type:</FormLabel>
        <Select
          sx={{
            padding: '8px'
          }}
          height={'48px'}
          name="type"
          value={currentQuestion.type}
          onChange={handleChangeQuestionType}
          defaultValue="multipleChoiceSingle"
        >
          <option value="multipleChoiceSingle">Multiple Choice</option>
          <option value="openEnded">Open Ended</option>
          <option value="trueFalse">True/False</option>
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel color={'text.500'}>Enter your question:</FormLabel>
        <Textarea
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
          name="question"
          placeholder="Enter your question here"
          value={currentQuestion.question}
          onChange={handleChangeQuestionType}
        />
      </FormControl>
      <>
        {!isEmpty(currentQuestion.question) &&
          currentQuestion.type === 'multipleChoiceSingle' &&
          Array.from({ length: 4 }).map((_, index) => (
            <FormControl key={index} mb={4}>
              <FormLabel>{`Option ${String.fromCharCode(
                65 + index
              )}:`}</FormLabel>
              <Input
                type="text"
                name={`option${String.fromCharCode(65 + index)}`}
                _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                value={
                  currentQuestion.options &&
                  currentQuestion.options[
                    `option${String.fromCharCode(65 + index)}`
                  ]?.content
                }
                onChange={handleChangeOption}
              />
            </FormControl>
          ))}
      </>
      {!isEmpty(currentQuestion.question) && currentQuestion.type && (
        <FormControl mb={4}>
          <FormLabel color={'text.500'}>Answer:</FormLabel>
          {currentQuestion.type === 'multipleChoiceSingle' && (
            <Select
              sx={{
                padding: '8px'
              }}
              height={'48px'}
              name="answer"
              placeholder="Select answer"
              value={currentQuestion.answer}
              onChange={handleSetOptionAnswer}
            >
              <option value="optionA">Option A</option>
              <option value="optionB">Option B</option>
              <option value="optionC">Option C</option>
              <option value="optionD">Option D</option>
            </Select>
          )}

          {currentQuestion.type === 'trueFalse' && (
            <Select
              sx={{
                padding: '8px'
              }}
              height={'48px'}
              name="answer"
              placeholder="Select answer"
              value={currentQuestion.answer}
              onChange={handleSetOptionAnswer}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </Select>
          )}
          {currentQuestion.type === 'openEnded' && (
            <Textarea
              _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
              name="answer"
              placeholder="Select answer"
              value={currentQuestion.answer}
              onChange={handleSetOptionAnswer}
            />
          )}
        </FormControl>
      )}

      <HStack
        w="100%"
        alignItems={'center'}
        justifyContent={'end'}
        marginTop="40px"
        align={'flex-end'}
      >
        {/* {currentQuestionIndex > 0 && (
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
        )} */}
        <Button
          borderRadius="8px"
          p="10px 20px"
          fontSize="14px"
          lineHeight="20px"
          variant="solid"
          colorScheme="primary"
          onClick={openTags}
          ml={5}
          isDisabled={isEmpty(title) || tags.length >= 10}
          isLoading={isLoadingButton}
        >
          Add Tags
        </Button>
        (
        <Button
          borderRadius="8px"
          p="10px 20px"
          fontSize="14px"
          lineHeight="20px"
          variant="solid"
          colorScheme="primary"
          onClick={handleQuestionAdd}
          ml={5}
          isDisabled={isEmpty(currentQuestion.answer) || isEmpty(title)}
          isLoading={isLoadingButton}
        >
          Add Question
        </Button>
        )
      </HStack>
    </Box>
  );
};

export default ManualQuizForm;
