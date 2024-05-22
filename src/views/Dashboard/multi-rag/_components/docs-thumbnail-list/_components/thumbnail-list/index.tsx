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
import {
  Dialog,
  DialogContent
} from '../../../../../../../components/ui/dialog';
import { HeaderItem } from '../../../doc-selector';
import Sections, { Section } from '../../../doc-selector/_components/sections';
import { Button } from '../../../../../../../components/ui/button';

function ThumbnailList({
  fetchedDocuments,
  setSelectedDocumentID,
  selectedDocumentID,
  setFilesUploading,
  user,
  isUploading,
  uploadExistingDocs,
  conversationId,
  multipleSelectedDocs,
  setMultipleSelectedDocs
}: {
  user: User;
  conversationId: string;
  multipleSelectedDocs: any[];
  setMultipleSelectedDocs: any;
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
  const [addNewDocumentDialogOpen, setAddNewDocumentDialogOpen] =
    useState(false);
  const [existingDocs, setExistingDocs] = useState<MultiragDocument[]>([]);
  const [selected, setSelected] = useState<Array<string>>([]);

  const handleAddNewDocOpen = () => {
    setAddNewDocumentDialogOpen(true);
  };

  const handleAddNewDocClose = () => {
    return setAddNewDocumentDialogOpen(false);
  };

  const handleSubmit = (acceptedFiles) => {
    console.log('uploaded files', acceptedFiles);
    setFilesUploading({
      uploading: 'uploading',
      jobId: '',
      tables: []
    });
    handleAddNewDocClose();
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
    const sid = user?._id;
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
        handleAddNewDocClose();
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
    if (user) {
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
    }
  }, [user, qc]);
  return (
    <div className="w-full h-full mt-[1.5rem]">
      <h5 className="text-[#585F68] text-[0.75rem] font-normal mb-[10px] flex justify-between">
        Sources{' '}
        <span
          onClick={() => handleAddNewDocOpen()}
          style={{ pointerEvents: isUploading ? 'none' : 'auto' }}
          className={cn(
            'w-[1.25rem] h-[1.25rem] bg-[#207DF7] rounded-full flex items-center justify-center cursor-pointer',
            isUploading && 'bg-blue-300'
          )}
        >
          {isUploading ? (
            <Tooltip label="Adding documents in progress...">
              <PlusIcon className="text-white w-[0.8rem]" />
            </Tooltip>
          ) : (
            <PlusIcon className="text-white w-[0.8rem]" />
          )}
        </span>
      </h5>
      <div className="thumbnail-list space-y-2 overflow-y-scroll h-full pb-40 no-scrollbar overflow-x-hidden">
        {fetchedDocuments.map((item: any) => (
          <Thumbnail
            // multipleSelectedDocs
            selectedForContext={multipleSelectedDocs.some(
              (doc) => doc.id === item.document_id
            )}
            setMultipleSelectedDocsForContext={setMultipleSelectedDocs}
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
      <AddNewDoc
        open={addNewDocumentDialogOpen}
        existingDocs={existingDocs}
        selected={selected}
        setSelected={setSelected}
        handleAddNewDocClose={handleAddNewDocClose}
        conversationId={conversationId}
        uploadExistingDocs={uploadExistingDocs}
        getInputProps={getInputProps}
        getRootProps={getRootProps}
        isDragActive={isDragActive}
      />
    </div>
  );
}

const AddNewDoc = ({
  open,
  existingDocs,
  selected,
  setSelected,
  handleAddNewDocClose,
  uploadExistingDocs,
  conversationId,
  getRootProps,
  getInputProps,
  isDragActive
}) => {
  const [active, setActive] = useState(0);
  const toast = useCustomToast();

  const handleUpload = () => {
    uploadExistingDocs({
      documentIds: selected,
      conversationId
    });
    handleAddNewDocClose();
    toast({
      position: 'top-right',
      title: `Documents upload started`,
      description: 'Hang on a second',
      status: 'success'
    });
    setSelected([]);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        handleAddNewDocClose(value);
      }}
    >
      <DialogContent className="bg-transparent border-none shadow-none flex justify-center max-w-4xl">
        <div className="w-[50rem] h-[34rem]">
          <header className="w-full h-[2.5rem] flex overflow-hidden">
            <HeaderItem
              title="Add Existing Documents"
              isActive={active === 0}
              onClick={() => setActive(0)}
            />
            <HeaderItem
              title="Add New Documents"
              isActive={active === 1}
              onClick={() => setActive(1)}
              className="mx-[-0.5rem]"
            />
          </header>
          <main className="w-full bg-white min-h-[25rem] rounded-b-[10px] rounded-tr-[10px] relative overflow-hidden">
            <Section active={active === 0}>
              <ExistingDocTab
                existingDocs={existingDocs}
                selected={selected}
                setSelected={setSelected}
                handleUpload={handleUpload}
              />
            </Section>
            <Section active={active === 1}>
              <UploadDocTab
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isDragActive={isDragActive}
              />
            </Section>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ExistingDocTab = ({
  existingDocs,
  selected,
  setSelected,
  handleUpload
}) => {
  if (existingDocs.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <div className="p-2 w-full flex justify-end">
        <Button disabled={selected.length <= 0} onClick={handleUpload}>
          Add documents
        </Button>
      </div>
      <main
        className={cn(
          'w-full h-full py-[0.9rem] transition-all overflow-scroll grid grid-cols-4 gap-4 px-[2.8rem] no-scrollbar'
        )}
      >
        {existingDocs.map((document) => {
          return (
            <DocItem
              key={document.document_id}
              selected={selected.some((e) => e === document.document_id)}
              layout={'grid'}
              document={document}
              onClick={() => {
                if (selected.some((e) => e === document.document_id)) {
                  setSelected((prevSelected) =>
                    prevSelected.filter((item) => item !== document.document_id)
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
      </main>
    </div>
  );
};

const UploadDocTab = ({ getRootProps, getInputProps, isDragActive }) => {
  return (
    <div className="flex justify-center items-center w-full h-full px-6">
      <div
        className={cn('w-full  cursor-pointer p-8 rounded-md', {
          'border border-dashed border-black transition-all': isDragActive
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
            <span className="font-medium">.pdf, .txt, .doc</span> document
            formats
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailList;
