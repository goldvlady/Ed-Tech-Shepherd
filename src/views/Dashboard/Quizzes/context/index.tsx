import React, { createContext, useContext, useMemo, useReducer } from 'react';

interface QuizData {
  quizname: string;
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

export interface QuizQuestion {
  questionType: string;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  helperText?: string;
}

type QuestionTransformer = (questions: QuizQuestion[]) => QuizQuestion[];

type setQuestions = (input: QuizQuestion[] | QuestionTransformer) => void;

export interface QuizDataContextProps {
  quizData: QuizData;
  currentStep: number;
  resetQuiz: () => void;
  goToNextStep: () => void;
  goToStep: (step: number) => void;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  goToQuestion: (index: number | ((previousIndex: number) => number)) => void;
  deleteQuestion: (index: number) => void;
  setQuestions: setQuestions;
  setQuizData: (data: QuizData) => void;
}

const QuizDataContext = createContext<QuizDataContextProps | undefined>(
  undefined
);

export const useQuizState = () => {
  const context = useContext(QuizDataContext);
  if (!context) {
    throw new Error(
      'useQuizDataContext must be used within a QuizDataProvider'
    );
  }
  return context;
};

// Define the action types
const ActionTypes = {
  SetQuizData: 'SET_QUIZ_DATA',
  SetQuestions: 'SET_QUESTIONS',
  GoToNextStep: 'GO_TO_NEXT_STEP',
  GoToStep: 'GO_TO_STEP',
  GoToQuestion: 'GO_TO_QUESTION',
  DeleteQuestion: 'DELETE_QUESTION',
  ResetQuiz: 'RESET_QUIZ'
};

// Define the reducer function
const quizReducer = (state: any, action: any) => {
  switch (action.type) {
    case ActionTypes.SetQuizData:
      return { ...state, quizData: action.payload };
    case ActionTypes.SetQuestions:
      return { ...state, questions: action.payload };
    case ActionTypes.GoToNextStep:
      return { ...state, currentStep: state.currentStep + 1 };
    case ActionTypes.GoToStep:
      return { ...state, currentStep: action.payload };
    case ActionTypes.GoToQuestion:
      return { ...state, currentQuestionIndex: action.payload };
    case ActionTypes.DeleteQuestion: {
      const newQuestions = state.questions.filter(
        (_: any, questionIndex: number) => questionIndex !== action.payload
      );
      return {
        ...state,
        questions: newQuestions,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
      };
    }
    case ActionTypes.ResetQuiz:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const QuizDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const defaultQuizData = useMemo(
    () => ({
      quizname: '',
      studyType: '',
      studyPeriod: '',
      numQuestions: 0,
      timerDuration: '',
      hasSubmitted: false
    }),
    []
  );

  const defaultState = {
    quizData: defaultQuizData,
    questions: [],
    currentStep: 0,
    currentQuestionIndex: 0
  };

  const [state, dispatch] = useReducer(quizReducer, defaultState);

  const setQuestions = (
    newQuestions:
      | QuizQuestion[]
      | ((questions: QuizQuestion[]) => QuizQuestion[])
  ) => {
    let newData: QuizQuestion[];

    if (Array.isArray(newQuestions)) {
      newData = newQuestions;
    } else if (typeof newQuestions === 'function') {
      newData = newQuestions(state.questions); // assuming questionData is in scope
    } else {
      throw new Error('newQuestions must be an array or a function');
    }

    dispatch({ type: ActionTypes.SetQuestions, payload: newData });
  };

  // Destructure the state to simplify the value object
  const { quizData, questions, currentStep, currentQuestionIndex } = state;

  const value = useMemo(
    () => ({
      quizData,
      setQuizData: (data: QuizData) =>
        dispatch({ type: ActionTypes.SetQuizData, payload: data }),
      questions,
      currentStep,
      currentQuestionIndex,
      goToQuestion: (index: number | ((previousIndex: number) => number)) =>
        dispatch({ type: ActionTypes.GoToQuestion, payload: index }),
      deleteQuestion: (index: number) =>
        dispatch({ type: ActionTypes.DeleteQuestion, payload: index }),
      resetQuiz: () =>
        dispatch({ type: ActionTypes.ResetQuiz, payload: defaultState }),
      setQuestions: setQuestions,
      goToNextStep: () => dispatch({ type: ActionTypes.GoToNextStep }),
      goToStep: (stepIndex: number) =>
        dispatch({ type: ActionTypes.GoToStep, payload: stepIndex })
    }),
    [quizData, questions, currentStep, currentQuestionIndex]
  );

  return (
    <QuizDataContext.Provider value={value}>
      {children}
    </QuizDataContext.Provider>
  );
};

export default QuizDataProvider;
