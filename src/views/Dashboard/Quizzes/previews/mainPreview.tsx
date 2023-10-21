import {
  LightningBoltIcon,
  KeepQuizIcon,
  EditQuizIcon,
  DeleteQuizIcon
} from '../../../../components/icons';
import { QuizQuestion } from '../context';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Radio,
  RadioGroup,
  Stack,
  Textarea
} from '@chakra-ui/react';
import React from 'react';

const QuizPreviewer = ({
  questions,
  onOpen
}: {
  questions: QuizQuestion[];
  onOpen: () => void;
}) => {
  return (
    <Box
      as="section"
      pt={'40px'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
    >
      <VStack w="70%" maxW="650px" mb={10}>
        <HStack
          alignItems={'center'}
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
            alignItems={'center'}
          >
            <LightningBoltIcon
              className={'h-[20px] w-[20px] mx-2'}
              onClick={onOpen}
            />
            Study
          </Button>
        </HStack>

        <VStack w={'100%'}>
          {/* Render questions preview */}
          {questions.length &&
            questions.map((question, index) => (
              <Box borderRadius={'8px'} key={index} mt={10} bg="white" w="100%">
                <VStack
                  alignItems={'flex-start'}
                  justifyContent={'flex-start'}
                  p={'18px 16px'}
                >
                  <HStack mb={'17px'} alignItems={'center'}>
                    <Text fontSize="md" fontWeight="semibold">
                      {index + 1}.
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {question.question}
                    </Text>
                  </HStack>
                  {question.questionType === 'multipleChoice' && (
                    <RadioGroup onChange={() => ''} value={''} mb="24px">
                      <Stack direction="column">
                        {question?.options?.map((option, optionIndex) => (
                          <Box
                            key={optionIndex}
                            display={'flex'}
                            flexDirection={'row'}
                            alignItems={'center'}
                          >
                            <Radio
                              value={option}
                              type="radio"
                              id={`option${optionIndex}`}
                              name={`question${index}`}
                              mr={1}
                            />
                            <label
                              className="font-[Inter] text-dark font-[400] text-[14px] leading-[20px]"
                              htmlFor={`option${optionIndex}`}
                            >
                              {option}
                            </label>
                          </Box>
                        ))}
                      </Stack>
                    </RadioGroup>
                  )}
                  {question.questionType === 'trueFalse' && (
                    <RadioGroup onChange={() => ''} value={''} mb="24px">
                      <Stack direction="column">
                        <Box
                          display={'flex'}
                          flexDirection={'row'}
                          alignItems={'center'}
                        >
                          <Radio
                            value={'1'}
                            type="radio"
                            id={`true-${index}`}
                            name={`question-${index}`}
                            mr={1}
                          />
                          <label
                            className="font-[Inter] text-dark font-[400] text-[14px] leading-[20px]"
                            htmlFor={`true-${index}`}
                          >
                            True
                          </label>
                        </Box>

                        <Box
                          display={'flex'}
                          flexDirection={'row'}
                          alignItems={'center'}
                        >
                          <Radio
                            value={'1'}
                            type="radio"
                            id={`false-${index}`}
                            name={`question-${index}`}
                            mr={1}
                          />
                          <label
                            className="font-[Inter] text-dark font-[400] text-[14px] leading-[20px]"
                            htmlFor={`false-${index}`}
                          >
                            False
                          </label>
                        </Box>
                      </Stack>
                    </RadioGroup>
                  )}
                  {question.questionType === 'openEnded' && (
                    <Box mt={2} w={'100%'} mb="24px">
                      <Textarea w={'100%'} h={'69px'} p={'12px 14px'} />
                    </Box>
                  )}
                </VStack>
                <hr className="w-full border border-gray-400" />
                <Box minH={'24px'} p="16px">
                  <HStack justifyContent={'space-between'}>
                    <HStack
                      borderRadius={'50%'}
                      bg={'#F4F5F6'}
                      alignItems={'center'}
                      justifyContent={'center'}
                      w={'30px'}
                      h={'30px'}
                    >
                      <KeepQuizIcon
                        className={
                          'h-[24px] w-[24px] text-gray-500 hover:opacity-50 cursor-pointer'
                        }
                        onClick={() => ''}
                      />
                    </HStack>
                    <HStack>
                      <EditQuizIcon
                        className={
                          'h-[24px] w-[24px] text-gray-500 mx-3 hover:opacity-50 cursor-pointer'
                        }
                        onClick={() => ''}
                      />
                      <DeleteQuizIcon
                        className={
                          'h-[24px] w-[24px] text-gray-500 hover:opacity-50 cursor-pointer'
                        }
                        onClick={() => ''}
                      />
                    </HStack>
                  </HStack>
                </Box>
              </Box>
            ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default QuizPreviewer;
