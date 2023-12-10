import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
// import TagModal from '../../../components/TagModal';
import LoaderOverlay from '../../../components/loaderOverlay';
import { useSearch } from '../../../hooks';
import ApiService from '../../../services/ApiService';
import quizStore from '../../../state/quizStore';
import { QuizData, QuizQuestion } from '../../../types';
// import QuizDataProvider from './context';
// import LoaderScreen from './forms/quizz_setup/loader_page';
import { ChatPreview as QuizPreviewer } from './previews';
import './styles.css';
import { Box, Flex, AlertStatus, ToastPosition } from '@chakra-ui/react';
import { isEmpty, isNil, map, merge } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type NewQuizQuestion = QuizQuestion & {
  canEdit?: boolean;
};

const CreateQuizPage = () => {
  // const TAG_TITLE = 'Tags Alert';
  const [searchParams] = useSearchParams();
  const toast = useCustomToast();
  const { isLoading, fetchQuizzes, handleIsLoadingQuizzes } = quizStore();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [quizId, setQuizId] = useState<string | null | undefined>(null);

  const [questions, setQuestions] = useState<NewQuizQuestion[]>([]);
  const [searchQuestions, setSearchQuestions] = useState<NewQuizQuestion[]>([]);

  const [tags, setTags] = useState<string[]>([]);
  const [newTags, setNewTags] = useState<string[]>(tags);
  const [inputValue, setInputValue] = useState('');
  const [title, setTitle] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [uploadingState, setUploadingState] = useState(false);

  const handleSetUploadingState = (value: boolean) => setUploadingState(value);

  const handleClearQuiz = () => setQuestions([]);

  const showToast = (
    title: string,
    description: string,
    status: AlertStatus,
    position: ToastPosition = 'top-right',
    duration = 5000,
    isClosable = true
  ) => {
    toast({
      title: description ?? title,
      status: status,
      position: position,
      duration: duration,
      isClosable: isClosable
    });
  };

  useEffect(() => {
    const queryQuizId = searchParams.get('quiz_id');

    if (!isEmpty(queryQuizId) && !isNil(queryQuizId)) {
      (async () => {
        try {
          handleIsLoadingQuizzes(true);
          const result: any = await ApiService.getQuiz(queryQuizId as string);
          const { data }: { data: QuizData } = await result.json();

          if (data) {
            setQuizId(queryQuizId);
            setTitle(data.title);
            setTags(data.tags);
            setQuestions(
              map(data?.questions, (question) =>
                merge({}, question, { canEdit: true })
              )
            );
          }
        } catch (error) {
          console.log('getQuiz Error =========>> ', error);

          toast({
            position: 'top-right',
            title: `failed to fetch quiz`,
            status: 'error'
          });
        } finally {
          handleIsLoadingQuizzes(false);
        }
      })();
    }
  }, [fetchQuizzes, handleIsLoadingQuizzes, searchParams]);

  // useEffect(() => {
  //   setQuestions([
  //     {
  //       question: 'What is the main purpose of a knife?',
  //       type: 'openEnded',
  //       answer: 'Cutting',
  //       explanation:
  //         'Knife primarily serves as a cutting tool. It may be used in various contexts like kitchen for food preparation or in arts for creating crafts.'
  //     },
  //     {
  //       canEdit: true,
  //       question:
  //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       type: 'multipleChoiceMulti',
  //       options: [
  //         {
  //           content:
  //             'Cutting food Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //           isCorrect: true
  //         },
  //         {
  //           content:
  //             'Sewing clothes Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //           isCorrect: false
  //         },
  //         {
  //           content:
  //             'Opening a package Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //           isCorrect: false
  //         },
  //         {
  //           content:
  //             'Writing a letter Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //           isCorrect: false
  //         }
  //       ]
  //     },
  //     {
  //       question:
  //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       type: 'multipleChoiceSingle',
  //       options: [
  //         {
  //           content:
  //             'Cutting food Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //           isCorrect: true
  //         },
  //         {
  //           content:
  //             'Sewing clothes Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //           isCorrect: false
  //         },
  //         {
  //           content:
  //             'Opening a package Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //           isCorrect: false
  //         },
  //         {
  //           content:
  //             'Writing a letter Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //           isCorrect: false
  //         }
  //       ]
  //     },
  //     {
  //       question: 'A knife can be used for...',
  //       type: 'multipleChoiceMulti',
  //       options: [
  //         {
  //           content: 'Cutting food',
  //           isCorrect: true
  //         },
  //         {
  //           content: 'Sewing clothes',
  //           isCorrect: false
  //         },
  //         {
  //           content: 'Opening a package',
  //           isCorrect: true
  //         },
  //         {
  //           content: 'Writing a letter',
  //           isCorrect: false
  //         }
  //       ]
  //     },
  //     {
  //       question: 'The sharp side of the knife is called...?',
  //       type: 'multipleChoiceSingle',
  //       options: [
  //         {
  //           content: 'Handle',
  //           isCorrect: false
  //         },
  //         {
  //           content: 'Edge',
  //           isCorrect: true
  //         },
  //         {
  //           content: 'Point',
  //           isCorrect: false
  //         },
  //         {
  //           content: 'Blade',
  //           isCorrect: false
  //         }
  //       ]
  //     },
  //     {
  //       question: 'Is it safe to play with a knife?',
  //       type: 'trueFalse',
  //       options: [
  //         {
  //           content: 'true',
  //           isCorrect: false
  //         },
  //         {
  //           content: 'false',
  //           isCorrect: true
  //         }
  //       ]
  //     },
  //     {
  //       question: 'If you see a knife lying around, you should...',
  //       type: 'multipleChoiceSingle',
  //       options: [
  //         {
  //           content: 'Pick it up and play with it',
  //           isCorrect: false
  //         },
  //         {
  //           content: 'Leave it there',
  //           isCorrect: false
  //         },
  //         {
  //           content: 'Tell an adult',
  //           isCorrect: true
  //         },
  //         {
  //           content: 'Put it in your pocket',
  //           isCorrect: false
  //         }
  //       ]
  //     }
  //   ]);
  // }, []);

  return (
    <>
      <Flex
        className="quiz-page-wrapper"
        width={'100%'}
        height={'100vh'}
        maxH={'calc(100vh - 80px)'}
        overflowY={'hidden'}
        flexWrap="wrap"
      >
        <Box
          className="review-quiz-wrapper"
          width={['100%']}
          bg="#F9F9FB"
          borderLeft="1px solid #E7E8E9"
        >
          {isLoading && <LoaderOverlay />}

          <QuizPreviewer
            title={title}
            questions={questions}
            quizId={quizId as string}
            handleSetUploadingState={handleSetUploadingState}
          />
        </Box>
      </Flex>
    </>
  );
};

const TakeQuiz = () => {
  return <CreateQuizPage />;
};

export default TakeQuiz;
