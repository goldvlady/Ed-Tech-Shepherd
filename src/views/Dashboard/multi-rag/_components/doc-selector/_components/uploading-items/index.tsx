import { useEffect } from 'react';
import ApiService from '../../../../../../../services/ApiService';

function UploadingItems({ filesUploaded }) {
  console.log('multiDocBackgroundJobs', filesUploaded);
  useEffect(() => {
    ApiService.multiDocBackgroundJobs({
      jobId: filesUploaded.jobId,
      tables: filesUploaded.tables
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log('multiDocBackgroundJobs bg', data);
      });
  }, [filesUploaded]);
  return (
    <div className="uploading-documents flex w-full flex-col gap-[9px] justify-start mt-[1.8rem] max-h-[5rem] overflow-y-scroll no-scrollbar">
      <div className="w-full rounded-[10px] bg-white  min-h-[2.18rem]"></div>
      <div className="w-full rounded-[10px] bg-white  min-h-[2.18rem]"></div>
      <div className="w-full rounded-[10px] bg-white  min-h-[2.18rem]"></div>
    </div>
  );
}

export default UploadingItems;
