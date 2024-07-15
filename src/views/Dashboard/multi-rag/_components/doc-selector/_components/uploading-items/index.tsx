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

function UploadingItems({
  filesUploading,
  setUploadDocumentsId,
  setFilesUploading,
  setUploadDocumentsName
}) {
  const [state, setState] = useState<'error' | 'in_progress' | 'success'>(
    'in_progress'
  );
  const { mutate } = useMutation({
    mutationFn: (data: any) =>
      ApiService.multiDocBackgroundJobs(data).then((res) => res.json())
  });
  const [docId, setDocID] = useState('');
  const toast = useCustomToast();
  const file = filesUploading[0];
  useEffect(() => {
    let interval = null;
    if (file.jobId && file.jobId.length > 0 && file.tables.length > 0) {
      interval = setInterval(() => {
        mutate(
          {
            jobId: file.jobId,
            tables: [file.tables]
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
                setUploadDocumentsId(...data.vectors.map((d) => d.document_id));
                setUploadDocumentsName(
                  ...data.vectors.map((d) => d.collection_name)
                );
                setFilesUploading((prevState) => {
                  return prevState.map((job) =>
                    job.jobId === file.jobId
                      ? { ...job, processing: false, tables: [], jobId: '' }
                      : job
                  );
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
      }, 2500);
    }

    return () => {
      return clearInterval(interval);
    };
  }, [file]);
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
              setFilesUploading={setFilesUploading}
              state={state}
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
  setUploadDocumentsId,
  setFilesUploading,
  state
}: {
  item: any;
  file: any;
  setUploadDocumentsId: any;
  setFilesUploading: any;
  state: 'error' | 'in_progress' | 'success';
}) => {
  console.log('Item', { item, file });

  const { mutate } = useMutation({
    mutationFn: (data: any) =>
      ApiService.multiDocBackgroundJobs(data).then((res) => res.json())
  });
  const [docId, setDocID] = useState('');

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
          <div
            className="opacity-50 cursor-not-allowed"
            onClick={() => {
              setUploadDocumentsId((prevState) => {
                console.log('Test 1', prevState, item, docId);
                // return prevState.filter((item) => item !== docId);
                return prevState;
              });
              setFilesUploading((prevState) => {
                console.log('Test 2', prevState);
                return prevState;
              });
            }}
          >
            <Cross1Icon className="cursor-not-allowed" />
          </div>
        )}
        {state === 'in_progress' && (
          <ComponentInstanceIcon className="animate-spin" />
        )}
      </div>
    </div>
  );
};

export default UploadingItems;
