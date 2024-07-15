import { ReloadIcon, UploadIcon } from '@radix-ui/react-icons';
import { Button } from '../../../../../../../../components/ui/button';
import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import { cn } from '../../../../../../../../library/utils';
import ApiService from '../../../../../../../../services/ApiService';
import useUserStore from '../../../../../../../../state/userStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useCustomToast } from '../../../../../../../../components/CustomComponents/CustomToast/useCustomToast';
import { Loader } from 'lucide-react';

const isExactMatch = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

function UploadFiles({
  setFilesUploading,
  uploadedDocumentsId,
  filesUploading,
  uploadDocumentsName
}) {
  console.log('uploadedDocumentsId', filesUploading);
  const { user } = useUserStore();
  const navigate = useNavigate();
  const toast = useCustomToast();
  const handleSubmit = (inputFiles) => {
    setFilesUploading((pS) => {
      return [
        ...pS,
        {
          jobId: '',
          uploading: true,
          processing: false,
          tables: inputFiles.map((file) => {
            const nameParts = file.name.split('.');
            const ext = nameParts.pop();
            const nameWithoutExt = nameParts.join('.');
            return nameWithoutExt.length > 50 - ext.length - 1
              ? nameWithoutExt.slice(0, 50 - ext.length - 1) + '.' + ext
              : file.name;
          })
        }
      ];
    });
    const files = inputFiles.map((file) => {
      const nameParts = file.name.split('.');
      const ext = nameParts.pop();
      const nameWithoutExt = nameParts.join('.');
      if (nameWithoutExt.length > 50 - ext.length - 1) {
        const truncatedName =
          nameWithoutExt.slice(0, 50 - ext.length - 1) + '.' + ext;
        return new File([file], truncatedName, { type: file.type });
      }
      return file;
    });
    console.log('inputFiles', files);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    } // Setting up the endpoint with sid
    toast({
      position: 'top-right',
      title: `Documents upload started`,
      description: 'Hang on a second',
      status: 'success'
    });
    const sid = user._id;
    // Use fetch to POST data
    ApiService.uploadMultiDocFiles({
      studentId: sid,
      formData
    })
      .then((response) => {
        if (response.status === 404) {
          toast({
            title: 'Duplicate Documents Detected',
            description: 'Document(s) has been uploaded before'
          });
          throw new Error('Unable to successfully upload files');
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 'success') {
          console.log('uploadMultiDocFiles', data);
          setFilesUploading((prevState) => {
            // find and replace object from  prevState if data.uploaded_filenames (array of string) === prevState.tables (array of string)
            const newState = prevState.map((state) => {
              if (isExactMatch(state.tables, data.uploaded_filenames)) {
                return {
                  ...state,
                  uploading: false,
                  processing: true,
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
  const { mutate, isPending: isGeneratingConvID } = useMutation({
    mutationFn: (data: {
      referenceId: string;
      referenceDocIds: Array<string>;
      language: 'English';
    }) => ApiService.multiDocConversationStarter(data).then((res) => res.json())
  });

  const { mutate: mutateChatName, isPending } = useMutation({
    mutationFn: (data: any) =>
      ApiService.multiDocCreateTitle(data).then((res) => res.json())
  });

  console.log('acceptedFiles', acceptedFiles);

  const startConversation = () => {
    mutate(
      {
        referenceId: user._id,
        referenceDocIds: uploadedDocumentsId,
        language: 'English'
      },
      {
        onSuccess(data) {
          const selectedDocumentsName = uploadDocumentsName;
          mutateChatName(
            {
              docNames: selectedDocumentsName,
              conversationId: data.data
            },
            {
              onSuccess: (chatName) => {
                if (chatName.status === 'success') {
                  navigate(`/dashboard/doc-chat/${data.data}`, {
                    replace: true
                  });
                }
              }
            }
          );
        }
      }
    );
  };

  const anyProcessingTrue = filesUploading.some((file) => file.processing);

  return (
    <div className="w-full h-full bg-white flex flex-col relative">
      <Button
        className="absolute top-0 right-0 mt-[1.6rem] mr-[2.8rem]"
        onClick={startConversation}
        disabled={isGeneratingConvID || isPending || anyProcessingTrue}
      >
        {anyProcessingTrue && (
          <div className="absolute left-[-196px] text-black flex items-center gap-2">
            <Loader className="animate-spin" />{' '}
            <span>Processing Documents</span>
          </div>
        )}
        {isPending || isGeneratingConvID ? (
          <ReloadIcon className="mr-2 animate-spin" />
        ) : null}
        Start Chat
      </Button>
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
