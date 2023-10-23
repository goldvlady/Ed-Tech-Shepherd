import {
  LightningBoltIcon,
  KeepQuizIcon,
  EditQuizIcon,
  DeleteQuizIcon
} from '../../../../components/icons';
import { QuizQuestion } from '../../../../types';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
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
import { isEmpty, toLower } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

const PreviewQuizCard = ({
  question,
  index
}: {
  question: QuizQuestion;
  index: number;
}) => {
  const ref = useRef(null);
  const [isEditable, setIsEditable] = useState(false);
  const [answer, setAnswer] = useState('');
  const [optionAnswer, setOptionAnswer] = useState('');
  const [quizQuestion, setQuizQuestion] = useState('');

  const handleSetIsEditiable = () => setIsEditable(true);
  const handleSetIsDisabled = () => setIsEditable(false);
  const handleUpdateQuiz = () => {
    console.log('answer ======>> ', answer);
    handleSetIsDisabled();
  };

  useEffect(() => {
    if (isEditable) {
      if (question.type === 'openEnded') {
        setAnswer(question?.answer as string);
      }
    } else {
      setAnswer('');
      setOptionAnswer('');
    }
  }, [isEditable, question?.answer, question.type]);

  useOnClickOutside(ref, handleSetIsDisabled);

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
              {question.question}
            </Text>
          )}
        </HStack>
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
                          ? optionAnswer === `question:${optionIndex}`
                            ? '1'
                            : `question:${optionIndex}`
                          : option?.isCorrect
                          ? '1'
                          : `question:${optionIndex}`
                      }
                      type="radio"
                      id={`option${optionIndex}`}
                      name={`question:${optionIndex}`}
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
                          ? optionAnswer === `question:${optionIndex}`
                            ? '1'
                            : `question:${optionIndex}`
                          : option?.isCorrect
                          ? '1'
                          : `question:${optionIndex}`
                      }
                      type="radio"
                      id={`${toLower(option.content)}-${optionIndex}`}
                      name={`question:${optionIndex}`}
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
              value={isEmpty(answer) ? question.answer : answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </Box>
        )}
      </VStack>
      <hr className="w-full border border-gray-400" />
      <Box minH={'24px'} p="16px">
        <HStack justifyContent={'space-between'}>
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
              <KeepQuizIcon
                className={'h-[24px] w-[24px] text-gray-500 cursor-pointer'}
                onClick={handleUpdateQuiz}
              />
            </Box>
          )}
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
                  onClick={handleSetIsDisabled}
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
  isLoadingButton
}: {
  questions: QuizQuestion[];
  onOpen: () => void;
  createQuiz: () => void;
  isLoadingButton: boolean;
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

            {!isEmpty(questions) && (
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
                <CheckIcon mx={2} />
                Create
              </Button>
            )}
          </HStack>
        </Box>

        <Box maxH={'85vh'} h={'100%'} overflowY={'auto'}>
          <Box w={'100%'} px="16px">
            {/* Render questions preview */}
            {questions.length > 0 &&
              questions.map((question, index) => (
                <PreviewQuizCard question={question} index={index} />
              ))}
            <Box p="32px" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default QuizPreviewer;
