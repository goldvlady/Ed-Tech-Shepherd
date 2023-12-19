import {
  QuizConfirmationModal,
  QuizResultModal
} from '../../../../components/quizDecks';
import ApiService from '../../../../services/ApiService';
import {
  MULTIPLE_CHOICE_MULTI,
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  QuizQuestion,
  TRUE_FALSE
} from '../../../../types';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
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
  Textarea
} from '@chakra-ui/react';
import clsx from 'clsx';
import {
  capitalize,
  filter,
  first,
  forEach,
  isArray,
  isEmpty,
  isNil,
  last,
  map,
  size,
  sortBy,
  split,
  toLower,
  toNumber,
  toString,
  unionBy
} from 'lodash';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { IoCheckmarkDone, IoCloseOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

type QuizScoreType = {
  questionIdx: string | number;
  score: string | 'true' | 'false' | boolean | null;
  selectedOptions: string[];
};

const QuizCard = forwardRef(
  (
    {
      handleSetScore,
      handleStoreQuizHistory,
      quizScores,
      question: { options, _id: id, ...question },
      index,
      showQuizAnswers = false,
      showAnsweredQuestion = false,
      minHeight = 100
    }: {
      minHeight?: number;
      showAnsweredQuestion?: boolean;
      handleShowUnansweredQuestion?: (val: boolean) => void;
      quizScores: QuizScoreType[];
      question: QuizQuestion;
      index: number;
      showQuizAnswers?: boolean;
      handleSetScore?: (
        score: string | 'true' | 'false' | boolean | null,
        idx?: number,
        selectedOptions?: string[]
      ) => void;
      handleStoreQuizHistory?: (
        questionId: string,
        answerProvided: string,
        quizId?: string
      ) => void;
    },
    ref?: any
  ) => {
    const quizCardRef = useRef(null);
    const [optionAnswer, setOptionAnswer] = useState('');
    const [trueFalseAnswer, setTrueFalseAnswer] = useState('');
    const [_, setOptionCheckboxAnswers] = useState([]);
    const [showOpenEndedAnswer, setShowOpenEndedAnswer] = useState(false);

    const handleOptionAnswerHandler = (optionAnswer: string) => {
      if (!isEmpty(optionAnswer)) {
        const [_, index, questionIdx] = split(optionAnswer, ':');
        if (options) {
          const { isCorrect } = options[toNumber(index)];

          const score = toString(isCorrect) === 'true' ? 'true' : 'false';

          handleSetScore(score, toNumber(questionIdx), [optionAnswer]);
          handleStoreQuizHistory(id as string, toString(isCorrect));
        }
      }
    };
    const handleTFAnswerHandler = (trueFalseAnswer: string) => {
      if (!isEmpty(trueFalseAnswer)) {
        const [_, index, questionIdx] = split(trueFalseAnswer, ':');
        if (options) {
          const { isCorrect } = options[toNumber(index)];

          const score = toString(isCorrect) === 'true' ? 'true' : 'false';

          handleSetScore(score, toNumber(questionIdx), [trueFalseAnswer]);
          handleStoreQuizHistory(id as string, toString(isCorrect));
        }
      }
    };
    const handleOptionCheckBox = (e: Array<string>) => {
      if (isEmpty(e)) {
        handleSetScore('', toNumber(index), []);
      }

      if (!isEmpty(e)) {
        let questionIdx = '';
        const answers = [];
        forEach(e, (answer) => {
          const [, index, qIdx] = split(answer, ':');
          questionIdx = qIdx;
          const { isCorrect } = options[toNumber(index)];
          if (!isNil(options) && !isEmpty(options)) {
            if (toString(isCorrect) === 'true') {
              answers.push(true);
            }
          }
        });
        const answer = isEmpty(answers) ? 'false' : 'true';
        handleSetScore(answer, toNumber(questionIdx), e);
        handleStoreQuizHistory(id as string, answer);
      }
    };

    return (
      <Box
        as="div"
        className="quiz-tile"
        ref={(node) => {
          quizCardRef.current = node;
        }}
        borderRadius={'8px'}
        bg="white"
        _hover={{ boxShadow: 'md' }}
        w={['100%', '50%', '32%']}
        minH={minHeight}
        borderWidth={
          showAnsweredQuestion &&
          quizScores[index]?.score === '' &&
          question.type !== OPEN_ENDED
            ? '1px'
            : question.type === OPEN_ENDED &&
              showAnsweredQuestion &&
              isEmpty(first(quizScores[index]?.selectedOptions))
            ? '1px'
            : ''
        }
        borderColor={
          showAnsweredQuestion &&
          quizScores[index]?.score === '' &&
          question.type !== OPEN_ENDED
            ? 'red.200'
            : question.type === OPEN_ENDED &&
              showAnsweredQuestion &&
              isEmpty(first(quizScores[index]?.selectedOptions))
            ? 'red.200'
            : ''
        }
        sx={{
          margin: '0px !important',
          marginBottom: '16px !important',
          marginRight: '8px !important'
        }}
      >
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
            minH={'48px'}
          >
            <Text fontSize="md" fontWeight="semibold">
              {index + 1}.
            </Text>
            <Text fontSize="md" fontWeight="semibold">
              {question.question}
            </Text>
          </HStack>

          <Box
            w={'100%'}
            className="font-[Inter] font-[400] text-[14px] leading-[16px]"
          >
            {question.type === MULTIPLE_CHOICE_MULTI && (
              <CheckboxGroup
                onChange={(e) => {
                  setOptionCheckboxAnswers(e);
                  handleOptionCheckBox(e as Array<string>);
                }}
                value={quizScores[index]?.selectedOptions}
              >
                <Stack direction="column">
                  {isArray(options) &&
                    options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={clsx(
                          'min-h-[20px] flex justify-start items-center rounded-md !mt-0 mb-2',
                          {
                            'p-2': showQuizAnswers,
                            '!border !border-[#66BD6A] bg-[#F1F9F1]':
                              showQuizAnswers &&
                              option.isCorrect &&
                              quizScores[index]?.score !== ''
                          }
                        )}
                      >
                        <div className="h-full w-full flex justify-start items-start">
                          <Checkbox
                            value={`question:${optionIndex}:${index}`}
                            id={`option${optionIndex}`}
                            name={`question:${optionIndex}:${index}`}
                            isReadOnly={showQuizAnswers}
                          />
                          <Box display={'flex'} w={'100%'} maxW={'95%'}>
                            <Text w={'95%'} ml={'4px'}>
                              {option?.content}
                            </Text>
                          </Box>
                        </div>
                      </div>
                    ))}
                </Stack>
              </CheckboxGroup>
            )}
            {question.type === MULTIPLE_CHOICE_SINGLE && (
              <RadioGroup
                onChange={(e) => {
                  handleOptionAnswerHandler(e);
                  setOptionAnswer(e);
                }}
                value={'1'}
              >
                <Stack direction="column">
                  {isArray(options) &&
                    options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={clsx(
                          'min-h-[20px] flex justify-start items-center rounded-md !mt-0 mb-2',
                          {
                            'p-2': showQuizAnswers,
                            'bg-red-400':
                              showQuizAnswers &&
                              first(quizScores[index]?.selectedOptions) ===
                                `question:${optionIndex}:${index}` &&
                              !option.isCorrect,
                            '!border !border-[#66BD6A] bg-[#F1F9F1]':
                              showQuizAnswers &&
                              option.isCorrect &&
                              quizScores[index]?.score !== ''
                          }
                        )}
                      >
                        <div className="h-full w-full flex justify-start items-start">
                          <Radio
                            value={
                              first(quizScores[index]?.selectedOptions) ===
                              `question:${optionIndex}:${index}`
                                ? '1'
                                : `question:${optionIndex}:${index}`
                            }
                            id={`option${optionIndex}`}
                            name={`question:${optionIndex}:${index}`}
                            isReadOnly={showQuizAnswers}
                          />
                          <Box display={'flex'} w={'100%'} maxW={'95%'}>
                            <Text w={'95%'} ml={'4px'}>
                              {option?.content}
                            </Text>
                          </Box>
                        </div>
                      </div>
                    ))}
                </Stack>
              </RadioGroup>
            )}
            {question.type === TRUE_FALSE && (
              <RadioGroup
                onChange={(e) => {
                  handleTFAnswerHandler(e);
                  setTrueFalseAnswer(e);
                }}
                value={'1'}
              >
                <Stack direction="column">
                  {isArray(options) &&
                    options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={clsx(
                          'cursor-pointer min-h-[20px] flex justify-start items-center rounded-md !mt-0 mb-2',
                          {
                            'p-2': showQuizAnswers,
                            '!border !border-[#66BD6A] bg-[#F1F9F1]':
                              showQuizAnswers &&
                              option.isCorrect &&
                              quizScores[index]?.score !== ''
                          }
                        )}
                      >
                        <div className="h-full w-full flex justify-start items-start">
                          <Radio
                            value={
                              first(quizScores[index]?.selectedOptions) ===
                              `question:${optionIndex}:${index}`
                                ? '1'
                                : `question:${optionIndex}:${index}`
                            }
                            id={`${toLower(option.content)}-${optionIndex}`}
                            name={`question:${optionIndex}:${index}`}
                            isReadOnly={showQuizAnswers}
                          />
                          <Box display={'flex'} w={'100%'} maxW={'95%'}>
                            <Text w={'95%'} ml={'4px'}>
                              {' '}
                              {capitalize(option.content)}
                            </Text>
                          </Box>
                        </div>
                      </div>
                    ))}
                </Stack>
              </RadioGroup>
            )}
            {question.type === OPEN_ENDED && (
              <>
                <Box mt={2} w={'100%'} mb="24px">
                  <Textarea
                    h={'32px'}
                    p={'12px 14px'}
                    border={'none'}
                    borderBottom={'1px'}
                    borderRadius={'0px'}
                    isReadOnly={
                      showQuizAnswers &&
                      !isEmpty(first(quizScores[index]?.selectedOptions))
                    }
                    onChange={(e) => {
                      handleSetScore('pending', toNumber(index), [
                        e.target.value
                      ]);
                    }}
                    value={first(quizScores[index]?.selectedOptions)}
                    placeholder="Please enter your answer"
                    boxShadow={'none'}
                    maxH={'200px'}
                  />
                </Box>
                {showQuizAnswers &&
                  !isEmpty(first(quizScores[index]?.selectedOptions)) && (
                    <Box
                      mt={'24px'}
                      w={'100%'}
                      display={'flex'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                    >
                      <Box mr={2}>
                        <Text
                          fontSize={'14px'}
                          fontFamily={'Inter'}
                          fontWeight={'700'}
                          lineHeight={'17px'}
                          textColor={'text.200'}
                        >
                          Answer:
                        </Text>
                      </Box>

                      <Box display={'flex'} flexGrow={1}>
                        <Textarea
                          maxH={'40px'}
                          h={'32px'}
                          w={'100%'}
                          p={'8px 10px'}
                          isReadOnly
                          value={question?.answer}
                        />
                      </Box>
                    </Box>
                  )}

                {false &&
                  !showOpenEndedAnswer &&
                  !isEmpty(first(quizScores[index]?.selectedOptions)) && (
                    <Box>
                      <Button
                        bg={'blue.200'}
                        w={'100%'}
                        colorScheme="blue"
                        onClick={() => setShowOpenEndedAnswer(true)}
                      >
                        View Answer
                      </Button>
                    </Box>
                  )}

                {showQuizAnswers &&
                  !isEmpty(first(quizScores[index]?.selectedOptions)) && (
                    <Box
                      position={'relative'}
                      display={'flex'}
                      flexDirection={'column'}
                      alignItems={'center'}
                      flexGrow={1}
                      justifyContent={'flex-end'}
                      bg={'#F9F9FB'}
                      minH={'40px'}
                      w={'100%'}
                    >
                      {/* open ended buttons */}

                      {question.type === OPEN_ENDED && (
                        <HStack
                          bg={'whiteAlpha.900'}
                          py={4}
                          w={'100%'}
                          justifyContent={'center'}
                        >
                          <Button
                            w={{ base: '100%', md: 1 / 3, lg: '100%' }}
                            variant={'unstyled'}
                            bg={'#EDF7EE'}
                            color={'#4CAF50'}
                            onClick={async () => {
                              if (quizScores[index]?.score === 'pending') {
                                handleSetScore(
                                  'true',
                                  toNumber(index),
                                  quizScores[index].selectedOptions
                                );
                                handleStoreQuizHistory(
                                  id as string,
                                  first(quizScores[index].selectedOptions)
                                );

                                // handleSumbit
                              }
                            }}
                            sx={{
                              marginLeft: '0 !important',
                              marginBottom: '4px'
                            }}
                            isDisabled={
                              quizScores[index]?.score !== 'pending' &&
                              quizScores[index]?.score !== 'true'
                            }
                          >
                            <HStack
                              alignItems={'center'}
                              justifyContent={'center'}
                            >
                              <IoCheckmarkDone color="#4CAF50" />
                              <Text mx={'8px'}>Got it right</Text>
                            </HStack>
                          </Button>
                          <Button
                            bg={'#FFEFE6'}
                            color={'#FB8441'}
                            w={{ base: '100%', md: 1 / 3, lg: '100%' }}
                            variant={'unstyled'}
                            onClick={() => {
                              if (quizScores[index]?.score === 'pending') {
                                handleSetScore(
                                  'null',
                                  toNumber(index),
                                  quizScores[index].selectedOptions
                                );
                                handleStoreQuizHistory(
                                  id as string,
                                  first(quizScores[index].selectedOptions)
                                );
                              }
                            }}
                            sx={{
                              marginLeft: '0 !important',
                              marginBottom: '4px !important'
                            }}
                            isDisabled={
                              quizScores[index]?.score !== 'pending' &&
                              quizScores[index]?.score !== 'null'
                            }
                          >
                            <HStack
                              alignItems={'center'}
                              justifyContent={'center'}
                            >
                              <QuestionOutlineIcon color={'#FB8441'} />
                              <Text mx={'8px'}>Didn’t remember</Text>
                            </HStack>
                          </Button>
                          <Button
                            bg={'#FEECEC'}
                            color={'#F53535'}
                            w={{ base: '100%', md: 1 / 3, lg: '100%' }}
                            variant={'unstyled'}
                            onClick={() => {
                              if (quizScores[index]?.score === 'pending') {
                                handleSetScore(
                                  'false',
                                  toNumber(index),
                                  quizScores[index].selectedOptions
                                );
                                handleStoreQuizHistory(
                                  id as string,
                                  first(quizScores[index].selectedOptions)
                                );
                              }
                            }}
                            sx={{
                              marginLeft: '0 !important',
                              marginBottom: '4px !important'
                            }}
                            isDisabled={
                              quizScores[index]?.score !== 'pending' &&
                              quizScores[index]?.score !== 'false'
                            }
                          >
                            <HStack
                              alignItems={'center'}
                              justifyContent={'center'}
                            >
                              <IoCloseOutline color="#F53535" />
                              <Text mx={'8px'}>Got it wrong</Text>
                            </HStack>
                          </Button>
                        </HStack>
                      )}
                    </Box>
                  )}
              </>
            )}
          </Box>
        </VStack>
      </Box>
    );
  }
);
const QuizPreviewer = ({
  title,
  questions,
  quizId
}: {
  title: string;
  questions: QuizQuestion[];
  quizId: string;
  handleSetUploadingState?: (value: boolean) => void;
}) => {
  const navigate = useNavigate();

  const [minHeight, setMinHeight] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showUnansweredQuestions, setShowUnansweredQuestions] = useState(false);
  const [showQuizAnswers, setShowQuizAnswers] = useState(false);

  const [scores, setScores] = useState<QuizScoreType[]>([]);

  const handleCloseResultsModal = () => setShowResults(false);

  const handleShowUnansweredQuestion = (value: boolean) =>
    setShowUnansweredQuestions(value);

  const handleLeaveQuiz = () => {
    handleCloseResultsModal();
    navigate(`/dashboard/quizzes`);
  };

  const handleReviewQuiz = () => {
    handleCloseResultsModal();
    navigate(`/dashboard/quizzes/create?quiz_id=${quizId}`);
  };

  const handleSubmit = async () => {
    try {
      await ApiService.storeQuizScore({
        quizId,
        score: size(filter(scores, ['score', 'true']))
      });
    } catch (error) {
      console.log('error ========>> ', error);
    }
  };

  const handleRestartQuiz = () => {
    const arr = new Array(questions?.length);
    const newArray = Array.from(arr, (_, idx) => ({
      questionIdx: idx,
      score: '',
      selectedOptions: []
    }));
    setScores(newArray);
    setShowUnansweredQuestions(false);
  };

  const handleSetScore = (
    score: 'true' | 'false' | boolean | null,
    idx = null,
    selectedOptions = []
  ) => {
    if (!isNil(idx)) {
      const newScores = [...scores];
      newScores.splice(idx, 1, { questionIdx: idx, score, selectedOptions });
      setScores(sortBy(newScores, ['questionIdx']));
      return;
    }

    setScores((prevScores) =>
      sortBy(
        unionBy(
          [
            {
              questionIdx:
                prevScores?.length === 0
                  ? 0
                  : prevScores?.length === 1
                  ? 1
                  : prevScores?.length,
              score,
              selectedOptions
            }
          ],
          [...prevScores],
          'questionIdx'
        ),
        ['questionIdx']
      )
    );
  };

  const handleStoreQuizHistory = async (
    questionId = '',
    answerProvided = '',
    quiz_id = quizId
  ) => {
    await ApiService.storeQuizHistory({
      questionId,
      answerProvided,
      quizId: quiz_id
    });
  };

  const handleContinueQuiz = () => {
    handleShowUnansweredQuestion(true);
    setShowConfirmation(false);
  };

  const handleUnansweredQuestionsCount = useMemo(
    () => filter(scores, (score) => score?.score === '')?.length,
    [scores]
  );

  useEffect(() => {
    const elems = document.querySelectorAll('div.quiz-tile');

    setMinHeight(
      last(
        sortBy(
          Array.from(elems, (el) => el?.clientHeight),
          Math.floor
        )
      )
    );
  }, [questions]);

  useEffect(() => {
    if (!isEmpty(questions) && isEmpty(scores)) {
      handleRestartQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  return (
    <>
      <Box
        as="section"
        pt={'40px'}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        h={'100%'}
        maxH={'100%'}
        overflowY={'auto'}
        mr={'auto'}
        // _last={{ display: 'hidden' }}
      >
        <Box w="100%" maxW="95%" mb={10} position={'relative'}>
          <HStack mx={'auto'} justifyContent={'center'}>
            {!isEmpty(questions) && (
              <Box
                display={'flex'}
                alignItems={'flex-start'}
                justifyContent={'space-between'}
                w={'100%'}
                pb={'16px'}
              >
                <HStack justifyContent={'flex-start'} alignItems={'center'}>
                  <Box>
                    <Text
                      fontFamily="Inter"
                      fontWeight="700"
                      fontSize="24px"
                      lineHeight="27px"
                      color="text.200"
                    >
                      Take Your Quiz
                    </Text>
                  </Box>
                </HStack>
                <HStack
                  justifyContent={'flex-end'}
                  alignItems={'center'}
                  pr={'45px'}
                >
                  <HStack
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    {!showQuizAnswers && handleUnansweredQuestionsCount > 0 && (
                      <Box>
                        <Button
                          onClick={() => setShowConfirmation(true)}
                          bg={'red.400'}
                          w={'180px'}
                          h={'40px'}
                          _hover={{ bg: 'red.200' }}
                        >
                          Submit Quiz
                        </Button>
                      </Box>
                    )}
                    {!showQuizAnswers &&
                      handleUnansweredQuestionsCount === 0 && (
                        <Box>
                          <Button
                            variant="solid"
                            onClick={() => {
                              setShowConfirmation(false);
                              setShowQuizAnswers(true);
                              handleSubmit();
                            }}
                            w={'180px'}
                            h={'40px'}
                          >
                            Submit Quiz
                          </Button>
                        </Box>
                      )}
                    {showQuizAnswers && (
                      <Box>
                        <Button
                          variant="solid"
                          onClick={() => {
                            setShowQuizAnswers(false);
                            setShowResults(true);
                            handleSubmit();
                          }}
                          w={'180px'}
                          h={'40px'}
                        >
                          Close Quiz
                        </Button>
                      </Box>
                    )}
                  </HStack>
                </HStack>
              </Box>
            )}
          </HStack>

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
            <HStack
              w={'100%'}
              alignItems={'flex-start'}
              justifyContent={'flex-start'}
            >
              {/* Render questions preview */}
              {!isEmpty(questions) &&
                map(questions, (question, index) => {
                  return (
                    <QuizCard
                      showAnsweredQuestion={showUnansweredQuestions}
                      handleShowUnansweredQuestion={
                        handleShowUnansweredQuestion
                      }
                      quizScores={scores}
                      key={question?.id}
                      question={question}
                      index={index}
                      handleStoreQuizHistory={handleStoreQuizHistory}
                      handleSetScore={handleSetScore}
                      showQuizAnswers={showQuizAnswers}
                      minHeight={minHeight}
                    />
                  );
                })}
            </HStack>
            <Box p="32px" />
          </Box>
        </Box>
      </Box>

      {showConfirmation && (
        <QuizConfirmationModal
          handleContinueQuiz={handleContinueQuiz}
          title={title}
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setShowQuizAnswers(true);
            // setShowResults(true);
            handleSubmit();
          }}
          count={handleUnansweredQuestionsCount}
        />
      )}

      {showResults && (
        <QuizResultModal
          handleRestartQuiz={() => {
            handleRestartQuiz();
            handleCloseResultsModal();
          }}
          onClose={handleLeaveQuiz}
          handleReviewQuiz={handleReviewQuiz}
          isOpen={showResults}
          scores={scores}
          questions={questions}
        />
      )}
    </>
  );
};

export default QuizPreviewer;
