import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo
} from 'react';

interface FlashcardData {
  deckname: string;
  label?: string;
  studyType: string;
  subject?: string;
  topic?: string;
  studyPeriod: string;
  numQuestions: number;
  timerDuration?: string;
  hasSubmitted: boolean;
  studyDuration?: string;
  selectQuestionTypes?: string[];
  selectPagesInclude?: number;
}

export interface FlashcardQuestion {
  questionType: string;
  question: string;
  options?: string[]; // options is now an array of strings
  answer: string;
}

export interface FlashcardDataContextProps {
  flashcardData: FlashcardData;
  currentStep: number;
  goToNextStep: () => void;
  goToStep: (step: number) => void;
  questions: FlashcardQuestion[];
  currentQuestionIndex: number;
  goToQuestion: (index: number | ((previousIndex: number) => number)) => void;
  deleteQuestion: (index: number) => void;
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
      'useFlashcardDataContext must be used within a FlashcardDataProvider'
    );
  }
  return context;
};

const FlashcardDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [flashcardData, setFlashcardData] = useState<FlashcardData>({
    deckname: '',
    studyType: '',
    studyPeriod: '',
    numQuestions: 0,
    timerDuration: '',
    hasSubmitted: false
  });

  const [questions, setQuestions] = useState<FlashcardQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  //...

  const goToQuestion = useCallback(
    (arg: number | ((previousIndex: number) => number)) => {
      const index = typeof arg === 'function' ? arg(currentQuestionIndex) : arg;
      setCurrentQuestionIndex(index);
    },
    [currentQuestionIndex]
  );

  const deleteQuestion = useCallback((index: number) => {
    setQuestions((prev) => {
      const newQuestions = prev.filter(
        (_, questionIndex) => questionIndex !== index
      );

      // Subtract one from currentQuestionIndex since one question is deleted
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );

      return newQuestions;
    });
  }, []);

  useEffect(() => {
    const questionsEmptyState = {
      questionType: '',
      question: '',
      options: [], // Initialized options as empty array
      answer: ''
    };

    if (flashcardData.numQuestions) {
      const numQuestions = flashcardData.numQuestions;
      const generatedQuestions: FlashcardQuestion[] = [];

      for (let i = 0; i < numQuestions; i++) {
        generatedQuestions.push(questionsEmptyState);
      }

      setQuestions(generatedQuestions);
    }
  }, [flashcardData.numQuestions]);

  const value = useMemo(
    () => ({
      flashcardData,
      setFlashcardData,
      questions,
      currentStep,
      currentQuestionIndex,
      goToQuestion,
      deleteQuestion,
      setQuestions,
      goToNextStep: () => setCurrentStep((prev) => prev + 1),
      goToStep: (stepIndex: number) => setCurrentStep(stepIndex)
    }),
    [
      flashcardData,
      setFlashcardData,
      questions,
      currentStep,
      currentQuestionIndex,
      goToQuestion,
      deleteQuestion,
      setQuestions
    ]
  );

  return (
    <FlashcardDataContext.Provider value={value}>
      {children}
    </FlashcardDataContext.Provider>
  );
};

export default FlashcardDataProvider;
