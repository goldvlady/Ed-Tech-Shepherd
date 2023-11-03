import TableTag from '../../../../components/CustomComponents/CustomTag';
import SelectComponent, { Option } from '../../../../components/Select';
import {
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  QuizQuestion,
  QuizQuestionOption,
  TRUE_FALSE
} from '../../../../types';
import { useQuizState } from '../context';
import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  HStack,
  Button
} from '@chakra-ui/react';
import {
  forEach,
  isEmpty,
  keys,
  omit,
  toLower,
  toString,
  values
} from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';

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
    type: MULTIPLE_CHOICE_SINGLE, //default question type option
    question: '',
    options: {},
    answer: ''
  });

  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      const options = {};
      if (questions[currentQuestionIndex].type === TRUE_FALSE) {
        forEach(questions[currentQuestionIndex].options, (option) => {
          const { content } = option;
          options[toLower(content)] = option;
        });
      }
      if (questions[currentQuestionIndex].type === MULTIPLE_CHOICE_SINGLE) {
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
      return updatedQuestions;
    });

    goToQuestion((prevIndex) => prevIndex + 1);

    let data: any = {
      ...currentQuestion,
      options: values(currentQuestion?.options)
    };

    if (currentQuestion.type === OPEN_ENDED) {
      data = omit(data, ['options']);
    }
    if (currentQuestion.type !== OPEN_ENDED) {
      data = omit(data, ['answer']);
    }

    addQuestion(data);

    setTimeout(() => {
      setCurrentQuestion({
        type: MULTIPLE_CHOICE_SINGLE,
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
      if (prevQuestion.type === TRUE_FALSE) {
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
      if (prevQuestion.type === MULTIPLE_CHOICE_SINGLE) {
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
        [name]: toString(value)
      };
    });
  };

  const typeOptions = [
    { label: 'Multiple Single Choice', value: MULTIPLE_CHOICE_SINGLE },
    { label: 'True/False', value: TRUE_FALSE },
    { label: 'Open Ended', value: OPEN_ENDED }
  ];

  const trueFalseOptions = [
    { label: 'True', value: true },
    { label: 'False', value: false }
  ];

  const multipleChoiceSingleOptions = [
    { label: 'Option A', value: 'optionA' },
    { label: 'Option B', value: 'optionB' },
    { label: 'Option C', value: 'optionC' },
    { label: 'Option D', value: 'optionD' }
  ];

  return (
    <Box width={'100%'} mt="20px">
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
        <FormLabel textColor={'text.600'}>Enter a title</FormLabel>
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
        <FormLabel textColor={'text.600'}>Select question type:</FormLabel>

        <SelectComponent
          name="type"
          placeholder="Select Type"
          options={typeOptions}
          size={'md'}
          onChange={(option) => {
            const event = {
              target: {
                name: 'type',
                value: (option as Option).value
              }
            } as ChangeEvent<HTMLSelectElement>;
            handleChangeQuestionType(event);
          }}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel textColor={'text.600'}>Enter your question:</FormLabel>
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
          currentQuestion.type === MULTIPLE_CHOICE_SINGLE &&
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
          <FormLabel textColor={'text.600'}>Answer:</FormLabel>
          {currentQuestion.type === MULTIPLE_CHOICE_SINGLE && (
            <SelectComponent
              name="answer"
              placeholder="Select answer"
              options={multipleChoiceSingleOptions}
              size={'md'}
              onChange={(option) => {
                const event = {
                  target: {
                    name: 'answer',
                    value: (option as Option).value
                  }
                } as ChangeEvent<HTMLSelectElement>;
                handleSetOptionAnswer(event);
              }}
            />
          )}

          {currentQuestion.type === TRUE_FALSE && (
            <SelectComponent
              name="answer"
              placeholder="Select answer"
              options={trueFalseOptions}
              size={'md'}
              onChange={(option) => {
                const event = {
                  target: {
                    name: 'answer',
                    value: (option as Option).value
                  }
                } as ChangeEvent<HTMLSelectElement>;
                handleSetOptionAnswer(event);
              }}
            />
          )}
          {currentQuestion.type === OPEN_ENDED && (
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
        <Button
          borderRadius="8px"
          p="10px 20px"
          fontSize="14px"
          lineHeight="20px"
          variant="solid"
          colorScheme="primary"
          onClick={openTags}
          ml={5}
          isDisabled={isEmpty(title) || tags?.length >= 10}
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
