import FileProcessingService from '../../../../helpers/files.helpers/fileProcessing';
import { createDocchatFlashCards } from '../../../../services/AI';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo
} from 'react';

export enum TypeEnum {
  FLASHCARD = 'flashcard',
  MNEOMONIC = 'mneomonic',
  INIT = 'init'
}

export enum SourceEnum {
  DOCUMENT = 'document',
  SUBJECT = 'subject',
  MANUAL = 'manual'
}

export enum QuestionGenerationStatusEnum {
  INIT = 'INIT',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED'
}
type SettingsType = {
  type: TypeEnum;
  source: SourceEnum;
};

interface FlashcardData {
  deckname: string;
  level?: string;
  studyType: string;
  subject?: string;
  documentId?: string;
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
  options?: string[];
  answer: string;
  explanation?: string;
  helperText?: string;
}

export interface FlashcardDataContextProps {
  flashcardData: FlashcardData;
  currentStep: number;
  resetFlashcard: () => void;
  goToNextStep: () => void;
  goToStep: (step: number) => void;
  questions: FlashcardQuestion[];
  currentQuestionIndex: number;
  goToQuestion: (index: number | ((previousIndex: number) => number)) => void;
  deleteQuestion: (index: number) => void;
  setQuestions: React.Dispatch<React.SetStateAction<FlashcardQuestion[]>>;
  setFlashcardData: React.Dispatch<React.SetStateAction<FlashcardData>>;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
  settings: SettingsType;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  isMinimized: boolean;
  setMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  generateFlashcardQuestions: (
    d?: FlashcardData,
    onDone?: (success: boolean) => void
  ) => Promise<void>;
  questionGenerationStatus: QuestionGenerationStatusEnum;
}

const FlashcardDataContext = createContext<
  FlashcardDataContextProps | undefined
>(undefined);

export const useFlashcardWizard = () => {
  const context = useContext(FlashcardDataContext);
  if (!context) {
    throw new Error(
      'useFlashcardDataContext must be used within a FlashcardWizardProvider'
    );
  }
  return context;
};

const FlashcardWizardProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { user } = userStore();

  const [settings, setSettings] = useState<SettingsType>({
    type: TypeEnum.INIT,
    source: SourceEnum.SUBJECT
  });

  const defaultFlashcardData = useMemo(
    () => ({
      deckname: '',
      studyType: '',
      studyPeriod: '',
      numQuestions: 0,
      timerDuration: '',
      hasSubmitted: false
    }),
    []
  );

  const [flashcardData, setFlashcardData] =
    useState<FlashcardData>(defaultFlashcardData);
  const [questions, setQuestions] = useState<FlashcardQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [questionGenerationStatus, setQuestionGenerationStatus] =
    useState<QuestionGenerationStatusEnum>(QuestionGenerationStatusEnum.INIT);
  const [isMinimized, setMinimized] = useState(false);

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

  const resetFlashcard = useCallback(() => {
    setFlashcardData(defaultFlashcardData);
    setQuestions([]);
    setCurrentStep(0);
    setCurrentQuestionIndex(0);
  }, [defaultFlashcardData]);

  const generateFlashcardQuestions = useCallback(
    async (
      data?: FlashcardData,
      onDone?: (success: boolean) => void,
      ingestDoc = true
    ) => {
      try {
        data = data || ({} as FlashcardData);
        const reqData = { ...flashcardData, ...data };
        setIsLoading(true);
        const count = reqData.numQuestions;
        const aiData: { [key: string]: any } = {
          topic: reqData.topic,
          subject: reqData.subject,
          count: parseInt(count as unknown as string, 10)
        };

        if (reqData.level) {
          aiData.difficulty = reqData.level;
        }

        if (reqData.documentId) {
          const responseData = {
            title: reqData.topic as string,
            studentId: user?._id as string,
            documentUrl: reqData.documentId as string
          };
          let documentId = reqData.documentId;
          if (ingestDoc) {
            const fileInfo = new FileProcessingService(responseData);
            const {
              data: [{ documentId: docId }]
            } = await fileInfo.process();
            documentId = docId;
          }
          const response = await ApiService.createDocchatFlashCards({
            topic: reqData.topic as string,
            studentId: user?.student?._id as string,
            documentId: documentId as string,
            count: parseInt(count as unknown as string, 10)
          });

          if (response.status === 200) {
            const data = await response.json();
            const questions = data.flashcards.map((d: any) => ({
              question: d.front,
              answer: d.back,
              explanation: d.explainer,
              helperText: d['helpful reading'],
              questionType: 'openEnded'
            }));

            setQuestions(questions);
            setCurrentStep((prev) => prev + 1);
            setQuestionGenerationStatus(
              QuestionGenerationStatusEnum.SUCCESSFUL
            );
            onDone && onDone(true);
          } else {
            setQuestionGenerationStatus(QuestionGenerationStatusEnum.FAILED);
            setFlashcardData((prev) => ({ ...prev, hasSubmitted: false }));
            onDone && onDone(false);
          }
        } else {
          const response = await ApiService.generateFlashcardQuestions(
            aiData,
            user?._id as string // TODO: Get this user value from somewhere
          );

          if (response.status === 200) {
            const data = await response.json();
            const questions = data.flashcards.map((d: any) => ({
              question: d.front,
              answer: d.back,
              explanation: d.explainer,
              helperText: d['helpful reading'],
              questionType: 'openEnded'
            }));

            setQuestions(questions);
            setCurrentStep((prev) => prev + 1);
            setQuestionGenerationStatus(
              QuestionGenerationStatusEnum.SUCCESSFUL
            );
            onDone && onDone(true);
          } else {
            setFlashcardData((prev) => ({ ...prev, hasSubmitted: false }));
            setQuestionGenerationStatus(QuestionGenerationStatusEnum.FAILED);
            onDone && onDone(false);
          }
        }
      } catch (error) {
        setQuestionGenerationStatus(QuestionGenerationStatusEnum.FAILED);
        setFlashcardData((prev) => ({ ...prev, hasSubmitted: false }));
        onDone && onDone(false);
      } finally {
        setIsLoading(false);
      }
    },
    [flashcardData, setQuestions, user]
  );

  const value = useMemo(
    () => ({
      flashcardData,
      setFlashcardData,
      setLoader: setIsLoading,
      isLoading,
      questions,
      currentStep,
      currentQuestionIndex,
      goToQuestion,
      deleteQuestion,
      resetFlashcard,
      setQuestions,
      generateFlashcardQuestions,
      goToNextStep: () => setCurrentStep((prev) => prev + 1),
      goToStep: (stepIndex: number) => setCurrentStep(stepIndex),
      settings,
      setMinimized,
      isMinimized,
      setSettings,
      questionGenerationStatus
    }),
    [
      flashcardData,
      isLoading,
      setFlashcardData,
      questions,
      currentStep,
      currentQuestionIndex,
      resetFlashcard,
      goToQuestion,
      deleteQuestion,
      setQuestions,
      generateFlashcardQuestions,
      settings,
      setSettings,
      setMinimized,
      isMinimized,
      questionGenerationStatus
    ]
  );

  return (
    <FlashcardDataContext.Provider value={value}>
      {children}
    </FlashcardDataContext.Provider>
  );
};

export default FlashcardWizardProvider;
