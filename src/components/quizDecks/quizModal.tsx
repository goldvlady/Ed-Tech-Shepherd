import { LightningBoltIcon, TakeQuizIcon } from '../../components/icons';
import quizStore from '../../state/quizStore';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
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
  Input
} from '@chakra-ui/react';
import { isEmpty, pull, split, toLower, toNumber } from 'lodash';
import React, { useEffect, useState } from 'react';
import { IoCheckmarkDone, IoCloseOutline } from 'react-icons/io5';

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
  handleSetScore
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
}) => {
  const [optionAnswer, setOptionAnswer] = useState('');
  const [enteredAnswer, setEnteredAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (!isEmpty(optionAnswer)) {
      const [_, index] = split(optionAnswer, ':');
      if (options) {
        const { isCorrect } = options[index];

        handleSetScore(isCorrect);
      }
    }
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

  if (type === 'multipleChoiceSingle') {
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

  if (type === 'trueFalse') {
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
        {type === 'openEnded' && showAnswer && (
          <HStack>
            <Button
              w={'184px'}
              variant={'unstyled'}
              bg={'#EDF7EE'}
              color={'#4CAF50'}
              mr={3}
              onClick={() => {
                handleNext();
                setOptionAnswer('');
                handleSetScore(true);
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
              }}
            >
              <HStack alignItems={'center'} justifyContent={'center'}>
                <IoCloseOutline color="#F53535" />
                <Text mx={'8px'}>Got it wrong</Text>
              </HStack>
            </Button>
          </HStack>
        )}
        {showNextButton && type !== 'openEnded' ? (
          <Button
            bg={'blue.200'}
            w={'184px'}
            colorScheme="blue"
            mr={3}
            onClick={() => {
              handleNext();
              setOptionAnswer('');
            }}
          >
            Next Question
          </Button>
        ) : (
          !showAnswer &&
          !isEmpty(enteredAnswer) && (
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
          )
        )}
      </HStack>
    </Box>
  );
};

const QuizEnd = ({
  passed = 40,
  failed = 20,
  skipped = 40
}: {
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
  const handleNext = () => setQuizCount(quizCount + 1);

  useEffect(() => {
    if (scores.total === quiz?.questions?.length) {
      setStartQuiz(false);
      setEndQuiz(true);
    }
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
