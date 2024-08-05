import { useQuery } from '@tanstack/react-query';
import { loadPDF } from '../helpers/indexedDBUtils';

export const usePDFBlobUrl = (pdfUrl: string) => {
  return useQuery({
    queryKey: ['pdfBlobUrl', pdfUrl],
    queryFn: () => loadPDF(pdfUrl)
  });
};
