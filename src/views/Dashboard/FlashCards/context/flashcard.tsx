import React, { createContext, useState, useEffect, useContext } from "react";

interface FlashcardData {
  deckname: string;
  studyType: string;
  studyPeriod: string;
  numOptions: number;
  timerDuration: string;
  hasSubmitted: boolean;
}

export interface FlashcardQuestion {
  questionType: string;
  question: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  answer: string;
}

export interface FlashcardDataContextProps {
  flashcardData: FlashcardData;
  currentStep: number;
  goToNextStep: () => void;
  questions: FlashcardQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<FlashcardQuestion[]>>;
  setFlashcardData: React.Dispatch<React.SetStateAction<FlashcardData>>;
}

const FlashcardDataContext = createContext<
  FlashcardDataContextProps | undefined
>(undefined);

export const useFlashCardState = () => {
  const context = useContext(FlashcardDataContext);
  if (!context) {
    throw new Error(
      "useFlashcardDataContext must be used within a FlashcardDataProvider"
    );
  }
  return context;
};

const FlashcardDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [flashcardData, setFlashcardData] = useState<FlashcardData>({
    deckname: "",
    studyType: "",
    studyPeriod: "",
    numOptions: 0,
    timerDuration: "",
    hasSubmitted: false,
  });

  const [questions, setQuestions] = useState<FlashcardQuestion[]>([]);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const questionsEmptyState = {
      questionType: "",
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      answer: "",
    };

    if (flashcardData.numOptions) {
      const numQuestions = flashcardData.numOptions;
      const generatedQuestions: FlashcardQuestion[] = [];

      for (let i = 0; i < numQuestions; i++) {
        generatedQuestions.push(questionsEmptyState);
      }

      setQuestions(generatedQuestions);
    }
  }, [flashcardData.numOptions]);

  return (
    <FlashcardDataContext.Provider
      value={{
        flashcardData,
        setFlashcardData,
        questions,
        currentStep,
        setQuestions,
        goToNextStep: () => setCurrentStep((prev) => prev + 1),
      }}
    >
      {children}
    </FlashcardDataContext.Provider>
  );
};

export default FlashcardDataProvider;
