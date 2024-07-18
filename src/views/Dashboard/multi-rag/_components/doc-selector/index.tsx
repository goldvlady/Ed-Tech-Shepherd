import { useState } from 'react';
import { cn } from '../../../../../library/utils';
import ChatHistory from './_components/chat-history';
import UploadingItems from './_components/uploading-items';
import Sections from './_components/sections';
import { useMutation } from '@tanstack/react-query';
import ApiService from '../../../../../services/ApiService';
import { MultiragDocument } from '../../../../../types';
import { useCustomToast } from '../../../../../components/CustomComponents/CustomToast/useCustomToast';

function DocSelector() {
  const [active, setActive] = useState(0);
  const [filesUploading, setFilesUploading] = useState<
    {
      jobId: string;
      uploading: boolean;
      tables: Array<string>;
      processing: boolean;
    }[]
  >([]);
  const [state, setState] = useState<'error' | 'in_progress' | 'success'>(
    'in_progress'
  );
  const [uploadedDocumentsId, setUploadDocumentsId] = useState([]);
  const [uploadedDocumentsName, setUploadDocumentsName] = useState<
    Array<string>
  >([]);
  const [uploadedDocs, setUploadedDocs] = useState<Array<string>>([]);
  const toast = useCustomToast();
  const { mutate } = useMutation({
    mutationKey: ['long-poll'],
    mutationFn: async (d: {
      jobId: string;
      tables: Array<string>;
      processing: boolean;
    }) => {
      const r = await ApiService.multiDocBackgroundJobs(d)
      if (!r.ok) {
          throw new Error("Bad Network request")
      }
      const  data: {
        vectors?: Array<MultiragDocument>;
        status: 'error' | 'in_progress' | 'success';
      } = await r.json()
     
      return data;
    },
    async onSuccess(data, { jobId }) {
      console.log('success', data);
      if (data.status === 'in_progress') {
        const data = Object.keys(filesUploading)
          .filter((key) => key !== 'uploading')
          .reduce((acc, key) => {
            acc[key] = filesUploading[key];
            return acc;
          }, {}) as {
          jobId: string;
          tables: Array<string>;
          processing: boolean;
        };
        console.log('Transformed D', data);
        mutate(data);
      } else if (data.status === 'success') {
        const d = [...filesUploading];
        const updatedFilesUploading = d.map((data) => ({
          ...data,
          uploading: data.jobId === jobId ? false : true,
          processing: true
        }));
        setFilesUploading(updatedFilesUploading);
        toast({
          position: 'bottom',
          title: `Documents Uploaded Successfully`,
          status: 'success'
        });
      } else {
        // if it fails i don't wanna indefinitely keep uploading
        const d = [...filesUploading];
        const updatedFilesUploading = d.map((data) => ({
          ...data,
          uploading: data.jobId === jobId ? false : true,
          processing: false
        }));
        setFilesUploading(updatedFilesUploading);
        toast({
          position: 'bottom',
          title: `Documents Upload Failed. Please retry.`,
          status: 'error'
        });
      }
    }
  });

  return (
    <div className="w-full h-full bg-[#F9F9FB] flex">
      <div className="h-full flex-1 bg-[#F9F9FB] flex justify-center items-center">
        <div className="w-[50rem] h-[34rem]">
          <header className="w-full h-[2.5rem] flex overflow-hidden">
            <HeaderItem
              title="Upload"
              isActive={active === 0}
              onClick={() => {
                uploadedDocumentsName.length > 0 && setUploadDocumentsName([]);
                setActive(0);
              }}
            />
            <HeaderItem
              title="Documents"
              isActive={active === 1}
              onClick={() => {
                uploadedDocumentsName.length > 0 && setUploadDocumentsName([]);
                setActive(1);
              }}
              className="mx-[-0.5rem]"
            />
          </header>
          <Sections
            active={active}
            setFilesUploading={setFilesUploading}
            uploadedDocumentsId={uploadedDocumentsId}
            filesUploading={filesUploading}
            uploadDocumentsName={uploadedDocumentsName}
            setUploadDocumentsName={setUploadDocumentsName}
            setUploadedDocs={setUploadedDocs}
            setState={setState}
          />
          <UploadingItems
            state={state}
            setState={setState}
            filesUploading={filesUploading}
            setUploadDocumentsId={setUploadDocumentsId}
            setUploadDocumentsName={setUploadDocumentsName}
            setFilesUploading={setFilesUploading}
            uploadedDocs={uploadedDocs}
            setUploadedDocs={setUploadedDocs}
          />
        </div>
      </div>
      <ChatHistory />
    </div>
  );
}

export const HeaderItem = ({
  title,
  isActive,
  onClick,
  className
}: {
  title: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className={cn(
        'py-[0.6rem] px-[1.75rem] bg-[#F6F6F6] border rounded-t-[0.93rem] flex justify-center items-center border-b-0 text-[0.87rem] font-normal will-change-auto transition-all z-0',
        {
          'bg-white text-[#207DF7] border-white relative z-[10] shadow-lg':
            isActive
        },
        className
      )}
    >
      {title}
    </div>
  );
};

export default DocSelector;
