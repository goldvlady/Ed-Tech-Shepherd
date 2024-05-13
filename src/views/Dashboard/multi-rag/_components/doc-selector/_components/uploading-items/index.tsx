import { useEffect, useState } from 'react';
import ApiService from '../../../../../../../services/ApiService';
import {
  ComponentInstanceIcon,
  Cross1Icon,
  ReloadIcon
} from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { cn } from '../../../../../../../library/utils';
import { useCustomToast } from '../../../../../../../components/CustomComponents/CustomToast/useCustomToast';

function UploadingItems({ filesUploading, setUploadDocumentsId }) {
  console.log('multiDocBackgroundJobs', filesUploading);
  return (
    <div className="uploading-documents flex w-full flex-col gap-[9px] justify-start mt-[1.8rem] max-h-[10rem] overflow-y-scroll no-scrollbar">
      {filesUploading.map((file) => {
        return file.tables.map((item) => {
          return (
            <Item
              item={item}
              file={file}
              setUploadDocumentsId={setUploadDocumentsId}
            />
          );
        });
      })}
    </div>
  );
}

const Item = ({
  item,
  file,
  setUploadDocumentsId
}: {
  item: any;
  file: any;
  setUploadDocumentsId: any;
}) => {
  const toast = useCustomToast();
  console.log('Item', { item, file });
  const [state, setState] = useState<'error' | 'in_progress' | 'success'>();
  const { mutate } = useMutation({
    mutationFn: (data: any) =>
      ApiService.multiDocBackgroundJobs(data).then((res) => res.json())
  });

  useEffect(() => {
    let interval = null;

    if (file.jobId) {
      interval = setInterval(() => {
        mutate(
          {
            jobId: file.jobId,
            tables: [item]
          },
          {
            onSuccess: (data: any) => {
              console.log('Jobs', data);
              if (data.status === 'success') {
                setState('success');
                toast({
                  position: 'top-right',
                  title: `Documents Uploaded Successfully`,
                  status: 'success'
                });
                clearInterval(interval);
                setUploadDocumentsId((prevState) => {
                  if (!prevState.includes(data.vectors[0].document_id)) {
                    return [...prevState, data.vectors[0].document_id];
                  }
                  return prevState;
                });
              } else if (data.status === 'in_progress') {
                setState('in_progress');
              } else if (data.status === 'error') {
                setState('error');
                toast({
                  position: 'top-right',
                  title: `Documents Upload Failed. Please retry.`,
                  status: 'error'
                });
                clearInterval(interval);
              } else {
                clearInterval(interval);
              }
            }
          }
        );
      }, 5000);
    }

    return () => {
      return clearInterval(interval);
    };
  }, [file.jobId]);
  return (
    <div
      className={cn(
        'w-full rounded-[10px] bg-white  min-h-[2.18rem] flex justify-between px-4 items-center',
        {
          'bg-orange-100': state === 'in_progress',
          'bg-red-300': state === 'error'
        }
      )}
    >
      <span className="text-xs font-bold">{item}</span>
      <div className="flex gap-2 items-center">
        {file.uploading ? (
          <ReloadIcon className="animate-spin text-[#207DF7]" />
        ) : (
          <Cross1Icon className="cursor-pointer" />
        )}
        {state === 'in_progress' && (
          <ComponentInstanceIcon className="animate-spin" />
        )}
      </div>
    </div>
  );
};

export default UploadingItems;
