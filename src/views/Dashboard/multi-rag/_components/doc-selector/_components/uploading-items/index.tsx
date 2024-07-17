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
import useUserStore from '../../../../../../../state/userStore';

function UploadingItems({
  filesUploading,
  setUploadDocumentsId,
  setFilesUploading,
  setUploadDocumentsName,
  uploadedDocs,
  setUploadedDocs,
  state,
  setState
}) {
  const { user } = useUserStore();
  const file = filesUploading[0];
  const { mutate } = useMutation({
    mutationFn: (data: any) =>
      ApiService.multiDocBackgroundJobs(data).then((res) => res.json()),
    onSuccess: (data: any) => {
      console.log('Jobs', data);
      if (data.status === 'success') {
        setState('success');
        toast({
          position: 'top-right',
          title: `Documents Uploaded Successfully`,
          status: 'success'
        });
        const docNames = [...data.vectors.map((d) => d.collection_name)];
        setUploadDocumentsId([...data.vectors.map((d) => d.document_id)]);
        // reset this
        setUploadDocumentsName(docNames);
        setUploadedDocs(docNames);
        setFilesUploading((prevState) => {
          return prevState.map((job) =>
            job.jobId === file.jobId
              ? { ...job, processing: false, tables: [], jobId: '' }
              : job
          );
        });
      } else if (data.status === 'in_progress') {
        setState('in_progress');
        mutate({
          jobId: file.jobId,
          tables: file.tables,
          sid: user._id
        });
      } else if (data.status === 'error') {
        setState('error');
        setFilesUploading((prevState) => {
          return prevState.map((job) =>
            job.jobId === file.jobId
              ? { ...job, processing: false, uploading: false, jobId: '' }
              : job
          );
        });
        toast({
          position: 'top-right',
          title: `Something went wrong uploading your documents`,
          status: 'error',
          colorScheme: 'red',
          isClosable: true,
          description: 'Please try uploading again.'
        });
        //
      } else {
        //
      }
    }
  });

  const toast = useCustomToast();
  console.log(filesUploading[0]);

  useEffect(() => {
    if (file && file.jobId && file.jobId.length > 0 && file.tables.length > 0) {
      mutate({
        jobId: file.jobId,
        tables: file.tables,
        sid: user._id
      });
    }
  }, [file, mutate, user._id]);
  console.log('multiDocBackgroundJobs', filesUploading);
  return (
    <div className="uploading-documents flex w-full flex-col gap-[9px] justify-start mt-[1.8rem] max-h-[10rem] overflow-y-scroll no-scrollbar">
      {uploadedDocs.length > 0
        ? uploadedDocs.map((item) => {
            return (
              <Item
                item={item}
                file={file}
                setUploadDocumentsId={setUploadDocumentsId}
                setFilesUploading={setFilesUploading}
                state={state}
              />
            );
          })
        : filesUploading.map((file) => {
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
  return (
    <div
      className={cn(
        'w-full rounded-[10px] bg-white  min-h-[2.18rem] flex justify-between px-4 items-center',
        {
          'bg-orange-100': state === 'in_progress',
          'bg-red-300': state === 'error',
          'bg-green-200': state === 'success'
        }
      )}
    >
      <span className="text-xs font-bold">{item}</span>
      <div className="flex gap-2 items-center">
        {file.uploading ? (
          <ReloadIcon className="animate-spin text-[#207DF7]" />
        ) : state === 'error' ? (
          <div
            className="opacity-50 cursor-not-allowed"
            onClick={() => {
              setUploadDocumentsId((prevState) => {
                // return prevState.filter((item) => item !== docId);
                return prevState;
              });

              setFilesUploading((prevState) => {
                const files = [...prevState];
                return files.map((f) => ({
                  ...f,
                  tables: f.tables.filter((t) => t !== item)
                }));
              });
            }}
          >
            <Cross1Icon className="cursor-not-allowed" />
          </div>
        ) : null}
        {state === 'in_progress' && (
          <ComponentInstanceIcon className="animate-spin" />
        )}
      </div>
    </div>
  );
};

export default UploadingItems;
