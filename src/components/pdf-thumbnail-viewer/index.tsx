import { pageThumbnailPlugin } from './page-thumbnail-plugin';
import { Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { memo } from 'react';

const PDFThumbnailViewer = ({ pdfURL }: { pdfURL: string }) => {
  // console.log('something', something)
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

export default memo(PDFThumbnailViewer, () => true);
