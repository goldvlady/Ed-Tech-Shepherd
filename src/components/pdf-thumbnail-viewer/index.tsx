import { pageThumbnailPlugin } from './page-thumbnail-plugin';
import { Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { Worker } from '@react-pdf-viewer/core';

const PDFThumbnailViewer = ({ pdfURL }: { pdfURL: string }) => {
  // console.log('something', something)
  const thumbnailPluginInstance = thumbnailPlugin();
  const { Cover } = thumbnailPluginInstance;
  const pageThumbnailPluginInstance = pageThumbnailPlugin({
    PageThumbnail: <Cover getPageIndex={() => 0} />
  });

  return (
    <Worker workerUrl={'/pdf.worker.min.js'}>
      <Viewer
        fileUrl={pdfURL}
        plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]}
      />
    </Worker>
  );
};

export default PDFThumbnailViewer;
