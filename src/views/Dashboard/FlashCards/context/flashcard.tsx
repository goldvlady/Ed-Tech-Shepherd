import FileProcessingService from '../../../../helpers/files.helpers/fileProcessing';
import { createDocchatFlashCards } from '../../../../services/AI';
import ApiService from '../../../../services/ApiService';
import flashcardStore from '../../../../state/flashcardStore';
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
  ingestId?: string;
  noteDoc?: string;
}

export interface FlashcardQuestion {
  questionType: string;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  helperText?: string;
}

export type AIRequestBody = {
  topic?: string;
  count: number;
  subject?: string;
  difficulty?: string;
  note?: string;
};

export interface FlashcardDataContextProps {
  flashcardData: FlashcardData;
  currentStep: number;
  resetFlashcard: () => void;
  isResetted: boolean;
  goToNextStep: () => void;
  goToStep: (step: number) => void;
  questions: FlashcardQuestion[];
  currentQuestionIndex: number;
  isSaveSuccessful: boolean;
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
    onDone?: (success: boolean) => void,
    ingestDoc?: boolean
  ) => Promise<void>;
  questionGenerationStatus: QuestionGenerationStatusEnum;
  saveFlashcardData: (
    onDone?: ((success: boolean) => void) | undefined
  ) => Promise<void>;
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
  const { createFlashCard } = flashcardStore();

  const [settings, setSettings] = useState<SettingsType>({
    type: TypeEnum.INIT,
    source: SourceEnum.SUBJECT
  });

  const [isResetted, setResetted] = useState(false);
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
  const [isSaveSuccessful, setSaveSuccessful] = useState(false);
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

  useEffect(() => {
    if (isResetted) {
      setResetted(false);
    }
    // eslint-disable-next-line
  }, [flashcardData]);

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
    console.log(defaultFlashcardData);
    setFlashcardData(defaultFlashcardData);
    setQuestions([]);
    setSaveSuccessful(false);
    setCurrentStep(0);
    setCurrentQuestionIndex(0);
    setResetted(true);
  }, [defaultFlashcardData]);

  // Process the document-related request
  const processDocumentRequest = useCallback(
    async (
      reqData: FlashcardData,
      ingestDoc: boolean,
      aiData: AIRequestBody
    ) => {
      const responseData = {
        title: reqData.topic as string,
        student: user?._id as string,
        documentUrl: reqData.documentId as string
      };

      let documentId = reqData.ingestId || reqData.documentId;

      if (ingestDoc && !reqData.ingestId) {
        const fileInfo = new FileProcessingService(responseData);
        const {
          data: [{ documentId: docId }]
        } = await fileInfo.process();
        documentId = docId;
      }

      return await ApiService.createDocchatFlashCards({
        ...aiData,
        studentId: user?._id as string,
        documentId: documentId as string
      });
    },
    [user]
  );

  const handleError = useCallback(
    (onDone?: (success: boolean) => void) => {
      setQuestionGenerationStatus(QuestionGenerationStatusEnum.FAILED);
      setFlashcardData((prev) => ({ ...prev, hasSubmitted: false }));
      onDone && onDone(false);
    },
    [setQuestionGenerationStatus, setFlashcardData]
  );

  // Handle the API response
  const handleResponse = useCallback(
    async (response: Response, onDone?: (success: boolean) => void) => {
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
        setQuestionGenerationStatus(QuestionGenerationStatusEnum.SUCCESSFUL);
        onDone && onDone(true);
      } else {
        handleError(onDone);
      }
    },
    [setQuestions, setCurrentStep, setQuestionGenerationStatus, handleError]
  );

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

        const aiData: AIRequestBody = {
          topic: reqData.topic,
          subject: reqData.subject,
          count: parseInt(reqData.numQuestions as unknown as string, 10),
          ...(reqData.level && { difficulty: reqData.level }),
          ...(reqData.noteDoc && { note: reqData.noteDoc })
        };

        let response;

        if (reqData.documentId) {
          response = await processDocumentRequest(reqData, ingestDoc, aiData);
        } else {
          const requestFunc = !reqData.noteDoc
            ? ApiService.generateFlashcardQuestions
            : ApiService.generateFlashcardQuestionsForNotes;

          response = await requestFunc(aiData, user?._id as string);
        }

        await handleResponse(response, onDone);
      } catch (error) {
        handleError(onDone);
      } finally {
        setIsLoading(false);
      }
    },
    [flashcardData, user, handleError, processDocumentRequest, handleResponse]
  );

  // Handle errors

  const saveFlashcardData = useCallback(
    async (onDone?: (success: boolean) => void) => {
      try {
        setIsLoading(true);
        const response = await createFlashCard(
          { ...flashcardData, questions },
          'manual'
        );
        if (response) {
          if (response.status === 200) {
            setSaveSuccessful(true);
            onDone && onDone(true);
          } else {
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
    [flashcardData, createFlashCard, questions]
  );

  const value = useMemo(
    () => ({
      flashcardData,
      setFlashcardData,
      setLoader: setIsLoading,
      isLoading,
      isSaveSuccessful,
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
      questionGenerationStatus,
      saveFlashcardData,
      isResetted
    }),
    [
      flashcardData,
      isSaveSuccessful,
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
      questionGenerationStatus,
      saveFlashcardData,
      isResetted
    ]
  );

  return (
    <FlashcardDataContext.Provider value={value}>
      {children}
    </FlashcardDataContext.Provider>
  );
};

export default FlashcardWizardProvider;
