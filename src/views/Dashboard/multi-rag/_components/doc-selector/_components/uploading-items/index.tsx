import { useEffect } from 'react';
import ApiService from '../../../../../../../services/ApiService';
import { ReloadIcon } from '@radix-ui/react-icons';

function UploadingItems({ filesUploading }) {
  console.log('multiDocBackgroundJobs', filesUploading);
  // useEffect(() => {
  //   ApiService.multiDocBackgroundJobs({
  //     jobId: filesUploaded.jobId,
  //     tables: filesUploaded.tables
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       // console.log('multiDocBackgroundJobs bg', data);
  //     });
  // }, [filesUploaded]);
  return (
    <div className="uploading-documents flex w-full flex-col gap-[9px] justify-start mt-[1.8rem] max-h-[10rem] overflow-y-scroll no-scrollbar">
      {filesUploading.uploading &&
        filesUploading.tables.map((item) => (
          <div className="w-full rounded-[10px] bg-white  min-h-[2.18rem] flex justify-between px-4 items-center">
            <span className="text-xs font-bold">{item}</span>
            <ReloadIcon className="animate-spin text-[#207DF7]" />
          </div>
        ))}
    </div>
  );
}

export default UploadingItems;
