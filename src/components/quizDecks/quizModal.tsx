import { LightningBoltIcon, TakeQuizIcon } from '../../components/icons';
import ApiService from '../../services/ApiService';
import quizStore from '../../state/quizStore';
import { MULTIPLE_CHOICE_SINGLE, OPEN_ENDED, TRUE_FALSE } from '../../types';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  Text,
  Progress,
  Box,
  VStack,
  RadioGroup,
  Stack,
  Radio,
  Textarea,
  Input,
  Tag,
  TagLeftIcon,
  TagLabel
} from '@chakra-ui/react';
import { isEmpty, split, toLower, toNumber, toString } from 'lodash';
import React, { useEffect, useState } from 'react';
import { IoCheckmarkDone, IoCloseOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';

const QuizLandingFooter = ({
  showMinimize = false,
  onMinimize
}: {
  showMinimize?: boolean;
  onMinimize?: () => void;
}) => {
  const { loadQuiz, quiz } = quizStore();

  const renderTag = () => {
    return [...(quiz?.tags || [])].splice(0, 3).map((tag) => (
      <Tag
        width={'fit-content'}
        maxWidth={'fit-content'}
        key={tag}
        borderRadius="5"
        marginRight="10px"
        background="#f7f8fa"
        size="md"
      >
        <TagLeftIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            width="25px"
            height="25px"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 6h.008v.008H6V6z"
            />
          </svg>
        </TagLeftIcon>
        <TagLabel
          whiteSpace={'nowrap'}
          overflow="visible" // Allows text to overflow
          textOverflow="clip"
        >
          {tag?.toLowerCase()}
        </TagLabel>
      </Tag>
    ));
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      background="transparent"
      width={'100%'}
      borderTop="1px solid #eee"
      p={4}
      justifyContent={'space-between'}
    >
      <Box>{renderTag()}</Box>
      <Box>
        {showMinimize && (
          <Button
            variant="ghost"
            rounded="100%"
            padding="5px"
            bg="#FFEFE6"
            mr="10px"
            _hover={{ bg: '#FFEFE6', transform: 'scale(1.05)' }}
            color="black"
            onClick={() => {
              onMinimize && onMinimize();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              width={'15px'}
              height={'15px'}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15"
              />
            </svg>
          </Button>
        )}
        <Button
          variant="ghost"
          rounded="100%"
          padding="10px"
          bg="#FEECEC"
          onClick={() => loadQuiz(null)}
          _hover={{ bg: '#FEECEC', transform: 'scale(1.05)' }}
          color="black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            width={'15px'}
            height={'15px'}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </Box>
    </Box>
  );
};

const QuizLanding = ({
  startQuiz = () => null,
  title = '',
  count = 0
}: {
  startQuiz: () => void;
  title?: string;
  count?: number;
}) => {
  return (
    <Box w={'100%'} h={'100%'} pt={'60px'}>
      <VStack
        alignItems={'center'}
        justifyContent={'center'}
        w={'100%'}
        h={'100%'}
      >
        <Box mb={'24px'}>
          <TakeQuizIcon
            className={'h-[100px] w-[100px]'}
            onClick={() => {
              return;
            }}
          />
        </Box>

        <VStack>
          <Box mb={'16px'}>
            <Text
              fontSize={'24px'}
              fontWeight={'600'}
              fontFamily={'Inter'}
              color={'text.200'}
            >
              {title || 'Sample'} quiz
            </Text>
          </Box>
          <Box>
            <Text
              fontSize={'16px'}
              fontFamily={'Inter'}
              color={'text.400'}
              textAlign={'center'}
            >
              You have {count || 0} question{count > 0 ? 's' : ''}, test your
              knowledge on your <br />
              {title} quiz
            </Text>
          </Box>
        </VStack>
        <HStack
          w={'100%'}
          sx={{
            marginTop: 'auto !important'
          }}
          justifyContent={'center'}
          pb={'40px'}
        >
          <Button
            w={'500px'}
            h={'54px'}
            borderRadius="8px"
            fontSize="14px"
            lineHeight="20px"
            variant="solid"
            colorScheme="primary"
            onClick={startQuiz}
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'center'}
          >
            <LightningBoltIcon
              className={'h-[20px] w-[20px] mx-2'}
              onClick={() => {
                return;
              }}
            />
            Study
          </Button>
        </HStack>

        <HStack alignItems={'flex-end'}>
          <QuizLandingFooter />
        </HStack>
      </VStack>
    </Box>
  );
};

const QuizCard = ({
  type,
  options,
  question,
  showNextButton,
  handleNext,
  answer,
  handleSetScore,
  handleStoreQuizHistory,
  _id
}: {
  question?: string;
  type?: string;
  index?: number;
  title?: string;
  options?: { content: string; isCorrect: boolean }[];
  showNextButton?: boolean;
  handleNext: () => void;
  answer?: string;
  handleSetScore: (score: boolean | null) => void;
  handleStoreQuizHistory: (
    questionId: string,
    answerProvided: string,
    quizId?: string
  ) => void;
  _id: string;
}) => {
  const [optionAnswer, setOptionAnswer] = useState('');
  const [enteredAnswer, setEnteredAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isEmpty(optionAnswer)) {
        const [_, index] = split(optionAnswer, ':');
        if (options) {
          const { isCorrect } = options[index];

          handleSetScore(isCorrect);
          handleStoreQuizHistory(_id, toString(isCorrect));
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionAnswer]);

  let inputs = (
    <>
      <Box mt={2} w={'100%'} mb="24px">
        <Textarea
          h={'32px'}
          maxHeight={'40px'}
          p={'12px 14px'}
          border={'none'}
          borderBottom={'1px'}
          borderRadius={'0px'}
          onChange={(e) => setEnteredAnswer(e.target.value)}
          value={enteredAnswer}
          isDisabled={showAnswer}
        />
      </Box>
      {showAnswer && (
        <Box mt={'24px'} w={'100%'}>
          <HStack alignItems={'flex-start'} w={'100%'}>
            <Text
              fontSize={'14px'}
              fontFamily={'Inter'}
              fontWeight={'700'}
              lineHeight={'17px'}
              textColor={'text.200'}
            >
              Answer:
            </Text>
            <Box h={'24px'} w={'100%'}>
              <Input
                maxH={'40px'}
                h={'32px'}
                w={'100%'}
                p={'8px 10px'}
                isDisabled
                value={answer}
              />
            </Box>
          </HStack>
        </Box>
      )}
    </>
  );

  if (type === MULTIPLE_CHOICE_SINGLE) {
    inputs = (
      <RadioGroup
        onChange={(e) => {
          if (isEmpty(optionAnswer)) setOptionAnswer(e);
        }}
        value={'1'}
        mb="24px"
      >
        <Stack direction="column">
          {options?.map((option, optionIndex) => (
            <Box
              key={optionIndex}
              display={'flex'}
              flexDirection={'row'}
              alignItems={'center'}
              px={'8px'}
              sx={{
                margin: '0px !important',
                marginBottom: '4px !important'
              }}
              h={'40px'}
              borderRadius={'8px'}
              w={'100%'}
              border={
                !isEmpty(optionAnswer)
                  ? option.isCorrect
                    ? '1px solid #66BD6A'
                    : optionAnswer === `question:${optionIndex}`
                    ? '1px solid #F53535'
                    : ''
                  : ''
              }
              bg={
                !isEmpty(optionAnswer)
                  ? option.isCorrect
                    ? '#F1F9F1'
                    : optionAnswer === `question:${optionIndex}`
                    ? '#FEF0F0'
                    : ''
                  : ''
              }
            >
              <label
                className="font-[Inter] text-dark font-[400] text-[12px] leading-[19px]  flex justify-center items-center cursor-pointer"
                htmlFor={`option${optionIndex}`}
              >
                <Radio
                  value={
                    optionAnswer === `question:${optionIndex}`
                      ? '1'
                      : `question:${optionIndex}`
                  }
                  type="radio"
                  id={`option${optionIndex}`}
                  name={`question:${optionIndex}`}
                  mr={1}
                />

                {option?.content}
              </label>
            </Box>
          ))}
        </Stack>
      </RadioGroup>
    );
  }

  if (type === TRUE_FALSE) {
    inputs = (
      <RadioGroup
        onChange={(e) => {
          if (isEmpty(optionAnswer)) setOptionAnswer(e);
        }}
        value={'1'}
        mb="24px"
      >
        <Stack direction="column">
          {options?.map((option, optionIndex) => (
            <Box
              key={optionIndex}
              display={'flex'}
              flexDirection={'row'}
              alignItems={'center'}
              sx={{
                margin: '0px !important',
                marginBottom: '4px !important'
              }}
              px={'8px'}
              h={'40px'}
              borderRadius={'8px'}
              w={'100%'}
              border={
                !isEmpty(optionAnswer)
                  ? option.isCorrect
                    ? '1px solid #66BD6A'
                    : optionAnswer === `question:${optionIndex}`
                    ? '1px solid #F53535'
                    : ''
                  : ''
              }
              bg={
                !isEmpty(optionAnswer)
                  ? option.isCorrect
                    ? '#F1F9F1'
                    : optionAnswer === `question:${optionIndex}`
                    ? '#FEF0F0'
                    : ''
                  : ''
              }
              mb={'4px'}
            >
              <label
                className="font-[Inter] text-dark font-[400] text-[12px] leading-[19px] flex justify-center items-center cursor-pointer"
                htmlFor={`${toLower(option.content)}-${optionIndex}`}
              >
                <Radio
                  value={
                    optionAnswer === `question:${optionIndex}`
                      ? '1'
                      : `question:${optionIndex}`
                  }
                  type="radio"
                  id={`${toLower(option.content)}-${optionIndex}`}
                  name={`question:${optionIndex}`}
                  mr={1}
                />
                {option.content}
              </label>
            </Box>
          ))}
        </Stack>
      </RadioGroup>
    );
  }
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'flex-start'}
      alignItems={'center'}
    >
      <VStack w={'100%'}>
        <Box
          bg={'whiteAlpha.900'}
          w={'585px'}
          h={'240px'}
          minH={'240px'}
          p="12px 24px"
          borderRadius={'8px'}
        >
          <Box mb={'24px'}>
            <Text
              fontSize={'16px'}
              fontFamily={'Inter'}
              fontWeight={'500'}
              lineHeight={'21px'}
              textColor={'text.200'}
            >
              {question ||
                'Which of the following is the main goal of physics?'}
            </Text>
          </Box>
          <Box>{inputs}</Box>
        </Box>
      </VStack>

      <HStack
        justifyContent={'flex-end'}
        bg={'#F9F9FB'}
        mt={'64px'}
        minH={'40px'}
      >
        {type === OPEN_ENDED && showAnswer && (
          <HStack>
            <Button
              w={'184px'}
              variant={'unstyled'}
              bg={'#EDF7EE'}
              color={'#4CAF50'}
              mr={3}
              onClick={async () => {
                handleNext();
                setOptionAnswer('');
                handleSetScore(true);
                handleStoreQuizHistory(_id, enteredAnswer);
                setEnteredAnswer('');
                setShowAnswer(false);
              }}
            >
              <HStack alignItems={'center'} justifyContent={'center'}>
                <IoCheckmarkDone color="#4CAF50" />
                <Text mx={'8px'}>Got it right</Text>
              </HStack>
            </Button>
            <Button
              bg={'#FFEFE6'}
              color={'#FB8441'}
              w={'184px'}
              variant={'unstyled'}
              mr={3}
              onClick={() => {
                handleNext();
                setOptionAnswer('');
                handleSetScore(null);
                handleStoreQuizHistory(_id, enteredAnswer);
                setEnteredAnswer('');
                setShowAnswer(false);
              }}
            >
              <HStack alignItems={'center'} justifyContent={'center'}>
                <QuestionOutlineIcon color={'#FB8441'} />
                <Text mx={'8px'}>Didn’t remember</Text>
              </HStack>
            </Button>
            <Button
              bg={'#FEECEC'}
              color={'#F53535'}
              w={'184px'}
              variant={'unstyled'}
              mr={3}
              onClick={() => {
                handleNext();
                setOptionAnswer('');
                handleSetScore(false);
                handleStoreQuizHistory(_id, enteredAnswer);
                setEnteredAnswer('');
                setShowAnswer(false);
              }}
            >
              <HStack alignItems={'center'} justifyContent={'center'}>
                <IoCloseOutline color="#F53535" />
                <Text mx={'8px'}>Got it wrong</Text>
              </HStack>
            </Button>
          </HStack>
        )}
        {showNextButton && type !== OPEN_ENDED ? (
          <Button
            bg={'blue.200'}
            w={'184px'}
            colorScheme="blue"
            mr={3}
            onClick={() => {
              if (isEmpty(optionAnswer)) {
                handleSetScore(null);
                handleStoreQuizHistory(_id, '_');
              }
              setTimeout(() => {
                handleNext();
                setOptionAnswer('');
              });
            }}
          >
            Next Question
          </Button>
        ) : !showAnswer ? (
          <>
            {!isEmpty(enteredAnswer) ? (
              <Button
                bg={'blue.200'}
                w={'184px'}
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  setShowAnswer(true);
                }}
              >
                Show Answer
              </Button>
            ) : (
              <Button
                bg={'blue.200'}
                w={'184px'}
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  if (isEmpty(optionAnswer)) {
                    handleSetScore(null);
                    handleStoreQuizHistory(_id, '_');
                  }
                  setTimeout(() => {
                    handleNext();
                    setOptionAnswer('');
                  });
                }}
              >
                Skip Question
              </Button>
            )}
          </>
        ) : (
          !showAnswer && (
            <Button
              bg={'blue.200'}
              w={'184px'}
              colorScheme="blue"
              mr={3}
              onClick={() => {
                if (isEmpty(optionAnswer)) {
                  handleSetScore(null);
                  handleStoreQuizHistory(_id, '');
                }
                setTimeout(() => {
                  handleNext();
                  setOptionAnswer('');
                });
              }}
            >
              Skip Question
            </Button>
          )
        )}
      </HStack>
    </Box>
  );
};

