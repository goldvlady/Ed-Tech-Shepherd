import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import LoaderOverlay from '../../../components/loaderOverlay';
import ApiService from '../../../services/ApiService';
import quizStore from '../../../state/quizStore';
import { QuizData, QuizQuestion } from '../../../types';
import { ChatPreview as QuizPreviewer } from './previews';
import { Box, Flex } from '@chakra-ui/react';
import { isEmpty, isNil, map, merge } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './styles.css';

type NewQuizQuestion = QuizQuestion & {
  canEdit?: boolean;
};

const CreateQuizPage = () => {
  const [searchParams] = useSearchParams();
  const toast = useCustomToast();
  const { isLoading, fetchQuizzes, handleIsLoadingQuizzes } = quizStore();
  const [quizId, setQuizId] = useState<string | null | undefined>(null);

  const [questions, setQuestions] = useState<NewQuizQuestion[]>([]);

  const [title, setTitle] = useState('');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchQuizzes, handleIsLoadingQuizzes, searchParams]);

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
