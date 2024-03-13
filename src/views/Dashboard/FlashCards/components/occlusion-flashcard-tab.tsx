import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ApiService from "../../../../services/ApiService";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { format } from "date-fns";
import StudySession from "../forms/flashcard_setup/manual-occlusion-2/_components/study-session";
import OccResultsDialog from "../forms/flashcard_setup/manual-occlusion-2/_components/study-session/_components";

const OcclusionFlashcardTab = () => {
  const [state, setState] = useState({
    open: false,
    id: '',
    score: {
      right: 0,
      wrong: 0,
      notRemembered: 0
    },
    quizOver: false,
    showResults: false
  });

  const { data, isLoading } = useQuery({
    queryKey: ['image-occlusions'],
    queryFn: () => ApiService.fetchOcclusionCards().then((res) => res.json()),
    select: (data) => {
      if (data.message === 'Successfully retrieved occlusion cards') {
        return {
          list: data.data,
          meta: data.meta
        };
      } else {
        return {
          list: [],
          meta: {}
        };
      }
    }
  });

  const handleOpen = (id: string) => {
    setState((pS) => ({
      ...pS,
      open: true,
      id
    }));
  };

  const handleClose = () => {
    setState((pS) => ({
      ...pS,
      open: false
    }));
  };

  const setQuizOver = (input: boolean) => {
    setState((pS) => ({
      ...pS,
      quizOver: input
    }));
  };

  const showResults = (input: boolean) => {
    setState((prevState) => ({
      ...prevState,
      showResults: input
    }));
  };

  const setScore = (score) => {
    setState((prevState) => ({
      ...prevState,
      score
    }));
  };

  const handleRestart = () => {
    setState((pS) => ({
      ...pS,
      open: true,
      score: {
        notRemembered: 0,
        right: 0,
        wrong: 0
      },
      showResults: false,
      quizOver: false
    }));
  };

  return (
    <div className="w-full h-full pt-4">
      <Table>
        <TableCaption>List of Image Occlusion Flashcards</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Deckname</TableHead>
            <TableHead>No. of Rectangles</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last attempted</TableHead>
            <TableHead>Last attempted score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? [1, 2, 3, 4, 5, 6, 7].map((list) => {
                return (
                  <TableRow key={list}>
                    <TableCell className="font-medium">
                      <div className="w-20 h-4 bg-gray-200 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-4 bg-gray-200 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-4 bg-gray-200 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-4 bg-gray-200 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-4 bg-gray-200 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-4 bg-gray-200 animate-pulse"></div>
                    </TableCell>
                    <TableCell className="text-right flex justify-end">
                      <div className="w-20 h-4 bg-gray-200 animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                );
              })
            : data?.list.map((row) => (
                <TableRow
                  key={row._id}
                  className="hover:bg-stone-100 cursor-pointer"
                  onClick={() => {
                    handleOpen(row._id);
                  }}
                >
                  <TableCell className="font-medium">{row.title}</TableCell>
                  <TableCell>{row.labels.length}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    {format(new Date(row.createdAt), 'MMM d, yy h:mm a')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(row.updatedAt), 'MMM d, yy h:mm a')}
                  </TableCell>
                  <TableCell>
                    {row.percentages.passPercentage
                      ? Math.round(row.percentages.passPercentage) + '%'
                      : 0 + '%'}
                  </TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <StudySession
        id={state.id}
        open={state.open}
        close={handleClose}
        quizOver={state.quizOver}
        setQuizOver={setQuizOver}
        score={state.score}
        setOpenResults={showResults}
        setScore={setScore}
      />
      <OccResultsDialog
        id={state.id}
        open={state.showResults}
        score={state.score}
        close={() => {
          setState((pS) => {
            return {
              ...pS,
              quizOver: false,
              showResults: false,
              score: {
                notRemembered: 0,
                right: 0,
                wrong: 0
              }
            };
          });
        }}
        restartStudySession={handleRestart}
        handleEditImage={() => null}
      />
    </div>
  );
};

export default OcclusionFlashcardTab;