const QuizEnd = ({
  handleReviewQuiz,
  handleRestartQuiz,
  passed = 40,
  failed = 20,
  skipped = 40
}: {
  handleReviewQuiz: () => void;
  handleRestartQuiz: () => void;
  passed?: string | number;
  failed?: string | number;
  skipped?: string | number;
}) => {
  return (
    <Box
      fontFamily={'Inter'}
      pt={'36px'}
      mt={'auto'}
      h={'60%'}
      bg={'#F6F6F9'}
      w={'100%'}
    >
      <VStack>
        <Box mb={'20px'}>
          <Text
            textColor={'text.200'}
            fontSize={'24px'}
            fontWeight={'600'}
            lineHeight={'30px'}
          >
            Congratulations!
          </Text>
        </Box>
        <Box>
          <Text
            textColor={'text.400'}
            fontSize={'16px'}
            fontWeight={'400'}
            lineHeight={'21px'}
            textAlign={'center'}
          >
            You reviewed all cards, what will you like to do next?{' '}
          </Text>
        </Box>
      </VStack>

      <HStack
        w={'70%'}
        mt={'32px'}
        mb={'40px'}
        justifyContent={'space-around'}
        mx={'auto'}
      >
        {[
          ['#4CAF50', 'Got it right', `${passed}%`],
          ['#FB8441', `Didn't remember`, `${skipped}%`],
          ['#F53535', 'Got it wrong', `${failed}%`]
        ].map((item, idx) => {
          return (
            <HStack
              key={idx}
              fontFamily={'Inter'}
              textColor={'text.300'}
              fontSize={'14px'}
              fontWeight={'400'}
              lineHeight={'21px'}
              textAlign={'center'}
            >
              <Box bg={item[0]} borderRadius={'2px'} w={'12px'} h={'12px'} />
              <Box>
                <Text>{item[1]}</Text>
              </Box>
              <Box>
                <Text fontWeight={'600'}>{item[2]}</Text>
              </Box>
            </HStack>
          );
        })}
      </HStack>

      <HStack justifyContent={'space-evenly'}>
        <Button
          borderRadius={'8px'}
          border={'1px solid #E7E8E9'}
          variant={'unstyled'}
          h={'42px'}
          w={'304px'}
          boxShadow={'0px 1px 4px 0px rgba(136, 139, 143, 0.10)'}
          _hover={{ opacity: '0.75' }}
          onClick={handleRestartQuiz}
        >
          Restart Quiz
        </Button>
        <Button
          borderRadius={'8px'}
          border={'1px solid #E7E8E9'}
          variant={'unstyled'}
          h={'42px'}
          w={'304px'}
          boxShadow={'0px 1px 4px 0px rgba(136, 139, 143, 0.10)'}
          _hover={{ opacity: '0.75' }}
          onClick={handleReviewQuiz}
        >
          Review Questions
        </Button>
      </HStack>
    </Box>
  );
};

