import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import BreadCrumb from './_components/breadcrumb';
import ThumbnailList from './_components/thumbnail-list';
import ApiService from '../../../../../services/ApiService';
import { useVectorsStore } from '../../../../../state/vectorsStore';
import { User } from '../../../../../types';
import { UseMutateFunction } from '@tanstack/react-query';

const DocsThumbnailList = ({
  conversationID,
  setSelectedDocumentID,
  selectedDocumentID,
  setFilesUploading,
  isUploading,
  user,
  refetch,
  uploadExistingDocs,
  multipleSelectedDocs,
  setMultipleSelectedDocs
}: {
  multipleSelectedDocs: any[];
  setMultipleSelectedDocs: any;
  user: User;
  refetch: boolean;
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
  conversationID: string;
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
}) => {

  const [fetchedDocuments, setFetchedDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const addDocs = useVectorsStore((state) => state.addChatDocuments);
  useEffect(() => {
    setLoadingDocuments(true);
    if (refetch) {
      ApiService.fetchMultiDocBasedOnConversationID(conversationID)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            setLoadingDocuments(false);
            addDocs(data.data);
            setFetchedDocuments(data.data);
            setSelectedDocumentID({
              id: data.data[0].document_id,
              name: data.data[0].collection_name
            });
          }
        });
      return;
    } else {
      ApiService.fetchMultiDocBasedOnConversationID(conversationID)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            setLoadingDocuments(false);
            addDocs(data.data);
            setFetchedDocuments(data.data);
            setSelectedDocumentID({
              id: data.data[0].document_id,
              name: data.data[0].collection_name
            });
          }
        });
    }
  }, [conversationID, refetch]);

  return (
    <div className="w-[16.97rem] h-full pt-[0.62rem] px-[1.8rem] pr-[4.5rem] relative">
      <BreadCrumb conversationId={conversationID} />
      <ThumbnailList
        user={user}
        isUploading={isUploading}
        conversationId={conversationID}
        uploadExistingDocs={uploadExistingDocs}
        setFilesUploading={setFilesUploading}
        fetchedDocuments={fetchedDocuments}
        setSelectedDocumentID={setSelectedDocumentID}
        selectedDocumentID={selectedDocumentID}
        multipleSelectedDocs={multipleSelectedDocs}
        setMultipleSelectedDocs={setMultipleSelectedDocs}
        loadingDocuments={loadingDocuments}
      />
    </div>
  );
};

export default DocsThumbnailList;
