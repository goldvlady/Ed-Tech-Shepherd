import { cn } from '../../../../../../../library/utils';

function Sections({ active }: { active: number }) {
  return (
    <main className="w-full bg-white min-h-[25rem] rounded-b-[10px] rounded-tr-[10px] relative overflow-hidden">
      <Section active={active === 0}>
        <div className="w-full h-full bg-red-300">Upload</div>
      </Section>
      <Section active={active === 1}>
        <div className="w-full h-full bg-green-300">Documents</div>
      </Section>
      <Section active={active === 2}>
        <div className="w-full h-full bg-yellow-300">External Sources</div>
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
