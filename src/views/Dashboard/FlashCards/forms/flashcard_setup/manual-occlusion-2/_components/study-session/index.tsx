import { memo, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent
} from '../../../../../../../../components/ui/dialog';
import OcclusionWorkSpace from '../form/_components/occlusion/_components/occlusion-workspace';
import { Button } from '../../../../../../../../components/ui/button';
import { DotsHorizontal } from '../../../../../../../../components/icons';
import { cn } from '../../../../../../../../library/utils';
import ApiService from '../../../../../../../../services/ApiService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ReloadIcon } from '@radix-ui/react-icons';

function StudySession({
  open,
  id,
  close,
  setScore,
  score,
  setQuizOver,
  quizOver,
  setOpenResults
}: {
  open: boolean;
  id: string;
  close: () => void;
  setScore: (score: any) => void;
  score: any;
  setQuizOver: (quizOver: boolean) => void;
  quizOver: boolean;
  setOpenResults: (openResults: boolean) => void;
}) {
  console.log('score', score);
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
  // const [score, setScore] = useState({
  //   right: 0,
  //   wrong: 0,
  //   notRemembered: 0
  // });

  const { isLoading, isSuccess, data } = useQuery({
    queryKey: ['occlusion-card', id],
    queryFn: () => ApiService.getOcclusionCard(id).then((res) => res.json()),
    enabled: Boolean(id),
    select: (data) => {
      console.log('GET OCCL', data);
      return data.card;
    }
  });

  const { mutate, isPending: isSubmittingQuiz } = useMutation({
    mutationFn: (data: { card: {}; percentages: {} }) => {
      console.log('MUTATE', data);
      return ApiService.editOcclusionCard(data.card).then((res) => res.json());
    }
  });

  useEffect(() => {
    if (isSuccess) {
      setStudySession(data);
    }
  }, [open, isSuccess]);

  const numberOfBubbledChecked = studySession.labels.filter(
    (label: any) => !label.isRevealed
  ).length;

  const onItemClicked = (item: any) => {
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
          onSuccess: (data) => {
            console.log('onSuccess', data);
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
                    setSessionStarted({ started: false, data: {} });
                    setScore({ right: 0, wrong: 0, notRemembered: 0 });
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
          {isLoading && <div>Loading...</div>}
          <OcclusionWorkSpace
            imageURI={studySession.imageUrl}
            items={studySession.labels}
            itemClick={onItemClicked}
            studyMode={true}
            studySessionStarted={sessionStarted.started}
          />
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
              Got it right
            </Button>
            <Button
              disabled={!answered}
              className="bg-[#FFEFE6] text-[#FB8441] w-[217px] h-[54px] text-[16px] font-medium"
              onClick={setNotRemembered}
            >
              Didn&apos;t remember
            </Button>
            <Button
              disabled={!answered}
              className="bg-[#FEECEC] text-[#F53535] w-[217px] h-[54px] text-[16px] font-medium"
              onClick={setWrong}
            >
              Got it wrong
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(StudySession);
