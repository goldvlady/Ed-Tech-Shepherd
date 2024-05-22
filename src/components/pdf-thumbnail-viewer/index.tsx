import { pageThumbnailPlugin } from './page-thumbnail-plugin';
import { Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';

const PDFThumbnailViewer = ({ pdfURL }: { pdfURL: string }) => {
  const thumbnailPluginInstance = thumbnailPlugin();
  const { Cover } = thumbnailPluginInstance;
  const pageThumbnailPluginInstance = pageThumbnailPlugin({
    PageThumbnail: <Cover getPageIndex={() => 0} />
  });

  return (
    <Viewer
      fileUrl={pdfURL}
      plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]}
    />
  );
};

export default PDFThumbnailViewer;
