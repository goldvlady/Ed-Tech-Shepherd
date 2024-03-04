import { memo, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent
} from '../../../../../../../../components/ui/dialog';
import OcclusionWorkSpace from '../form/_components/occlusion/_components/occlusion-workspace';
import { Button } from '../../../../../../../../components/ui/button';
import { DotsHorizontal } from '../../../../../../../../components/icons';
import ApiService from '../../../../../../../../services/ApiService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '../../../../../../../../library/utils';

interface StudySessionProps {
  open: boolean;
  id: string;
  close: () => void;
  setScore: (score: any) => void;
  score: any;
  setQuizOver: (quizOver: boolean) => void;
  quizOver: boolean;
  setOpenResults: (openResults: boolean) => void;
  resetForm: () => void;
}

function StudySession({
  open,
  id,
  close,
  setScore,
  score,
  setQuizOver,
  quizOver,
  setOpenResults,
  resetForm
}: StudySessionProps) {
  const [studySession, setStudySession] = useState({
    title: '',
    imageUrl: '',
    labels: []
  });

  const [sessionStarted, setSessionStarted] = useState({
    started: false,
    data: {}
  });

  const [answered, setAnswered] = useState(false);

  const { isLoading, isSuccess, data, isFetching } = useQuery({
    queryKey: ['occlusion-card', id],
    queryFn: () => ApiService.getOcclusionCard(id).then((res) => res.json()),
    enabled: Boolean(id),
    select: (data) => data.card,
    refetchOnWindowFocus: false
  });

  const { mutate, isPending: isSubmittingQuiz } = useMutation({
    mutationFn: (data: { card: {}; percentages: {} }) =>
      ApiService.editOcclusionCard(data.card).then((res) => res.json())
  });

  useEffect(() => {
    if (isSuccess) {
      setStudySession(data);
    }
  }, [open, isSuccess, isFetching]);

  useEffect(() => {
    setScore({ right: 0, wrong: 0, notRemembered: 0 });
  }, [isFetching]);

  const numberOfBubbledChecked = studySession?.labels.filter(
    (label: any) => !label.isRevealed
  ).length;

  const onItemClicked = (item: any) => {
    if (!sessionStarted.started) return;
    if (answered) return;
    setStudySession((prevState) => ({
      ...prevState,
      labels: prevState.labels.map((label: any) => {
        if (label.order === item.order) {
          return { ...label, isRevealed: true };
        }
        return label;
      })
    }));
    setAnswered(true);
  };

  const handleQuizOver = () => {
    if (numberOfBubbledChecked === 0) {
      setQuizOver(true);
    } else {
      setQuizOver(false);
    }
  };

  useEffect(() => {
    if (quizOver) {
      mutate(
        {
          card: {
            ...data,
            score: {
              passed: score.right,
              failed: score.wrong,
              notRemembered: score.notRemembered
            }
          },
          percentages: {}
        },
        {
          onSuccess: () => {
            setSessionStarted({ started: false, data: {} });
            close();
            setOpenResults(true);
          }
        }
      );
    }
  }, [quizOver]);

  const setRight = () => {
    setScore({ ...score, right: score.right + 1 });
    setAnswered(false);
    handleQuizOver();
  };

  const setWrong = () => {
    setScore({ ...score, wrong: score.wrong + 1 });
    setAnswered(false);
    handleQuizOver();
  };

  const setNotRemembered = () => {
    setScore({ ...score, notRemembered: score.notRemembered + 1 });
    setAnswered(false);
    handleQuizOver();
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-white p-0 w-[740px] max-w-4xl">
        <header className="p-4 border-b flex items-center justify-between">
          <div className="left flex items-center gap-2">
            <h4 className="text-[#212224] text-lg">Study Session</h4>
            <p className="bg-[#F4F5F6] text-[#585F68] text-xs p-1.5 rounded">
              {studySession?.title}
            </p>
          </div>
          <div className="right flex items-center gap-3">
            <div>
              <Button
                disabled={isSubmittingQuiz}
                className={
                  sessionStarted.started ? 'bg-[red] text-[white]' : ''
                }
                onClick={() => {
                  if (sessionStarted.started) {
                    setQuizOver(true);
                    // setScore({ right: 0, wrong: 0, notRemembered: 0 });
                    return;
                  }
                  setSessionStarted({ started: true, data: studySession });
                }}
              >
                <span
                  className={cn('inline-block mr-2', {
                    hidden: sessionStarted.started
                  })}
                >
                  <svg
                    width="14"
                    height="20"
                    viewBox="0 0 14 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.8335 8.33334H13.6668L6.16683 19.1667V11.6667H0.333496L7.8335 0.833344V8.33334Z"
                      fill="white"
                    />
                  </svg>
                </span>
                {sessionStarted.started && (
                  <span className="inline-flex mr-2 rounded-full w-5 h-5 bg-white/50 items-center justify-center">
                    {isSubmittingQuiz ? (
                      <ReloadIcon className="animate-spin" />
                    ) : (
                      numberOfBubbledChecked
                    )}
                  </span>
                )}
                <span>{sessionStarted.started ? 'Stop' : 'Start'}</span>
              </Button>
            </div>
            <div>
              <DotsHorizontal />
            </div>
          </div>
        </header>
        <div className="body">
          {isFetching ? (
            <div>Loading...</div>
          ) : (
            <OcclusionWorkSpace
              imageURI={studySession?.imageUrl}
              items={studySession?.labels}
              itemClick={onItemClicked}
              studyMode={true}
              studySessionStarted={sessionStarted.started}
            />
          )}

          <div
            className={cn(
              'score-maker flex justify-between p-4 transition-opacity',
              !sessionStarted.started
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100 pointer-events-auto'
            )}
          >
            <Button
              disabled={!answered}
              className="bg-[#EDF7EE] text-[#4CAF50] w-[217px] h-[54px] text-[16px] font-medium"
              onClick={setRight}
            >
              <svg
                className="mr-2"
                width="20"
                height="11"
                viewBox="0 0 20 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.66801 7.46659L10.8447 8.64325L17.8993 1.58859L19.0778 2.76709L10.8447 11.0003L5.54134 5.69692L6.71985 4.51842L8.49051 6.28909L9.66801 7.46659ZM9.66943 5.11017L13.7966 0.98291L14.9718 2.15814L10.8447 6.28534L9.66943 5.11017ZM7.31383 9.82275L6.13631 11.0003L0.833008 5.69692L2.01152 4.51842L3.18903 5.696L3.18804 5.69692L7.31383 9.82275Z"
                  fill="#4CAF50"
                />
              </svg>
              Got it right
            </Button>
            <Button
              disabled={!answered}
              className="bg-[#FFEFE6] text-[#FB8441] w-[217px] h-[54px] text-[16px] font-medium"
              onClick={setNotRemembered}
            >
              <svg
                className="mr-2"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.00033 17.3334C4.39795 17.3334 0.666992 13.6024 0.666992 9.00002C0.666992 4.39765 4.39795 0.666687 9.00033 0.666687C13.6027 0.666687 17.3337 4.39765 17.3337 9.00002C17.3337 13.6024 13.6027 17.3334 9.00033 17.3334ZM9.00033 15.6667C12.6822 15.6667 15.667 12.6819 15.667 9.00002C15.667 5.31812 12.6822 2.33335 9.00033 2.33335C5.31843 2.33335 2.33366 5.31812 2.33366 9.00002C2.33366 12.6819 5.31843 15.6667 9.00033 15.6667ZM8.16699 11.5H9.83366V13.1667H8.16699V11.5ZM9.83366 10.1293V10.6667H8.16699V9.41669C8.16699 8.95644 8.54008 8.58335 9.00033 8.58335C9.69066 8.58335 10.2503 8.02369 10.2503 7.33335C10.2503 6.643 9.69066 6.08335 9.00033 6.08335C8.39391 6.08335 7.88833 6.51521 7.77433 7.08816L6.13975 6.76124C6.40563 5.42435 7.58533 4.41669 9.00033 4.41669C10.6112 4.41669 11.917 5.72252 11.917 7.33335C11.917 8.6546 11.0384 9.77069 9.83366 10.1293Z"
                  fill="#FB8441"
                />
              </svg>
              Didn&apos;t remember
            </Button>
            <Button
              disabled={!answered}
              className="bg-[#FEECEC] text-[#F53535] w-[217px] h-[54px] text-[16px] font-medium"
              onClick={setWrong}
            >
              <svg
                className="mr-2"
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.50033 17.3334C3.89795 17.3334 0.166992 13.6024 0.166992 9.00002C0.166992 4.39765 3.89795 0.666687 8.50033 0.666687C13.1027 0.666687 16.8337 4.39765 16.8337 9.00002C16.8337 13.6024 13.1027 17.3334 8.50033 17.3334ZM8.50033 15.6667C12.1822 15.6667 15.167 12.6819 15.167 9.00002C15.167 5.31812 12.1822 2.33335 8.50033 2.33335C4.81843 2.33335 1.83366 5.31812 1.83366 9.00002C1.83366 12.6819 4.81843 15.6667 8.50033 15.6667ZM8.50033 7.82152L10.8573 5.46449L12.0358 6.64299L9.67883 9.00002L12.0358 11.357L10.8573 12.5355L8.50033 10.1785L6.1433 12.5355L4.96479 11.357L7.32183 9.00002L4.96479 6.64299L6.1433 5.46449L8.50033 7.82152Z"
                  fill="#F53535"
                />
              </svg>
              Got it wrong
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(StudySession);
