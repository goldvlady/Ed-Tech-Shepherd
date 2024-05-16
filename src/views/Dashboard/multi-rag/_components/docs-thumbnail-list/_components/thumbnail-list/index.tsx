import { PlusIcon, UploadIcon } from 'lucide-react';
import Thumbnail from '../thumbnail';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure
} from '@chakra-ui/react';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../../../../../../../library/utils';
import useUserStore from '../../../../../../../state/userStore';
import { useCustomToast } from '../../../../../../../components/CustomComponents/CustomToast/useCustomToast';
import ApiService from '../../../../../../../services/ApiService';
import {
  MultiragDocument,
  User,
  multiragResponse
} from '../../../../../../../types';
import * as Tabs from '@radix-ui/react-tabs';
import { UseMutateFunction, useQueryClient } from '@tanstack/react-query';
import { DocItem } from '../../../doc-selector/_components/sections/select-documents';

function ThumbnailList({
  fetchedDocuments,
  setSelectedDocumentID,
  selectedDocumentID,
  setFilesUploading,
  user,
  isUploading,
  uploadExistingDocs,
  conversationId
}: {
  user: User;
  conversationId: string;
  uploadExistingDocs: UseMutateFunction<
    any,
    Error,
    {
      documentIds: Array<string>;
      conversationId: string;
    },
    unknown
  >;
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
  const qc = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [existingDocs, setExistingDocs] = useState<MultiragDocument[]>([]);
  const [selected, setSelected] = useState<Array<string>>([]);
  const handleSubmit = (acceptedFiles) => {
    console.log('uploaded files', acceptedFiles);
    setFilesUploading({
      uploading: 'uploading',
      jobId: '',
      tables: []
    });
    onClose();
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
            jobId: data.job_id,
            uploading: 'uploading',
            tables: data.uploaded_filenames
          });
        }
      })
      .catch((error) => {
        setFilesUploading({
          jobId: '',
          uploading: 'error',
          tables: []
        });
        onClose();
        console.error('Error:', error);
      });
  };
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    handleSubmit(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });
  useEffect(() => {
    qc.ensureQueryData({
      queryKey: ['processed-documents'],
      queryFn: async () => {
        const r: multiragResponse<Array<MultiragDocument>> =
          await ApiService.multiDocVectorDocs(user._id).then((res) =>
            res.json()
          );
        return r;
      }
    }).then((r) => {
      setExistingDocs(r.data);
    });
  }, [user._id, qc]);
  return (
    <div className="w-full h-full mt-[1.5rem]">
      <h5 className="text-[#585F68] text-[0.75rem] font-normal mb-[10px] flex justify-between">
        Sources{' '}
        <span
          onClick={() => onOpen()}
          style={{ pointerEvents: isUploading ? 'none' : 'auto' }}
          className={cn(
            'w-[1.25rem] h-[1.25rem] bg-[#207DF7] rounded-full flex items-center justify-center cursor-pointer',
            isUploading && 'bg-blue-300'
          )}
        >
          {isUploading ? (
            <Tooltip label="Adding documents in progress...">
              <PlusIcon className="text-white w-4" />
            </Tooltip>
          ) : (
            <PlusIcon className="text-white w-4" />
          )}
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
        <ModalContent className="!max-w-[80vw]">
          <ModalHeader>Add Documents</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="w-full">
            <Tabs.Root className="flex w-full flex-col" defaultValue="tab1">
              <Tabs.List
                className="shrink-0 flex border-b border-[#207DF7]"
                aria-label="Add documents to conversation"
              >
                <Tabs.Trigger
                  className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-blue-300 select-none first:rounded-tl-md last:rounded-tr-md  hover:text-blue-400 data-[state=active]:text-[#207DF7] data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px]  outline-none cursor-pointer"
                  value="tab1"
                >
                  Add Existing Documents
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-blue-300 select-none first:rounded-tl-md last:rounded-tr-md hover:text-blue-400 data-[state=active]:text-[#207DF7] data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px]  outline-none cursor-pointer"
                  value="tab2"
                >
                  Add New Documents
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content
                className="flex flex-col h-[50vh] justify-start gap-2"
                value="tab1"
              >
                <div className="grid grid-cols-3 my-4 gap-2 !h-11/12 overflow-y-scroll overflow-x-hidden">
                  {existingDocs.length > 0 &&
                    existingDocs.map((document) => {
                      return (
                        <DocItem
                          key={document.document_id}
                          selected={selected.some(
                            (e) => e === document.document_id
                          )}
                          layout={'grid'}
                          document={document}
                          onClick={() => {
                            if (
                              selected.some((e) => e === document.document_id)
                            ) {
                              setSelected((prevSelected) =>
                                prevSelected.filter(
                                  (item) => item !== document.document_id
                                )
                              );
                            } else {
                              setSelected((prevSelected) => [
                                ...prevSelected,
                                document.document_id
                              ]);
                            }
                          }}
                        />
                      );
                    })}
                </div>
                {existingDocs.length > 0 && (
                  <button
                    onClick={() => {
                      console.log('vars', {
                        documentIds: selected,
                        conversationId
                      });
                      uploadExistingDocs({
                        documentIds: selected,
                        conversationId
                      });
                      onClose();
                      toast({
                        position: 'top-right',
                        title: `Documents upload started`,
                        description: 'Hang on a second',
                        status: 'success'
                      });
                      setSelected([]);
                    }}
                    className="text-sm p-2 w-5/6 place-self-center rounded-md bg-[#207DF7] text-white hover:bg-blue-500"
                  >
                    Add documents
                  </button>
                )}
              </Tabs.Content>
              <Tabs.Content
                className="flex items-center h-[50vh] justify-center"
                value="tab2"
              >
                <div
                  className={cn('w-full  cursor-pointer', {
                    'border border-dashed border-black transition-all':
                      isDragActive
                  })}
                  {...getRootProps()}
                >
                  <form encType="multipart/form-data">
                    <input {...getInputProps()} />
                  </form>
                  <div className="cc flex-col">
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
                      <span className="font-medium">.pdf, .txt, .doc</span>{' '}
                      document formats
                    </p>
                  </div>
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ThumbnailList;
