import { UploadIcon } from '@radix-ui/react-icons';
import { Button } from '../../../../../../../../components/ui/button';
import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import { cn } from '../../../../../../../../library/utils';

function UploadFiles() {
  const handleSubmit = () => {
    const files = acceptedFiles;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Setting up the endpoint with sid
    const sid = '64906166763aa2579e58c97d';
    const url = `http://localhost:8000/multirag/file-uploads/?sid=${sid}`;
    // Use fetch to POST data
    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  };
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    handleSubmit();
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
          {acceptedFiles.length > 0 ? (
            <ul>
              {acceptedFiles.map((file) => (
                <li>{file.name}</li>
              ))}
            </ul>
          ) : (
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
          )}
        </div>
      </div>
      <div className="w-full h-[4.5rem] pr-[3.1rem] py-[1rem] flex justify-end items-center">
        <Button className="" disabled>
          New Chat
        </Button>
      </div>
    </div>
  );
}

export default UploadFiles;
