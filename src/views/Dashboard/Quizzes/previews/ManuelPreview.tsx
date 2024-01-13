import SelectComponent, { Option } from '../../../../components/Select';
import {
  LightningBoltIcon,
  KeepQuizIcon,
  EditQuizIcon,
  DeleteQuizIcon
} from '../../../../components/icons';
import {
  MULTIPLE_CHOICE_MULTI,
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  QuizData,
  QuizQuestion,
  QuizQuestionOption,
  TRUE_FALSE
} from '../../../../types';
import { CheckIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Stack,
  Textarea,
  Input,
  Flex,
  InputLeftElement,
  InputGroup
} from '@chakra-ui/react';
import {
  capitalize,
  filter,
  first,
  isArray,
  isEmpty,
  isNil,
  map,
  split,
  toLower,
  values
} from 'lodash';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

// import { useOnClickOutside } from 'usehooks-ts';

const PreviewQuizCard = ({
  question: { canEdit, ...question },
  index,
  handleUpdateQuizQuestion,
  handleDeleteQuizQuestion,
  quizId
}: {
  quizId: string;
  question: QuizQuestion & { canEdit?: boolean };
  index: number;
  handleUpdateQuizQuestion: (id: number, question: QuizQuestion) => void;
  handleDeleteQuizQuestion: (
    zid: number | string,
    qid: number | string
  ) => void;
}) => {
  const ref = useRef(null);
  const [isEditable, setIsEditable] = useState(false);
  const [answer, setAnswer] = useState('');
  const [optionAnswer, setOptionAnswer] = useState('');
  const [trueFalseAnswer, setTrueFalseAnswer] = useState('');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [type, setType] = useState(null);
  const [updateOptions, setUpdateOptions] = useState<
    Record<string, QuizQuestionOption>
  >({});

  const [_, setUpdateTrueFalse] = useState<Record<string, QuizQuestionOption>>(
    {}
  );

  const handleSetIsEditiable = () => setIsEditable(true);
  const handleSetIsDisabled = () => setIsEditable(false);
  const handleSetClearState = () => {
    setUpdateOptions({});
    setOptionAnswer('');
    setTrueFalseAnswer('');
    setAnswer('');
    setQuizQuestion('');
    setType(null);
    handleSetIsDisabled();
  };
  const handleUpdateQuiz = () => {
    const options = (() => {
      let options =
        !isNil(question.options) &&
        !isEmpty(question.options) &&
        question.options?.length > 2
          ? [...question.options]
          : values(updateOptions);
      const [_, index] = split(optionAnswer, ':');

      if (type === TRUE_FALSE) {
        const [_, trueFalseIndex] = split(trueFalseAnswer, ':');
        options = [
          { content: 'True', isCorrect: false },
          { content: 'False', isCorrect: false }
        ];

        options = options.map((option) => {
          if (toLower(option.content) === toLower(trueFalseIndex)) {
            return {
              ...option,
              isCorrect: true
            };
          }
          return option;
        });

        return options;
      }

      options = map(options, (option) => ({ ...option, isCorrect: false }));

      options[index] =
        !isNil(question?.options) && !isEmpty(question?.options)
          ? {
              ...question?.options[index],
              ...updateOptions[optionAnswer],
              isCorrect: true
            }
          : {
              ...updateOptions[optionAnswer],
              isCorrect: true
            };

      return options;
    })();

    const questionData: QuizQuestion = {
      ...question,
      question: !isEmpty(quizQuestion) ? quizQuestion : question.question,
      type
    };

    if (type === OPEN_ENDED) {
      questionData.answer = answer;
    }

    if (type !== OPEN_ENDED) {
      questionData.options = options;
    }
    handleUpdateQuizQuestion(index, questionData);
    setTimeout(() => {
      handleSetClearState();
    });
  };

  const handleUpdateOption = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdateOptions((prevOptions: any) => {
      prevOptions[name] = { content: value, isCorrect: false };
      return {
        ...prevOptions
      };
    });
  };

  const handleUpdateTrueFalse = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setUpdateTrueFalse((prevOptions: any) => {
      const { name, value } = e.target;
      let newOptions = {};

      newOptions = { ...prevOptions };
      newOptions[value] = { content: name, isCorrect: false };
      return {
        ...prevOptions,
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
    { label: 'Multiple Single Choice', value: MULTIPLE_CHOICE_SINGLE },
    { label: 'True/False', value: TRUE_FALSE },
    { label: 'Open Ended', value: OPEN_ENDED }
  ];

  const trueFalseOptions = [
    { label: 'True', value: 'true' },
    { label: 'False', value: 'false' }
  ];

  // useOnClickOutside(ref, handleSetClearState);

  return (
    <Box ref={ref} borderRadius={'8px'} mt={10} bg="white" w="100%">
      <VStack
        alignItems={'flex-start'}
        justifyContent={'flex-start'}
        p={'18px 16px'}
      >
        <HStack
          mb={'17px'}
          alignItems={'flex-start'}
          minW={'30%'}
          flexWrap={'nowrap'}
        >
          <Text fontSize="md" fontWeight="semibold">
            {index + 1}.
          </Text>
          {isEditable ? (
            <Textarea
              onChange={(e) => setQuizQuestion(e.target.value)}
              value={!isEmpty(quizQuestion) ? quizQuestion : question?.question}
              minW={'450px'}
              h={'89px'}
              maxH={'100px'}
            />
          ) : (
            <Text fontSize="md" fontWeight="semibold">
              {!isEmpty(quizQuestion) ? quizQuestion : question.question}
            </Text>
          )}
        </HStack>
        {isEditable && (
          <Box w={'60%'} mb={'24px'}>
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
          </Box>
        )}
        {!isEmpty(type) && !isNil(type) ? (
          <Box w={'100%'}>
            {type === MULTIPLE_CHOICE_SINGLE && (
              <RadioGroup
                onChange={(e) => {
                  setOptionAnswer(e);
                }}
                value={'1'}
                mb="24px"
                w={'100%'}
              >
                <Stack direction="column" w={'100%'}>
                  {Array.from({
                    length:
                      question?.options.length > 2
                        ? question?.options.length
                        : 4
                  }).map((_, optionIndex) => (
                    <Box
                      key={optionIndex}
                      display={'flex'}
                      flexDirection={'row'}
                      alignItems={'center'}
                      w={'100%'}
                    >
                      <label
                        className="w-[20px] font-[Inter] text-dark font-[400] text-[14px] leading-[20px] flex justify-start items-start cursor-pointer"
                        htmlFor={`option${optionIndex}`}
                      >
                        <Radio
                          value={
                            !isEmpty(optionAnswer)
                              ? optionAnswer === `option:${optionIndex}`
                                ? '1'
                                : `option:${optionIndex}`
                              : `option:${optionIndex}`
                            // : !isNil(question?.options) &&
                            //   !isEmpty(question?.options) &&
                            //   question?.options?.length > 2 &&
                            //   question?.options[optionIndex]?.isCorrect
                            // ? '1'
                            // : `option:${optionIndex}`
                          }
                          type="radio"
                          id={`option${optionIndex}`}
                          name={`option:${optionIndex}`}
                          mr={1}
                          isDisabled={!isEditable}
                        />
                      </label>
                      <Input
                        isDisabled={!isEditable}
                        type="text"
                        name={`option:${optionIndex}`}
                        _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
                        placeholder={`Option ${String.fromCharCode(
                          65 + optionIndex
                        )}`}
                        defaultValue={
                          !isNil(question?.options) &&
                          !isEmpty(question?.options) &&
                          question?.options?.length > 2
                            ? question?.options[optionIndex]?.content
                            : ''
                        }
                        value={
                          !isEmpty(
                            updateOptions[`option:${optionIndex}`]?.content
                          ) || isEditable
                            ? updateOptions[`option:${optionIndex}`]?.content
                            : !isNil(question?.options) &&
                              !isEmpty(question?.options) &&
                              question?.options?.length > 2
                            ? question?.options[optionIndex]?.content
                            : ''
                        }
                        onChange={handleUpdateOption}
                        maxW={'95%'}
                      />
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            )}

            {type === TRUE_FALSE && (
              <Box mt={2} w={'80%'} mb="24px">
                <SelectComponent
                  name="answer"
                  placeholder="Select answer"
                  defaultValue={trueFalseOptions.find((option, idx) => {
                    if (isNil(question?.options)) {
                      return undefined;
                    }
                    return (
                      toLower(option?.label) ===
                        toLower(question?.options[idx]?.content) &&
                      question?.options[idx]?.isCorrect === true
                    );
                  })}
                  options={trueFalseOptions}
                  size={'md'}
                  onChange={(option) => {
                    const event = {
                      target: {
                        name: (option as Option).label,
                        value: (option as Option).value
                      }
                    } as ChangeEvent<HTMLSelectElement>;
                    handleUpdateTrueFalse(event);
                    setTrueFalseAnswer(`option:${(option as Option).value}`);
                  }}
                />
              </Box>
            )}

            {type === OPEN_ENDED && (
              <Box mt={2} w={'100%'} mb="24px">
                <Textarea
                  w={'100%'}
                  maxH={'120px'}
                  p={'12px 14px'}
                  isDisabled={!isEditable}
                  defaultValue={question.answer}
                  value={
                    !isEmpty(answer)
                      ? answer
                      : question.type === OPEN_ENDED
                      ? question.answer
                      : ''
                  }
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Box w={'100%'}>
            {question.type === MULTIPLE_CHOICE_MULTI && (
              <CheckboxGroup
                onChange={(e) => {
                  setOptionAnswer(first(e) as string);
                }}
                value={[canEdit && '1']}
              >
                <Stack direction="column">
                  {isArray(question?.options) &&
                    question?.options?.map((option, optionIndex) => (
                      <Box
                        className="flex justify-center items-center !mt-0"
                        key={optionIndex}
                        // display={'flex'}
                        // flexDirection={'row'}
                        // alignItems={'center'}
                        // mt={0}
                        // m={0}
                      >
                        <Checkbox
                          className="font-[Inter] font-[400] text-[14px] leading-[20px] cursor-pointer"
                          value={
                            !isEmpty(optionAnswer)
                              ? optionAnswer === `option:${optionIndex}`
                                ? '1'
                                : `option:${optionIndex}`
                              : option?.isCorrect
                              ? '1'
                              : `option:${optionIndex}`
                          }
                          id={`option${optionIndex}`}
                          name={`option:${optionIndex}`}
                          mr={1}
                          isReadOnly={!isEditable}
                          style={{ cursor: 'not-allowed' }}
                          _disabled={{ color: 'white' }}
                          display={'flex'}
                          justifyContent={'flex-start'}
                          alignItems={'center'}
                        />

                        <Text w={'95%'} ml={'4px'}>
                          {option?.content}
                        </Text>
                      </Box>
                    ))}
                </Stack>
              </CheckboxGroup>
            )}
            {question.type === MULTIPLE_CHOICE_SINGLE && (
              <RadioGroup
                onChange={(e) => {
                  setOptionAnswer(e);
                }}
                value={canEdit && '1'}
              >
                <Stack direction="column">
                  {isArray(question?.options) &&
                    question?.options?.map((option, optionIndex) => (
                      <Box
                        className="flex justify-center items-center !mt-0"
                        key={optionIndex}
                      >
                        <Radio
                          className="font-[Inter] font-[400] text-[14px] leading-[20px] cursor-pointer"
                          value={
                            !isEmpty(optionAnswer)
                              ? optionAnswer === `option:${optionIndex}`
                                ? '1'
                                : `option:${optionIndex}`
                              : option?.isCorrect
                              ? '1'
                              : `option:${optionIndex}`
                          }
                          // type="radio"
                          id={`option${optionIndex}`}
                          name={`option:${optionIndex}`}
                          mr={1}
                          isReadOnly={!isEditable}
                          style={{ cursor: 'not-allowed' }}
                          _disabled={{ color: 'white' }}
                          display={'flex'}
                          justifyContent={'flex-start'}
                          alignItems={'center'}
                        />
                        <Text w={'95%'} ml={'4px'}>
                          {option?.content}
                        </Text>
                      </Box>
                    ))}
                </Stack>
              </RadioGroup>
            )}
            {question.type === TRUE_FALSE && (
              <RadioGroup
                onChange={(e) => {
                  setTrueFalseAnswer(e);
                }}
                value={canEdit && '1'}
              >
                <Stack direction="column">
                  {isArray(question?.options) &&
                    question?.options?.map((option, optionIndex) => (
                      <Box
                        className="flex justify-center items-center !mt-0"
                        key={optionIndex}
                      >
                        <Radio
                          className="font-[Inter] font-[400] text-[14px] leading-[20px] cursor-pointer capitalize"
                          value={
                            !isEmpty(trueFalseAnswer)
                              ? trueFalseAnswer === `option:${optionIndex}`
                                ? '1'
                                : `option:${optionIndex}`
                              : option?.isCorrect
                              ? '1'
                              : `option:${optionIndex}`
                          }
                          // type="radio"
                          id={`${toLower(option.content)}-${optionIndex}`}
                          name={`option:${optionIndex}`}
                          mr={1}
                          isReadOnly={!isEditable}
                          style={{ cursor: 'not-allowed' }}
                          display={'flex'}
                          justifyContent={'flex-start'}
                          alignItems={'center'}
                        />
                        <Text w={'95%'} ml={'4px'}>
                          {' '}
                          {capitalize(option.content)}
                        </Text>
                      </Box>
                    ))}
                </Stack>
              </RadioGroup>
            )}
            {canEdit && question.type === OPEN_ENDED && (
              <Box mt={'8px'} w={'100%'} mb="24px">
                <Textarea
                  w={'100%'}
                  maxH={'120px'}
                  h={'69px'}
                  p={'12px 14px'}
                  isDisabled={!isEditable}
                  _disabled={{ color: 'text.200' }}
                  value={question.answer}
                />
              </Box>
            )}
          </Box>
        )}
      </VStack>

      <hr className="w-full border border-gray-400" />
      <Box minH={'24px'} p="16px">
        <HStack justifyContent={'space-between'}>
          {!isEmpty(optionAnswer) ||
          !isEmpty(trueFalseAnswer) ||
          !isEmpty(answer)
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
            {canEdit && !isEditable && (
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
                onClick={() => handleDeleteQuizQuestion(quizId, question?._id)}
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
  updateQuiz,
  isLoadingButton,
  quizId,
  handleUpdateQuizQuestion,
  handleClearQuiz,
  handleSearch,
  handleDeleteQuizQuestion,
  handleSetUploadingState
}: {
  handleClearQuiz: () => void;
  questions: QuizQuestion[];
  onOpen?: () => void;
  createQuiz?: () => void;
  updateQuiz: (
    quizId?: string,
    payload?: {
      quizQuestions?: QuizQuestion[];
      quizTitle?: string;
      quizTags?: string[];
      canEdit?: boolean;
    }
  ) => void;
  isLoadingButton: boolean;
  quizId: string;
  handleUpdateQuizQuestion: (id: number, question: QuizQuestion) => void;
  handleSearch?: (serach: string) => void;
  handleDeleteQuizQuestion?: (
    id: string | number,
    questionId: string | number
  ) => void;
  handleSetUploadingState?: (value: boolean) => void;
}) => {
  const navigate = useNavigate();
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
      <Box w="70%" maxW="700px" mb={10} position={'relative'}>
        {!isEmpty(questions) && (
          <Box
            display={'flex'}
            alignItems={'flex-start'}
            justifyContent={'space-between'}
            w={'100%'}
          >
            <HStack justifyContent={'flex-start'} alignItems={'center'}>
              {/* <Box position={'absolute'} left={'-140px'}>
                <Button
                  width={'140px'}
                  borderRadius="8px"
                  fontSize="14px"
                  lineHeight="20px"
                  mx={0}
                  bg={'transparent'}
                  _hover={{ bg: 'whiteAlpha.900' }}
                  textColor={'gray.500'}
                  onClick={() => navigate('/dashboard/quizzes')}
                >
                  <HStack>
                    <IoArrowBackOutline />
                    <Box
                      fontFamily={'Inter'}
                      fontSize={'14px'}
                      lineHeight={'21px'}
                      textColor={'text.500'}
                    >
                      <Text>Go Back</Text>
                    </Box>
                  </HStack>
                </Button>
              </Box> */}
              <Box>
                <Text
                  fontFamily="Inter"
                  fontWeight="500"
                  fontSize="18px"
                  lineHeight="23px"
                  color="text.200"
                >
                  Review Your Quiz
                </Text>
              </Box>
            </HStack>
            <HStack justifyContent={'flex-end'} alignItems={'center'}>
              {!isNil(quizId) && !isEmpty(quizId) && (
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
                    onClick={() => ''}
                  />
                  Study
                </Button>
              )}

              {!isEmpty(questions) && (
                <Button
                  width={'140px'}
                  borderRadius="8px"
                  fontSize="14px"
                  lineHeight="20px"
                  variant="solid"
                  colorScheme="primary"
                  onClick={() => {
                    if (!isNil(quizId) && !isEmpty(quizId)) {
                      updateQuiz(quizId);
                    }
                  }}
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
              )}
            </HStack>
          </Box>
        )}

        {!isEmpty(questions) && (
          <Flex w={'100%'} justifyContent={'flex-end'} my={5}>
            <InputGroup width="290px">
              <InputLeftElement
                pointerEvents="none"
                children={<BsSearch color="#969CA6" />}
                ml={2}
              />
              <Input
                placeholder="Search"
                pl="48px"
                _focus={{
                  boxShadow: '0 0 0 2px #3182ce'
                }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>
          </Flex>
        )}

        <Box
          maxH={'75vh'}
          h={'100%'}
          overflowY={'auto'}
          sx={{
            '&::-webkit-scrollbar': {
              width: '4px'
            },
            '&::-webkit-scrollbar-track': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              // background: 'text.400',
              borderRadius: '24px'
            }
          }}
        >
          <Box w={'100%'}>
            {/* Render questions preview */}
            {questions?.length > 0 &&
              questions?.map((question, index) => (
                <PreviewQuizCard
                  quizId={quizId}
                  key={question?.id}
                  question={question}
                  index={index}
                  handleUpdateQuizQuestion={handleUpdateQuizQuestion}
                  handleDeleteQuizQuestion={handleDeleteQuizQuestion}
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
