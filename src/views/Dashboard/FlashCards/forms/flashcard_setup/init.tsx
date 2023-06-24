import React, { useMemo, useState } from "react";
import { useFlashCardState } from "../../context/flashcard";
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
} from "@chakra-ui/react";

const FlashCardSetupInit = () => {
  const { flashcardData, setFlashcardData, goToNextStep } = useFlashCardState();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFlashcardData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isValid = useMemo(() => {
    const { timerDuration, hasSubmitted, ...data } = flashcardData;
    return Object.values(data).every(Boolean);
  }, [flashcardData]);

  const handleSubmit = () => {
    setFlashcardData((prevState) => ({
      ...prevState,
      hasSubmitted: true,
    }));
    goToNextStep();
  };

  return (
    <Box bg="white" width="100%" mt="30px">
      <FormControl mb={6}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          Deckname
        </FormLabel>
        <Input
          type="text"
          name="deckname"
          placeholder="e.g. Deckname"
          value={flashcardData.deckname}
          onChange={handleChange}
          _placeholder={{ fontSize: "14px", color: "#9A9DA2" }}
        />
      </FormControl>

      <FormControl mb={6}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          Select study type
        </FormLabel>
        <RadioGroup
          name="studyType"
          value={flashcardData.studyType}
          onChange={(value) =>
            handleChange({ target: { name: "studyType", value } })
          }
        >
          <Radio value="longTermRetention">Long term retention</Radio>
          <Radio ml={"10px"} value="quickPractice">
            Quick Practice
          </Radio>
        </RadioGroup>
      </FormControl>

      <FormControl mb={6}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          How often would you like to study?
        </FormLabel>
        <Select
          name="studyPeriod"
          placeholder="Select study period"
          value={flashcardData.studyPeriod}
          onChange={handleChange}
          _placeholder={{ fontSize: "14px", color: "#9A9DA2" }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Once a week</option>
          <option value="biweekly">Twice a week</option>
          <option value="spacedRepetition">Spaced repetition</option>
        </Select>
      </FormControl>

      <FormControl mb={6}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          Number of options
        </FormLabel>
        <Input
          type="number"
          name="numOptions"
          placeholder="Number of options"
          value={flashcardData.numOptions}
          onChange={handleChange}
          _placeholder={{ fontSize: "14px", color: "#9A9DA2" }}
        />
      </FormControl>

      <FormControl mb={6}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          Timer settings
        </FormLabel>
        <Select
          name="timerDuration"
          placeholder="Select a duration"
          value={flashcardData.timerDuration}
          onChange={handleChange}
          _placeholder={{ fontSize: "14px", color: "#9A9DA2" }}
        >
          <option value="30">30 sec</option>
          <option value="15">15 sec</option>
        </Select>
      </FormControl>
      <HStack w="full" align={"flex-end"}>
        <Button
          variant="solid"
          isDisabled={!isValid}
          colorScheme="primary"
          size="sm"
          ml="auto"
          fontSize={"14px"}
          mt={4}
          padding="20px 25px"
          onClick={() => handleSubmit()}
        >
          {/* <Image
            boxSize="40px"
            objectFit="cover"
            alt=""
            src={require("../../../../../assets/magic-wand.png")}
          /> */}
          Generate Flashcard
        </Button>
      </HStack>
    </Box>
  );
};

export default FlashCardSetupInit;
