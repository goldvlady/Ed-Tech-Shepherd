import { UploadIcon } from '@radix-ui/react-icons';
import { Button } from '../../../../../../../../components/ui/button';
import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import { cn } from '../../../../../../../../library/utils';
import ApiService from '../../../../../../../../services/ApiService';
import useUserStore from '../../../../../../../../state/userStore';

const isExactMatch = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

function UploadFiles({ setFilesUploading }) {
  const { user } = useUserStore();
  const handleSubmit = (inputFiles) => {
    setFilesUploading((pS) => {
      return [
        ...pS,
        {
          jobId: '',
          uploading: true,
          tables: inputFiles.map((file) => file.name)
        }
      ];
    });
    const files = inputFiles;
    console.log('inputFiles', files);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Setting up the endpoint with sid
    const sid = user._id;
    // Use fetch to POST data
    ApiService.uploadMultiDocFiles({
      studentId: sid,
      formData
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          console.log('uploadMultiDocFiles', data);
          //   {
          //     "status": "success",
          //     "message": "Successfully uploaded files to S3 and started background process",
          //     "uploaded_filenames": [
          //         "2208.07165.pdf",
          //         "asi-06-00106.pdf"
          //     ],
          //     "job_id": "job_Cwjuiazk1UzNaE"
          // }
          setFilesUploading((prevState) => {
            // find and replace object from  prevState if data.uploaded_filenames (array of string) === prevState.tables (array of string)
            const newState = prevState.map((state) => {
              if (isExactMatch(state.tables, data.uploaded_filenames)) {
                return {
                  ...state,
                  uploading: false,
                  jobId: data.job_id
                };
              } else {
                return state;
              }
            });
            return newState;
          });
        }
      })
      .catch((error) => console.error('Error:', error));
  };
  const onDrop = useCallback((acceptedFiles) => {
    handleSubmit(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf']
      }
    });

  console.log('acceptedFiles', acceptedFiles);

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="cc flex-1">
        <div
          className={cn(
            'w-[43rem] h-[15.6rem] bg-[#F9F9FB] rounded-[15px] cc cursor-pointer',
            {
              'border border-dashed border-black transition-all': isDragActive
            }
          )}
          {...getRootProps()}
        >
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input {...getInputProps()} />
          </form>
          <div className="w-[53%] h-[50%] cc flex-col">
            <div className="icon mx-auto">
              <UploadIcon className="w-[3.81rem] h-[3.81rem]" />
            </div>
            <div className="label mt-[5px]">
              <span className="text-lg font-medium text-[#212224]">
                Drag and Drop or{' '}
                <span className="text-[#207DF7]">Browse files</span>
              </span>
            </div>
            <p className="text-[0.93rem] whitespace-nowrap text-[#585F68] mt-[0.1rem]">
              Shepherd supports{' '}
              <span className="font-medium">.pdf, .txt, .doc</span> document
              formats
            </p>
          </div>
        </div>
      </div>
      {/* <div className="w-full h-[4.5rem] pr-[3.1rem] py-[1rem] flex justify-end items-center">
        <Button className="" disabled>
          New Chat
        </Button>
      </div> */}
    </div>
  );
}

export default UploadFiles;
