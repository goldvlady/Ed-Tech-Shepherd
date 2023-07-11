import StepsIndicator, { Step } from '../../components/StepIndicator';
import { useFlashCardState } from '../Dashboard/FlashCards/context/flashcard';
import FlashCardQuestionsPage from '../Dashboard/FlashCards/forms/flashcard_setup/questions';
import FlashcardFirstPart from './FlashCards';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo } from 'react';

const transition = {
  duration: 0.3,
  ease: 'easeInOut'
};

const slideVariants = {
  hidden: { x: '-100%' },
  visible: { x: '0%' },
  exit: { x: '100%' }
};

const SetUpFlashCards = ({ isAutomated }: { isAutomated?: boolean }) => {
  const { currentStep } = useFlashCardState();
  const steps: Step[] = [{ title: '' }, { title: '' }, { title: '' }];
  const formComponents = [FlashcardFirstPart, FlashCardQuestionsPage];

  const CurrentForm = useMemo(() => formComponents[currentStep], [currentStep]);

  return (
    <section>
      <StepsIndicator steps={steps} activeStep={currentStep} />
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
    </section>
  );
};

export default SetUpFlashCards;
