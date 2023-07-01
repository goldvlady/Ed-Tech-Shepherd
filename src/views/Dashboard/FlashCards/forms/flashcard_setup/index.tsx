import StepsIndicator, { Step } from '../../../../../components/StepIndicator';
import { useFlashCardState } from '../../context/flashcard';
import FlashCardSetupInit from './init';
import FlashCardQuestionsPage from './questions';
import { Box, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

const transition = {
  duration: 0.3,
  ease: 'easeInOut'
};

const slideVariants = {
  hidden: { x: '-100%' },
  visible: { x: '0%' },
  exit: { x: '100%' }
};

const SetupFlashcardPage = ({ isAutomated }: { isAutomated?: boolean }) => {
  const { currentStep } = useFlashCardState();
  const steps: Step[] = [{ title: '' }, { title: '' }, { title: '' }];

  const forms: (() => JSX.Element)[] = [
    () => <FlashCardSetupInit isAutomated={isAutomated} />,
    FlashCardQuestionsPage
    // Add other form components for different steps
  ];

  const Form = forms[currentStep];

  return (
    <Box>
      <Text fontSize={'24px'} fontWeight="500" marginBottom="5px">
        Set up flashcard
      </Text>
      {!isAutomated && (
        <StepsIndicator steps={steps} activeStep={currentStep} />
      )}
      <AnimatePresence>
        <motion.div
          key={currentStep}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideVariants}
          transition={transition}
        >
          <Form />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default SetupFlashcardPage;