export const QuizModal = ({
  isOpen,
  closeOnOverlayClick = false,
  size = '800px'
}: {
  isOpen: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  size?: string;
  questionType?: string;
  options?: string[];
  question?: string;
  index?: number | string;
}) => {
  const { quiz, loadQuiz } = quizStore();
  const navigate = useNavigate();
  const [startQuiz, setStartQuiz] = useState(false);
  const [endQuiz, setEndQuiz] = useState(false);
  const [quizCount, setQuizCount] = useState<number>(0);
  const [scores, setScores] = useState<{
    passed: number;
    failed: number;
    skipped: number;
    total: number;
  }>({
    passed: 0,
    failed: 0,
    skipped: 0,
    total: 0
  });

  const handleSetScore = (score: boolean | null) =>
    setScores((prevScores) => ({
      ...prevScores,
      total: prevScores.total + 1,
      failed: score === false ? prevScores.failed + 1 : prevScores.failed,
      passed: score === true ? prevScores.passed + 1 : prevScores.passed,
      skipped: score === null ? prevScores.skipped + 1 : prevScores.skipped
    }));

  const handleStartQuiz = () => setStartQuiz(true);
  const handleStoreQuizHistory = async (
    questionId = '',
    answerProvided = '',
    quizId = quiz?._id
  ) => {
    await ApiService.storeQuizHistory({
      questionId,
      answerProvided,
      quizId
    });
  };
  const handleNext = () => {
    setQuizCount(quizCount + 1);
  };
  const handleRestartQuiz = () => {
    setQuizCount(0);
    setStartQuiz(true);
    setEndQuiz(false);
  };
  const handleReviewQuiz = () => {
    loadQuiz(null);
    navigate(`/dashboard/quizzes/create?quiz_id=${quiz?._id}`);
  };

  useEffect(() => {
    if (scores.total === quiz?.questions?.length) {
      (async () => {
        try {
          setStartQuiz(false);
          setEndQuiz(true);
          await ApiService.storeQuizScore({
            quizId: quiz._id,
            score: scores.passed
          });
        } catch (error) {
          console.log('error ========>> ', error);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?.questions?.length, scores]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => loadQuiz(null)}
      closeOnOverlayClick={closeOnOverlayClick}
      size={size}
    >
      <ModalOverlay />
      <ModalContent w={'740px'} h={'510px'}>
        {!startQuiz || endQuiz ? <ModalCloseButton /> : null}
        {startQuiz && (
          <>
            <ModalHeader bg={'#F9F9FB'}>
              <HStack
                p={'24px 30px 0px'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Text>Study Session</Text>
                <Button
                  onClick={() => loadQuiz(null)}
                  bg={'red.400'}
                  w={'124px'}
                  h={'34px'}
                  _hover={{ bg: 'red.200' }}
                >
                  End
                </Button>
              </HStack>
            </ModalHeader>
            <Progress
              h={'2px'}
              value={
                toNumber(quiz?.questions?.length) === 1
                  ? 100
                  : toNumber(quiz?.questions?.length) < 3 && quizCount === 0
                  ? 50
                  : quizCount === toNumber(quiz?.questions?.length) - 1
                  ? 100
                  : (quizCount / toNumber(quiz?.questions?.length)) * 100
              }
              colorScheme="blue"
            />
          </>
        )}

        <ModalBody
          p={endQuiz ? '0px' : ''}
          pb={endQuiz ? '0px' : ''}
          bg={endQuiz ? '#E1EEFE' : '#F9F9FB'}
        >
          <HStack
            h={'100%'}
            w={'100%'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            {!startQuiz && !endQuiz && (
              <QuizLanding
                {...{ ...quiz, count: quiz?.questions?.length }}
                startQuiz={handleStartQuiz}
              />
            )}
            {startQuiz && quiz && (
              <QuizCard
                handleStoreQuizHistory={handleStoreQuizHistory}
                handleNext={handleNext}
                showNextButton={
                  quizCount < toNumber(quiz?.questions?.length) - 1
                }
                {...{
                  ...quiz,
                  ...quiz?.questions[quizCount],
                  index: quizCount
                }}
                handleSetScore={handleSetScore}
              />
            )}

            {endQuiz && (
              <QuizEnd
                handleRestartQuiz={handleRestartQuiz}
                handleReviewQuiz={handleReviewQuiz}
                passed={Math.floor(
                  toNumber(
                    (scores.passed / toNumber(quiz?.questions?.length)) * 100
                  )
                )}
                failed={Math.floor(
                  toNumber(
                    (scores.failed / toNumber(quiz?.questions?.length)) * 100
                  )
                )}
                skipped={Math.floor(
                  toNumber(
                    (scores.skipped / toNumber(quiz?.questions?.length)) * 100
                  )
                )}
              />
            )}
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QuizModal;
