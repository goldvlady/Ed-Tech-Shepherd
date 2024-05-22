import { CheckIcon } from 'lucide-react';
import { cn } from '../../../../../../../library/utils';
import PDFThumbnailViewer from '../../../../../../../components/pdf-thumbnail-viewer';

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    const extension = text.substring(text.lastIndexOf('.'));
    return text.slice(0, maxLength - extension.length - 3) + '...' + extension;
  } else {
    return text;
  }
}

function Thumbnail({
  selectedToPreview,
  selectedForContext,
  setMultipleSelectedDocsForContext,
  data,
  onClick
}: {
  setMultipleSelectedDocsForContext: any;
  selectedForContext: boolean;
  selectedToPreview: boolean;
  data: any;
  onClick: () => void;
}) {
  console.log('Thumbnail', data);
  return (
    <div
      className={cn(
        'border h-[10.31rem] w-[10.31rem] rounded-[10px] bg-white relative p-[0.68rem] flex items-end transition-all cursor-pointer',
        {
          'bg-[#EBF4FE]': selectedForContext,
          'shadow-xl border-blue-400': selectedToPreview
        }
      )}
    >
      {/* <div className="w-[1.87rem] h-[1.87rem] absolute rounded-full bg-[#F9F9FB] top-0 right-0 m-[0.68rem] flex justify-center items-center cursor-pointer z-10">
        <DotsHorizontalIcon />
      </div> */}
      <PdfFirstPageImage data={data} onClick={onClick} />
      <div className="flex items-center gap-1 justify-between w-full z-10 backdrop-blur-sm pt-[0.5rem]">
        <p className="text-[#585F68] text-[10px] whitespace-nowrap">
          {truncateText(data.collection_name, 25)}
        </p>
        <div
          role="button"
          onClick={() => {
            setMultipleSelectedDocsForContext((prevState) => {
              const exists = prevState.some(
                (doc) => doc.id === data.document_id
              );
              if (exists) {
                // Remove the existing document
                return prevState.filter((doc) => doc.id !== data.document_id);
              } else {
                // Add the new document
                return [
                  ...prevState,
                  {
                    id: data.document_id,
                    name: data.collection_name
                  }
                ];
              }
            });
          }}
          className={cn(
            'w-[0.87rem] h-[0.87rem] rounded-[3px] bg-[#F9F9FB] flex justify-center items-center p-[2px] transition',
            {
              'bg-[#207DF7]': selectedForContext
            }
          )}
        >
          <CheckIcon className="text-white" />
        </div>
      </div>
    </div>
  );
}

const PdfFirstPageImage = ({
  data,
  onClick
}: {
  data: any;
  onClick: () => void;
}) => {
  const pdfURL = `https://shepherd-document-upload.s3.us-east-2.amazonaws.com/${data.collection_name}`;
  return (
    <div
      className="absolute w-full h-full pt-[1.36rem] pr-[1.36rem]"
      role="button"
      onClick={onClick}
    >
      <div className="w-full h-full pointer-events-none">
        <PDFThumbnailViewer pdfURL={pdfURL} />
      </div>
    </div>
  );
};

export default Thumbnail;
