import { useEffect, useState } from 'react';
import BreadCrumb from './_components/breadcrumb';
import ThumbnailList from './_components/thumbnail-list';
import ApiService from '../../../../../services/ApiService';
import { useVectorsStore } from '../../../../../state/vectorsStore';

const DocsThumbnailList = ({
  conversationID,
  setSelectedDocumentID,
  selectedDocumentID
}: {
  conversationID: string;
  setSelectedDocumentID: ({ id, name }: { id: string; name: string }) => void;
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
  }, [conversationID]);

  return (
    <div className="w-[16.97rem] h-full pt-[0.62rem] px-[1.8rem] pr-[4.5rem]">
      <BreadCrumb conversationId={conversationID} />
      <ThumbnailList
        fetchedDocuments={fetchedDocuments}
        setSelectedDocumentID={setSelectedDocumentID}
        selectedDocumentID={selectedDocumentID}
      />
    </div>
  );
};

export default DocsThumbnailList;
