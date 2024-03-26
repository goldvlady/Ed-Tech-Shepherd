import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '../../../../../../components/CustomComponents/CustomToast/useCustomToast';
import ApiService from '../../../../../../services/ApiService';
import { BsThreeDots } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../../../components/ui/dropdown-menu';
import { TableCell, TableRow } from '../../../../../../components/ui/table';
import { format } from 'date-fns';
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
} from '../../../../../../components/ui/alert-dialog';
import { Button } from '../../../../../../components/ui/button';
import { Badge } from '../../../../../../components/ui/badge';

const DataRow = ({ row, handleOpen, page, limit }) => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();
  const { mutate } = useMutation({
    mutationFn: (id: string) => ApiService.deleteOcclusionCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['image-occlusions', page, limit]
      });
      toast({
        title: 'Occlusion flashcard deleted',
        status: 'success'
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ['image-occlusions', page, limit]
      });

      // Snapshot the previous value
      const previous = queryClient.getQueryData([
        'image-occlusions',
        page,
        limit
      ]);
      queryClient.setQueryData(
        ['image-occlusions', page, limit],
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

  const colorRanges = [
    { max: 100, min: 85.1, color: '#4CAF50', backgroundColor: '#EDF7EE' },
    { max: 85, min: 60, color: '#FB8441', backgroundColor: '#FFEFE6' },
    { max: 59.9, min: 0, color: '#F53535', backgroundColor: '#FEECEC' }
  ];

  function getColorAndBackground(percentage: number) {
    if (isNaN(percentage) || !percentage)
      return {
        color: colorRanges[2].color,
        backgroundColor: colorRanges[2].backgroundColor
      };
    for (let range of colorRanges) {
      if (percentage <= range.max && percentage >= range.min) {
        return { color: range.color, backgroundColor: range.backgroundColor };
      }
    }
    return {
      color: colorRanges[2].color,
      backgroundColor: colorRanges[2].backgroundColor
    };
  }

  return (
    <TableRow key={row._id} className="hover:bg-stone-100 cursor-pointer">
      <TableCell
        className="font-medium text-[#207DF7] cursor-pointer hover:font-semibold text-center"
        onClick={() => handleOpen(row._id)}
      >
        {row.title}
      </TableCell>
      <TableCell className="text-center">{row.labels.length}</TableCell>
      <TableCell className="text-center">
        <div className="flex flex-wrap gap-2">
          {row.tags.map((tag) => (
            <Badge className="bg-[hsl(240 4.8% 95.9%)] flex items-center justify-center w-fit">
              <div className="w-5 h-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-tag"
                >
                  <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                  <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                </svg>
              </div>
              <p>{tag}</p>
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-center">
        {format(new Date(row.createdAt), 'd-MMMM-yyyy')}
      </TableCell>
      <TableCell className="text-center">
        {format(new Date(row.updatedAt), 'd-MMMM-yyyy')}
      </TableCell>
      <TableCell className="text-center">
        {row.percentages.passPercentage ? (
          <div
            className={`w-fit px-2 py-0.5 rounded bg-[${
              getColorAndBackground(row.percentages.passPercentage)
                .backgroundColor
            }] text-[${
              getColorAndBackground(row.percentages.passPercentage).color
            }]`}
          >
            {row.percentages.passPercentage
              ? Math.floor(row.percentages.passPercentage) + '%'
              : 0 + '%'}
          </div>
        ) : (
          // Not attempted
          <div className="w-fit px-2 py-0.5 rounded bg-[#F3F5F6] text-[#969CA6]">
            Not attempted
          </div>
        )}
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
                  <div className="border rounded-full shadow w-6 h-6 flex items-center justify-center mr-2">
                    <svg
                      width="10"
                      height="14"
                      viewBox="0 0 10 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5835 5.83301H9.66683L4.41683 13.4163V8.16634H0.333496L5.5835 0.583008V5.83301Z"
                        fill="#6E7682"
                      />
                    </svg>
                  </div>
                  Study
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                  <div className="border rounded-full shadow w-6 h-6 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="12"
                      height="12"
                    >
                      <path
                        fillRule="evenodd"
                        fill="#6E7682"
                        d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Schedule
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                    <div className="border rounded-full shadow w-6 h-6 flex items-center justify-center mr-2">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.08317 2.50033V0.750326C3.08317 0.428162 3.34434 0.166992 3.6665 0.166992H8.33317C8.65535 0.166992 8.9165 0.428162 8.9165 0.750326V2.50033H11.8332V3.66699H10.6665V11.2503C10.6665 11.5725 10.4053 11.8337 10.0832 11.8337H1.9165C1.59434 11.8337 1.33317 11.5725 1.33317 11.2503V3.66699H0.166504V2.50033H3.08317ZM4.24984 1.33366V2.50033H7.74984V1.33366H4.24984Z"
                          fill="#F53535"
                        />
                      </svg>
                    </div>
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

export default DataRow;
