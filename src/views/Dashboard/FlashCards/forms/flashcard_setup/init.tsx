import { useFlashCardState } from '../../context/flashcard';
import {
  Box,
  FormControl,
  Image,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Button,
  HStack,
  useEditable
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';

const FlashCardSetupInit = ({ isAutomated }: { isAutomated?: boolean }) => {
  const { flashcardData, setFlashcardData, goToNextStep } = useFlashCardState();
  const [localData, setLocalData] = useState<typeof flashcardData>({
    deckname: '',
    studyType: '',
    studyPeriod: '',
    numOptions: 0,
    timerDuration: '',
    hasSubmitted: false
  }); // A local state for storing user inputs

  const handleChange = React.useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setLocalData((prevState) => ({ ...prevState, [name]: value }));
    },
    [setLocalData]
  );

  const isValid = useMemo(() => {
    const { timerDuration, hasSubmitted, subject, topic, ...data } = localData;
    let payload: { [key: string]: any } = { ...data };
    if (isAutomated) {
      payload = { ...payload, subject };
    }

    return Object.values(payload).every(Boolean);
  }, [localData, isAutomated]);

  const handleSubmit = () => {
    setFlashcardData((prevState) => ({
      ...prevState,
      ...localData,
      hasSubmitted: true
    }));
    goToNextStep();
  };

  return (
    <Box bg="white" width="100%" mt="30px">
      {isAutomated && (
        <>
          {' '}
          <FormControl mb={8}>
            <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
              Subject
            </FormLabel>
            <Input
              type="text"
              name="subject"
              placeholder="e.g. Chemistry"
              value={localData.subject}
              onChange={handleChange}
              _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
            />
          </FormControl>
          <FormControl mb={8}>
            <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
              Topic (optional)
            </FormLabel>
            <Input
              type="text"
              name="topic"
              placeholder="e.g. Bonds"
              value={localData.topic}
              onChange={handleChange}
              _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
            />
          </FormControl>
        </>
      )}
      <FormControl mb={8}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          Deckname
        </FormLabel>
        <Input
          type="text"
          name="deckname"
          placeholder="e.g. Deckname"
          value={localData.deckname}
          onChange={handleChange}
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
        />
      </FormControl>

      <FormControl mb={8}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          Select study type
        </FormLabel>
        <RadioGroup
          name="studyType"
          value={localData.studyType}
          onChange={(value) =>
            handleChange({
              target: { name: 'studyType', value }
            } as ChangeEvent<HTMLInputElement>)
          }
        >
          <Radio value="longTermRetention">Long term retention</Radio>
          <Radio ml={'10px'} value="quickPractice">
            Quick Practice
          </Radio>
        </RadioGroup>
      </FormControl>

      <FormControl mb={8}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          How often would you like to study?
        </FormLabel>
        <Select
          name="studyPeriod"
          placeholder="Select study period"
          value={localData.studyPeriod}
          onChange={handleChange}
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Once a week</option>
          <option value="biweekly">Twice a week</option>
          <option value="spacedRepetition">Spaced repetition</option>
        </Select>
      </FormControl>

      <FormControl mb={8}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          Number of options
        </FormLabel>
        <Input
          type="number"
          name="numOptions"
          placeholder="Number of options"
          value={localData.numOptions}
          onChange={handleChange}
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
        />
      </FormControl>

      <FormControl mb={8}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          Timer settings
        </FormLabel>
        <Select
          name="timerDuration"
          placeholder="Select a duration"
          value={localData.timerDuration}
          onChange={handleChange}
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
        >
          <option value="30">30 sec</option>
          <option value="15">15 sec</option>
        </Select>
      </FormControl>
      <HStack w="full" align={'flex-end'}>
        <Button
          variant="solid"
          isDisabled={!isValid}
          colorScheme="primary"
          size="sm"
          ml="auto"
          fontSize={'14px'}
          mt={4}
          padding="20px 25px"
          onClick={() => handleSubmit()}
        >
          <svg
            style={{ marginRight: '4px' }}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6862 12.9228L10.8423 16.7979C10.7236 17.0473 10.4253 17.1533 10.1759 17.0346C10.1203 17.0082 10.0701 16.9717 10.0278 16.9269L7.07658 13.8113C6.99758 13.7279 6.89228 13.6743 6.77838 13.6594L2.52314 13.1032C2.24932 13.0673 2.05637 12.8164 2.09216 12.5426C2.10014 12.4815 2.11933 12.4225 2.14876 12.3684L4.19993 8.59893C4.25484 8.49801 4.27333 8.38126 4.25229 8.26835L3.46634 4.0495C3.41576 3.77803 3.59484 3.51696 3.86631 3.46638C3.92684 3.45511 3.98893 3.45511 4.04946 3.46638L8.26831 4.25233C8.38126 4.27337 8.49801 4.25488 8.59884 4.19998L12.3683 2.1488C12.6109 2.01681 12.9146 2.10644 13.0465 2.349C13.076 2.40308 13.0952 2.46213 13.1031 2.52318L13.6593 6.77842C13.6743 6.89233 13.7279 6.99763 13.8113 7.07662L16.9269 10.0278C17.1274 10.2177 17.136 10.5342 16.9461 10.7346C16.9038 10.7793 16.8535 10.8158 16.7979 10.8423L12.9228 12.6862C12.8191 12.7356 12.7355 12.8191 12.6862 12.9228ZM13.3502 14.5288L14.5287 13.3503L18.0643 16.8858L16.8858 18.0643L13.3502 14.5288Z"
              fill="white"
            />
          </svg>
          Generate Flashcard
        </Button>
      </HStack>
    </Box>
  );
};

export default FlashCardSetupInit;
