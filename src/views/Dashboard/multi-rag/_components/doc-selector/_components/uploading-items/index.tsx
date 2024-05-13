import { useEffect } from 'react';
import ApiService from '../../../../../../../services/ApiService';
import { Cross1Icon, ReloadIcon } from '@radix-ui/react-icons';

function UploadingItems({ filesUploading }) {
  console.log('multiDocBackgroundJobs', filesUploading);
  return (
    <div className="uploading-documents flex w-full flex-col gap-[9px] justify-start mt-[1.8rem] max-h-[10rem] overflow-y-scroll no-scrollbar">
      {filesUploading.map((file) => {
        return file.tables.map((item) => {
          return (
            <div className="w-full rounded-[10px] bg-white  min-h-[2.18rem] flex justify-between px-4 items-center">
              <span className="text-xs font-bold">{item}</span>
              {file.uploading ? (
                <ReloadIcon className="animate-spin text-[#207DF7]" />
              ) : (
                <Cross1Icon className="cursor-pointer" />
              )}
            </div>
          );
        });
      })}
    </div>
  );
}

export default UploadingItems;
