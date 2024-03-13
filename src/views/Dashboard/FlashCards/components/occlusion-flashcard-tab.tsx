import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import ApiService from '../../../../services/ApiService';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../components/ui/table';
import { format } from 'date-fns';
import StudySession from '../forms/flashcard_setup/manual-occlusion-2/_components/study-session';
import OccResultsDialog from '../forms/flashcard_setup/manual-occlusion-2/_components/study-session/_components/occlusion-result-dialog';
import { Progress } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../components/ui/dropdown-menu';
import { Button } from '../../../../components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../../../../components/ui/alert-dialog';
import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';

const LoadingRow = () => (
  <TableRow>
    {[...Array(7)].map((_, index) => (
      <TableCell key={index}>
        <div className="w-20 h-4 bg-gray-200 animate-pulse"></div>
      </TableCell>
    ))}
  </TableRow>
);

const FetchingRow = () => (
  <TableRow className="border-none p-0">
    <TableCell colSpan={7} className="text-center">
      <div className="w-full">
        <Progress size="xs" isIndeterminate />
      </div>
    </TableCell>
  </TableRow>
);

const DataRow = ({ row, handleOpen }) => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();
  const { mutate } = useMutation({
    mutationFn: (id: string) => ApiService.deleteOcclusionCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['image-occlusions']
      });
      toast({
        title: 'Occlusion flashcard deleted',
        status: 'success'
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ['image-occlusions']
      });

      // Snapshot the previous value
      const previous = queryClient.getQueryData(['image-occlusions']);
      queryClient.setQueryData(
        ['image-occlusions'],
        (old: { data: { _id: string }[] }) => {
          return {
            ...old,
            data: old.data.filter((item) => item._id !== variables)
          };
        }
      );
      return { previous };
    }
  });
  return (
    <TableRow key={row._id} className="hover:bg-stone-100 cursor-pointer">
      <TableCell className="font-medium text-[#207DF7]">{row.title}</TableCell>
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
          ? Math.floor(row.percentages.passPercentage) + '%'
          : 0 + '%'}
      </TableCell>
      <TableCell className="text-right flex justify-end h-full items-center">
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <BsThreeDots />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleOpen(row._id)}
                >
                  Study
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xs">
                <p className="text-lg">Are you absolutely sure?</p>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-stone-500">
                This action cannot be undone. This will permanently delete the
                occlusion flashcard deck.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-error"
                onClick={() => {
                  mutate(row._id);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};

const initialState = {
  open: false,
  id: '',
  score: {
    right: 0,
    wrong: 0,
    notRemembered: 0
  },
  quizOver: false,
  showResults: false
};

const OcclusionFlashcardTab = () => {
  const [state, setState] = useState(initialState);

  const { data, isLoading, isFetching } = useQuery({
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
    },
    refetchOnWindowFocus: false
  });

  const handleOpen = useCallback((id: string) => {
    setState((pS) => ({
      ...pS,
      open: true,
      id
    }));
  }, []);

  const handleClose = useCallback(() => {
    setState((pS) => ({
      ...pS,
      open: false
    }));
  }, []);

  const setQuizOver = useCallback((input: boolean) => {
    setState((pS) => ({
      ...pS,
      quizOver: input
    }));
  }, []);

  const showResults = useCallback((input: boolean) => {
    setState((prevState) => ({
      ...prevState,
      showResults: input
    }));
  }, []);

  const setScore = useCallback((score) => {
    setState((prevState) => ({
      ...prevState,
      score
    }));
  }, []);

  const handleRestart = useCallback(() => {
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
  }, []);

  const handleReset = useCallback(() => {
    setState(initialState);
  }, []);

  function handleCloseResults() {
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
  }

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
          {isFetching && !isLoading ? <FetchingRow /> : null}
          {isLoading
            ? [...Array(7)].map((_, index) => <LoadingRow key={index} />)
            : null}
          {data?.list.map((row) => (
            <DataRow key={row._id} row={row} handleOpen={handleOpen} />
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
        resetForm={handleReset}
      />
      <OccResultsDialog
        id={state.id}
        open={state.showResults}
        score={state.score}
        close={handleCloseResults}
        restartStudySession={handleRestart}
        handleEditImage={() => null}
      />
    </div>
  );
};

export default OcclusionFlashcardTab;
