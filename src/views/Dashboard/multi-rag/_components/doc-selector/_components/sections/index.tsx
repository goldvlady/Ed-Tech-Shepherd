import { Dispatch, SetStateAction } from 'react';
import { cn } from '../../../../../../../library/utils';
import ExternalSources from './external-sources';
import SelectDocuments from './select-documents';
import UploadFiles from './upload-files';

function Sections({
  active,
  setFilesUploading,
  uploadedDocumentsId,
  filesUploading,
  uploadDocumentsName
}: {
  active: number;
  setFilesUploading: any;
  uploadedDocumentsId: any[];
  uploadDocumentsName: Array<string>;
  filesUploading: any[];
}) {
  return (
    <main className="w-full bg-white min-h-[25rem] rounded-b-[10px] rounded-tr-[10px] relative overflow-hidden">
      <Section active={active === 0}>
        <UploadFiles
          uploadDocumentsName={uploadDocumentsName}
          filesUploading={filesUploading}
          setFilesUploading={setFilesUploading}
          uploadedDocumentsId={uploadedDocumentsId}
        />
      </Section>
      <Section active={active === 1}>
        <SelectDocuments active={active === 1} />
      </Section>
      <Section active={active === 2}>
        <ExternalSources />
      </Section>
    </main>
  );
}

export const Section = ({
  children,
  active
}: {
  children: React.ReactNode;
  active: boolean;
}) => {
  return (
    <div
      className={cn(
        'w-full absolute h-full bg-white transition-opacity duration-300 ease-in-out will-change-auto z-0',
        active ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      {children}
    </div>
  );
};

export default Sections;
