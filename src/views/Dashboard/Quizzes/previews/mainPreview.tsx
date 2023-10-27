import SelectComponent, { Option } from '../../../../components/Select';
import {
  LightningBoltIcon,
  KeepQuizIcon,
  EditQuizIcon,
  DeleteQuizIcon
} from '../../../../components/icons';
import { QuizData, QuizQuestion, QuizQuestionOption } from '../../../../types';
import { CheckIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Input
} from '@chakra-ui/react';
import {
  defaultTo,
  forEach,
  isEmpty,
  isNil,
  last,
  split,
  toLower
} from 'lodash';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

const PreviewQuizCard = ({
  question,
  index,
  handleUpdateQuizQuestion
}: {
  question: QuizQuestion;
  index: number;
  handleUpdateQuizQuestion: (id: number, question: QuizQuestion) => void;
}) => {
  const ref = useRef(null);
  const [isEditable, setIsEditable] = useState(false);
  const [answer, setAnswer] = useState('');
  const [optionAnswer, setOptionAnswer] = useState('');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [type, setType] = useState(null);
  const [updateOptions, setUpdateOptions] = useState<
    Record<string, QuizQuestionOption>
  >({});

  const handleSetIsEditiable = () => setIsEditable(true);
  const handleSetIsDisabled = () => setIsEditable(false);
  const handleSetClearState = () => {
    setUpdateOptions({});
    setOptionAnswer('');
    setAnswer('');
    setQuizQuestion('');
    setType(null);
    handleSetIsDisabled();
  };
  const handleUpdateQuiz = () => {
    const options = (() => {
      let options = [...question.options];
      const [_, index] = split(optionAnswer, ':');
      if (type === 'trueFalse') {
        options = [
          { content: 'True', isCorrect: false },
          { content: 'False', isCorrect: false }
        ];

        options = options.map((option) => {
          if (toLower(option.content) === toLower(index)) {
            return {
              ...option,
              isCorrect: true
            };
          }
          return option;
        });

        return options;
      }

      options = options.map((option) => {
        return {
          content: option.content,
          isCorrect: false
        };
      });
      options[index] = {
        ...question?.options[index],
        ...updateOptions[optionAnswer],
        isCorrect: true
      };

      return options;
    })();

    const questionData: QuizQuestion = {
      question: !isEmpty(quizQuestion) ? quizQuestion : question.question,
      type
    };

    if (type === 'openEnded') {
      questionData.answer = answer;
    }

    if (type !== 'openEnded') {
      questionData.options = options;
    }
    handleUpdateQuizQuestion(index, questionData);
    handleSetClearState();
  };

  const handleUpdateOption = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setUpdateOptions((prevQuestion: any) => {
      const { name, value } = e.target;
      let newOptions = {};

      if (type === 'trueFalse') {
        newOptions = { ...prevQuestion };
        newOptions[value] = { content: name, isCorrect: false };
        return {
          ...prevQuestion,
          ...newOptions
        };
      }

      newOptions = { ...prevQuestion };
      newOptions[name] = { content: value, isCorrect: false };
      return {
        ...prevQuestion,
        ...newOptions
      };
    });
  };

  const handleChangeQuestionType = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { value } = e.target;

    setType(value);
  };

  useEffect(() => {
    if (isEditable) {
      setType(question?.type);
    }
  }, [isEditable, question.type]);

  const typeOptions = [
    { label: 'Multiple Single Choice', value: 'multipleChoiceSingle' },
    { label: 'True/False', value: 'trueFalse' },
    { label: 'Open Ended', value: 'openEnded' }
  ];

  const trueFalseOptions = [
    { label: 'True', value: 'true' },
    { label: 'False', value: 'false' }
  ];

  useOnClickOutside(ref, handleSetClearState);

  return (
    <Box ref={ref} borderRadius={'8px'} mt={10} bg="white" w="100%">
      <VStack
        alignItems={'flex-start'}
        justifyContent={'flex-start'}
        p={'18px 16px'}
      >
        <HStack
          mb={'17px'}
          alignItems={'center'}
          minW={'30%'}
          flexWrap={'nowrap'}
        >
          <Text fontSize="md" fontWeight="semibold">
            {index + 1}.
          </Text>
          {isEditable ? (
            <Input
              onChange={(e) => setQuizQuestion(e.target.value)}
              value={!isEmpty(quizQuestion) ? quizQuestion : question?.question}
            />
          ) : (
            <Text fontSize="md" fontWeight="semibold">
              {!isEmpty(quizQuestion) ? quizQuestion : question.question}
            </Text>
          )}
        </HStack>
        {isEditable && (
          <VStack mb={'24px'}>
            <SelectComponent
              name="type"
              placeholder="Select Question Type"
              defaultValue={typeOptions.find(
                (option) => option.value === question.type
              )}
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
          </VStack>
        )}
        {!isEmpty(type) && !isNil(type) ? (
          <>
            {type === 'multipleChoiceSingle' && (
              <RadioGroup
                onChange={(e) => {
                  setOptionAnswer(e);
                }}
                value={'1'}
                mb="24px"
                w={'100%'}
              >
                <Stack direction="column" w={'100%'}>
                  {Array.from({ length: 4 }).map((_, optionIndex) => (
                    <Box
                      key={optionIndex}
                      display={'flex'}
                      flexDirection={'row'}
                      alignItems={'center'}
                      w={'100%'}
                    >
                      <label
                        className="w-2/3 font-[Inter] text-dark font-[400] text-[14px] leading-[20px] flex justify-start items-center cursor-pointer"
                        htmlFor={`option${optionIndex}`}
                      >
                        <Radio
                          value={
                            !isEmpty(optionAnswer)
                              ? optionAnswer === `option:${optionIndex}`
                                ? '1'
                                : `option:${optionIndex}`
                              : question?.options[optionIndex]?.isCorrect
                              ? '1'
                              : `option:${optionIndex}`
                          }
                          type="radio"
                          id={`option${optionIndex}`}
                          name={`option:${optionIndex}`}
                          mr={1}
                          isDisabled={!isEditable}
                        />
                        <Input
                          isDisabled={!isEditable}
                          type="text"
                          name={`option:${optionIndex}`}
                          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
                          placeholder={`Option ${String.fromCharCode(
                            65 + optionIndex
                          )}`}
                          defaultValue={question.options[optionIndex]?.content}
                          value={
                            !isEmpty(
                              updateOptions[`option:${optionIndex}`]?.content
                            )
                              ? updateOptions[`option:${optionIndex}`]?.content
                              : question.options[optionIndex]?.content
                          }
                          onChange={handleUpdateOption}
                          maxW={'250px'}
                        />
                      </label>
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            )}

            {type === 'trueFalse' && (
              <SelectComponent
                name="answer"
                placeholder="Select answer"
                defaultValue={
                  question.type === 'trueFalse'
                    ? typeOptions.find((option) => {
                        let selectedOption: any = false;
                        forEach(question?.options, (item) => {
                          if (
                            toLower(option?.label) === toLower(item.content) &&
                            item?.isCorrect === true
                          ) {
                            selectedOption = option;
                          }
                        });
                        return selectedOption;
                      })
                    : false
                }
                options={trueFalseOptions}
                size={'md'}
                onChange={(option) => {
                  const event = {
                    target: {
                      name: (option as Option).label,
                      value: (option as Option).value
                    }
                  } as ChangeEvent<HTMLSelectElement>;
                  handleUpdateOption(event);
                  setOptionAnswer(`option:${(option as Option).value}`);
                }}
              />
            )}

            {type === 'openEnded' && (
              <Box mt={2} w={'100%'} mb="24px">
                <Textarea
                  w={'100%'}
                  h={'69px'}
                  p={'12px 14px'}
                  isDisabled={!isEditable}
                  defaultValue={question.answer}
                  value={
                    !isEmpty(answer)
                      ? answer
                      : question.type === 'openEnded'
                      ? question.answer
                      : ''
                  }
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </Box>
            )}
          </>
        ) : (
          <>
            {question.type === 'multipleChoiceSingle' && (
              <RadioGroup
                onChange={(e) => {
                  setOptionAnswer(e);
                }}
                value={'1'}
                mb="24px"
              >
                <Stack direction="column">
                  {question?.options?.map((option, optionIndex) => (
                    <Box
                      key={optionIndex}
                      display={'flex'}
                      flexDirection={'row'}
                      alignItems={'center'}
                    >
                      <label
                        className="font-[Inter] text-dark font-[400] text-[14px] leading-[20px]  flex justify-center items-center cursor-pointer"
                        htmlFor={`option${optionIndex}`}
                      >
                        <Radio
                          value={
                            !isEmpty(optionAnswer)
                              ? optionAnswer === `option:${optionIndex}`
                                ? '1'
                                : `option:${optionIndex}`
                              : option?.isCorrect
                              ? '1'
                              : `option:${optionIndex}`
                          }
                          type="radio"
                          id={`option${optionIndex}`}
                          name={`option:${optionIndex}`}
                          mr={1}
                          isDisabled={!isEditable}
                        />

                        {option?.content}
                      </label>
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            )}
            {question.type === 'trueFalse' && (
              <RadioGroup
                onChange={(e) => {
                  setOptionAnswer(e);
                }}
                value={'1'}
                mb="24px"
              >
                <Stack direction="column">
                  {question?.options?.map((option, optionIndex) => (
                    <Box
                      key={optionIndex}
                      display={'flex'}
                      flexDirection={'row'}
                      alignItems={'center'}
                    >
                      <label
                        className="font-[Inter] text-dark font-[400] text-[14px] leading-[20px] flex justify-center items-center cursor-pointer"
                        htmlFor={`${toLower(option.content)}-${optionIndex}`}
                      >
                        <Radio
                          value={
                            !isEmpty(optionAnswer)
                              ? optionAnswer === `option:${optionIndex}`
                                ? '1'
                                : `option:${optionIndex}`
                              : option?.isCorrect
                              ? '1'
                              : `option:${optionIndex}`
                          }
                          type="radio"
                          id={`${toLower(option.content)}-${optionIndex}`}
                          name={`option:${optionIndex}`}
                          mr={1}
                          isDisabled={!isEditable}
                        />

                        {option.content}
                      </label>
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            )}
            {question.type === 'openEnded' && (
              <Box mt={2} w={'100%'} mb="24px">
                <Textarea
                  w={'100%'}
                  h={'69px'}
                  p={'12px 14px'}
                  isDisabled={!isEditable}
                  value={question.answer}
                />
              </Box>
            )}
          </>
        )}
      </VStack>

      <hr className="w-full border border-gray-400" />
      <Box minH={'24px'} p="16px">
        <HStack justifyContent={'space-between'}>
          {!isEmpty(optionAnswer) || !isEmpty(answer)
            ? isEditable && (
                <Box
                  display={'flex'}
                  borderRadius={'50%'}
                  bg={'#F4F5F6'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  w={'30px'}
                  h={'30px'}
                  _hover={{ opacity: '0.5', cursor: 'pointer' }}
                >
                  <KeepQuizIcon
                    className={'h-[24px] w-[24px] text-gray-500 cursor-pointer'}
                    onClick={handleUpdateQuiz}
                  />
                </Box>
              )
            : null}

          <HStack ml={'auto'}>
            {!isEditable && (
              <EditQuizIcon
                className={
                  'h-[24px] w-[24px] text-gray-500 mx-3 hover:opacity-50 cursor-pointer'
                }
                onClick={handleSetIsEditiable}
              />
            )}
            {isEditable && (
              <Box
                display={'flex'}
                borderRadius={'50%'}
                bg={'#F4F5F6'}
                alignItems={'center'}
                justifyContent={'center'}
                w={'30px'}
                h={'30px'}
                _hover={{ opacity: '0.5', cursor: 'pointer' }}
              >
                <CloseIcon
                  color={'text.800'}
                  w={'14px'}
                  h={'14px'}
                  onClick={handleSetClearState}
                />
              </Box>
            )}

            {!isEditable && (
              <DeleteQuizIcon
                className={
                  'h-[24px] w-[24px] text-gray-500 hover:opacity-50 cursor-pointer'
                }
                onClick={() => ''}
              />
            )}
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

const QuizPreviewer = ({
  questions,
  onOpen,
  createQuiz,
  updateQuiz,
  isLoadingButton,
  quizId,
  handleUpdateQuizQuestion
}: {
  questions: QuizQuestion[];
  onOpen?: () => void;
  createQuiz: () => void;
  updateQuiz: () => void;
  isLoadingButton: boolean;
  quizId: string;
  handleUpdateQuizQuestion: (id: number, question: QuizQuestion) => void;
}) => {
  return (
    <Box
      as="section"
      pt={'40px'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      h={'100%'}
      maxH={'100%'}
      overflowY={'auto'}
    >
      <Box w="70%" maxW="700px" mb={10}>
        <Box
          display={'flex'}
          alignItems={'flex-start'}
          justifyContent={'space-between'}
          w={'100%'}
        >
          <Text
            fontFamily="Inter"
            fontWeight="500"
            fontSize="18px"
            lineHeight="23px"
            color="text.200"
          >
            Review Your Quiz
          </Text>
          <HStack justifyContent={'flex-end'} alignItems={'center'}>
            {!isEmpty(questions) && (
              <Button
                width={'140px'}
                borderRadius="8px"
                fontSize="14px"
                lineHeight="20px"
                variant="solid"
                colorScheme="primary"
                onClick={onOpen}
                ml={5}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
              >
                <LightningBoltIcon
                  className={'h-[20px] w-[20px] mx-2'}
                  onClick={onOpen}
                />
                Study
              </Button>
            )}

            {!isEmpty(questions) &&
              (isEmpty(quizId) ? (
                <Button
                  width={'140px'}
                  borderRadius="8px"
                  fontSize="14px"
                  lineHeight="20px"
                  variant="solid"
                  colorScheme="primary"
                  onClick={createQuiz}
                  ml={5}
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  isLoading={isLoadingButton}
                >
                  <AddIcon mx={2} />
                  Create
                </Button>
              ) : (
                <Button
                  width={'140px'}
                  borderRadius="8px"
                  fontSize="14px"
                  lineHeight="20px"
                  variant="solid"
                  colorScheme="primary"
                  onClick={updateQuiz}
                  ml={5}
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  isLoading={isLoadingButton}
                >
                  <CheckIcon mx={2} />
                  Update
                </Button>
              ))}
          </HStack>
        </Box>

        <Box maxH={'85vh'} h={'100%'} overflowY={'auto'}>
          <Box w={'100%'} px="16px">
            {/* Render questions preview */}
            {questions.length > 0 &&
              questions.map((question, index) => (
                <PreviewQuizCard
                  question={question}
                  index={index}
                  handleUpdateQuizQuestion={handleUpdateQuizQuestion}
                />
              ))}
            <Box p="32px" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default QuizPreviewer;
