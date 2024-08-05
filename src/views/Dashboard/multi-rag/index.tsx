import DocSelector from './_components/doc-selector';
import { Worker } from '@react-pdf-viewer/core';

function MultiRag() {
  return (
    <div className="w-full h-full bg-[#F9F9FB]">
      <Worker workerUrl={'/pdf.worker.min.js'}>
        <DocSelector />
      </Worker>
    </div>
  );
}

export default MultiRag;
