import { PlusIcon } from 'lucide-react';
import Thumbnail from '../thumbnail';

function ThumbnailList({
  fetchedDocuments,
  setSelectedDocumentID,
  selectedDocumentID
}: {
  fetchedDocuments: any[];
  setSelectedDocumentID: ({ id, name }: { id: string; name: string }) => void;
  selectedDocumentID: {
    id: string;
    name: string;
  };
}) {
  return (
    <div className="w-full h-full mt-[1.5rem]">
      <h5 className="text-[#585F68] text-[0.75rem] font-normal mb-[10px] flex justify-between">
        Sources{' '}
        <span className="w-[1.25rem] h-[1.25rem] bg-[#207DF7] rounded-full flex items-center justify-center cursor-pointer">
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
    </div>
  );
}

export default ThumbnailList;
