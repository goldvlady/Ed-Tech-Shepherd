import React, { useState } from "react";
import { useFlashCardState } from "../../context/flashcard";
import FlashCardQuestionsPage from "./questions";
import FlashCardSetupInit from "./init";
import { Box, Heading } from "@chakra-ui/react";
import StepsIndicator, { Step } from "../../../../../components/StepIndicator";
import { motion } from "framer-motion";

const transition = {
  duration: 0.3,
  ease: "easeInOut",
};

const slideVariants = {
  hidden: { x: "-100%" },
  visible: { x: "0%" },
  exit: { x: "100%" },
};

const SetupFlashcardPage = () => {
  const { currentStep } = useFlashCardState();
  const steps: Step[] = [{ title: "" }, { title: "" }, { title: "" }];

  const forms: { [key: number]: () => JSX.Element } = {
    0: FlashCardSetupInit,
    1: FlashCardQuestionsPage,
    // Add other form components for different steps
  };

  const Form = forms[currentStep];

  return (
    <Box>
      <Heading fontWeight="bold" marginBottom="20px">
        Set up flashcard
      </Heading>
      <StepsIndicator steps={steps} activeStep={currentStep} />
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideVariants}
        transition={transition}
      >
        <Form />
      </motion.div>
    </Box>
  );
};

export default SetupFlashcardPage;
