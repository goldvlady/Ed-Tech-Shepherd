import { PlusIcon, UploadIcon } from 'lucide-react';
import Thumbnail from '../thumbnail';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../../../../../../../library/utils';
import useUserStore from '../../../../../../../state/userStore';
import { useCustomToast } from '../../../../../../../components/CustomComponents/CustomToast/useCustomToast';
import ApiService from '../../../../../../../services/ApiService';
import { User } from '../../../../../../../types';

function ThumbnailList({
  fetchedDocuments,
  setSelectedDocumentID,
  selectedDocumentID,
  setFilesUploading,
  user,
  isUploading
}: {
  user: User;
  isUploading: boolean;
  fetchedDocuments: any[];
  setSelectedDocumentID: ({ id, name }: { id: string; name: string }) => void;
  setFilesUploading: Dispatch<
    SetStateAction<{
      jobId: string;
      uploading: 'uploading' | 'success' | 'default' | 'error';
      tables: Array<string>;
    }>
  >;
  selectedDocumentID: {
    id: string;
    name: string;
  };
}) {
  const toast = useCustomToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSubmit = (acceptedFiles: Array<File>) => {
    setFilesUploading({
      uploading: 'uploading',
      jobId: '',
      tables: []
    });
    const files = acceptedFiles.map((file) => {
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
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          console.log('uploadMultiDocFiles', data);
          setFilesUploading({
            jobId: data.jobId,
            uploading: 'uploading',
            tables: data.uploaded_filenames
          });
        }
      })
      .catch((error) => console.error('Error:', error));
  };
  const onDrop = useCallback(() => {
    handleSubmit(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf']
      }
    });

  return (
    <div className="w-full h-full mt-[1.5rem]">
      <h5 className="text-[#585F68] text-[0.75rem] font-normal mb-[10px] flex justify-between">
        Sources{' '}
        <span
          onClick={() => onOpen()}
          style={{ pointerEvents: isUploading ? 'none' : 'auto' }}
          className="w-[1.25rem] h-[1.25rem] bg-[#207DF7] rounded-full flex items-center justify-center cursor-pointer"
        >
          <PlusIcon className="text-white w-4" />
        </span>
      </h5>
      <div className="thumbnail-list space-y-2 overflow-y-scroll h-full pb-40 no-scrollbar">
        {fetchedDocuments.map((item: any) => (
          <Thumbnail
            selectedToPreview={selectedDocumentID.id === item.document_id}
            key={item.document_id}
            data={item}
            onClick={() =>
              setSelectedDocumentID({
                id: item.document_id,
                name: item.collection_name
              })
            }
          />
        ))}
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Documents</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="w-full flex items-center justify-center">
            <div
              className={cn(
                'w-full flex flex-1 items-center-justify-center cursor-pointer',
                {
                  'border border-dashed border-black transition-all':
                    isDragActive
                }
              )}
              {...getRootProps()}
            >
              <form
                onSubmit={() => handleSubmit(acceptedFiles)}
                encType="multipart/form-data"
              >
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ThumbnailList;
