import { cn } from '../../../../../../../library/utils';
import ExternalSources from './external-sources';
import SelectDocuments from './select-documents';
import UploadFiles from './upload-files';

function Sections({ active }: { active: number }) {
  return (
    <main className="w-full bg-white min-h-[25rem] rounded-b-[10px] rounded-tr-[10px] relative overflow-hidden">
      <Section active={active === 0}>
        <UploadFiles />
      </Section>
      <Section active={active === 1}>
        <SelectDocuments />
      </Section>
      <Section active={active === 2}>
        <ExternalSources />
      </Section>
    </main>
  );
}

const Section = ({
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
