import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import BreadCrumb from './_components/breadcrumb';
import ThumbnailList from './_components/thumbnail-list';
import ApiService from '../../../../../services/ApiService';
import { useVectorsStore } from '../../../../../state/vectorsStore';
import { User } from '../../../../../types';

const DocsThumbnailList = ({
  conversationID,
  setSelectedDocumentID,
  selectedDocumentID,
  setFilesUploading,
  isUploading,
  user
}: {
  user: User;
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
  const addDocs = useVectorsStore((state) => state.addChatDocuments);
  useEffect(() => {
    ApiService.fetchMultiDocBasedOnConversationID(conversationID)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          addDocs(data.data);
          setFetchedDocuments(data.data);
          setSelectedDocumentID({
            id: data.data[0].document_id,
            name: data.data[0].collection_name
          });
        }
      });
  });

  return (
    <div className="w-[16.97rem] h-full pt-[0.62rem] px-[1.8rem] pr-[4.5rem]">
      <BreadCrumb conversationId={conversationID} />
      <ThumbnailList
        user={user}
        isUploading={isUploading}
        setFilesUploading={setFilesUploading}
        fetchedDocuments={fetchedDocuments}
        setSelectedDocumentID={setSelectedDocumentID}
        selectedDocumentID={selectedDocumentID}
      />
    </div>
  );
};

export default DocsThumbnailList;
