import StepsIndicator, { Step } from '../../../../../components/StepIndicator';
import { useFlashCardState } from '../../context/flashcard';
import FlashCardSetupInit from './init';
import FlashCardQuestionsPage from './questions';
import { Box, Text } from '@chakra-ui/react';
import { Tag, TagLabel } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useMemo } from 'react';

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
  const formComponents = useMemo(
    () => [FlashCardSetupInit, FlashCardQuestionsPage],
    []
  );

  const CurrentForm = useMemo(
    () => formComponents[currentStep],
    [currentStep, formComponents]
  );

  return (
    <Box width={'100%'}>
      <Text fontSize={'24px'} fontWeight="500" marginBottom="5px">
        Set up flashcard
      </Text>
      {!isAutomated && (
        <Tag my="10px" borderRadius="5" background="#f7f8fa" size="md">
          <TagLabel>
            Step {currentStep + 1} of {steps.length}
          </TagLabel>
        </Tag>
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
          <CurrentForm isAutomated={isAutomated} />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default SetupFlashcardPage;
