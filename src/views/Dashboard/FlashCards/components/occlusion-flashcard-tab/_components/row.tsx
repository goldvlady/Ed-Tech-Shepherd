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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../../../components/ui/table';
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
      <TableCell className="text-center">-</TableCell>
      <TableCell className="text-center">
        {/* 20-March-2024 */}
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

export default DataRow;
