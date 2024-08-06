import { pageThumbnailPlugin } from './page-thumbnail-plugin';
import { Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { memo } from 'react';

import { usePDFBlobUrl } from '../../hooks/usePDFBlobURL';


const PDFThumbnailViewer = ({ pdfURL }: { pdfURL: string }) => {
  // console.log('something', something)
  const thumbnailPluginInstance = thumbnailPlugin();

  const { data: pdfBlobUrl, isLoading, error } = usePDFBlobUrl(pdfURL);

  const { Cover } = thumbnailPluginInstance;
  const pageThumbnailPluginInstance = pageThumbnailPlugin({
    PageThumbnail: <Cover getPageIndex={() => 0} />
  });

  if (isLoading) {
    return <div className="w-24 h-24 bg-gray-200 animate-pulse"></div>;
  }
  if (error) {
    return null;
  }
  return (
    <Viewer
      fileUrl={pdfBlobUrl}
      plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]}
    />
  );
};

export default memo(PDFThumbnailViewer, () => true);
