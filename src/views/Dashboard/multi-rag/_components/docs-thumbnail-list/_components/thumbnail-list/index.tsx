import Thumbnail from '../thumbnail';

function ThumbnailList({ fetchedDocuments }: { fetchedDocuments: any[] }) {
  return (
    <div className="w-full h-full mt-[1.5rem]">
      <h5 className="text-[#585F68] text-[0.75rem] font-normal mb-[10px]">
        Sources
      </h5>
      <div className="thumbnail-list space-y-2 overflow-y-scroll h-full pb-40 no-scrollbar">
        {fetchedDocuments.map((item: any) => (
          <Thumbnail key={item.document_id} data={item} />
        ))}
      </div>
    </div>
  );
}

export default ThumbnailList;
