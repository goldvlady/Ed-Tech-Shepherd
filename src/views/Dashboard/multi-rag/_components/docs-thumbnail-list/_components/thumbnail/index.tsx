import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../../../../../library/utils';
import { Worker } from '@react-pdf-viewer/core';
import {
  Viewer,
  SpecialZoomLevel,
  ViewMode,
  ScrollMode
} from '@react-pdf-viewer/core';

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
  data,
  onClick
}: {
  selectedToPreview: boolean;
  data: any;
  onClick: () => void;
}) {
  console.log('Thumbnail', data);
  const [selected, setSelected] = useState(false);
  return (
    <div
      className={cn(
        'border h-[10.31rem] w-[10.31rem] rounded-[10px] bg-white relative p-[0.68rem] flex items-end transition-all cursor-pointer',
        {
          'bg-[#EBF4FE]': selected,
          'shadow-xl border-blue-400': selectedToPreview
        }
      )}
      onClick={onClick}
    >
      {/* <div className="w-[1.87rem] h-[1.87rem] absolute rounded-full bg-[#F9F9FB] top-0 right-0 m-[0.68rem] flex justify-center items-center cursor-pointer z-10">
        <DotsHorizontalIcon />
      </div> */}
      <PdfFirstPageImage data={data} />
      <div className="flex items-center gap-1 justify-between w-full z-10 backdrop-blur-sm pt-[0.5rem]">
        <p className="text-[#585F68] text-[10px] whitespace-nowrap">
          {truncateText(data.collection_name, 25)}
        </p>
        {/* <div
          role="button"
          onClick={() => {
            setSelected(!selected);
          }}
          className={cn(
            'w-[0.87rem] h-[0.87rem] rounded-[3px] bg-[#F9F9FB] flex justify-center items-center p-[2px] transition',
            {
              'bg-[#207DF7]': selected
            }
          )}
        >
          <CheckIcon className="text-white" />
        </div> */}
      </div>
    </div>
  );
}

const PdfFirstPageImage = ({ data }: { data: any }) => {
  const pdfURL = `https://shepherd-document-upload.s3.us-east-2.amazonaws.com/${data.collection_name}`;
  return (
    <div className="pointer-events-none absolute w-full h-full pt-[1.36rem] pr-[1.36rem]">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfURL}
          defaultScale={SpecialZoomLevel.PageFit}
          viewMode={ViewMode.SinglePage}
          scrollMode={ScrollMode.Page}
        />
      </Worker>
    </div>
  );
};

export default Thumbnail;
