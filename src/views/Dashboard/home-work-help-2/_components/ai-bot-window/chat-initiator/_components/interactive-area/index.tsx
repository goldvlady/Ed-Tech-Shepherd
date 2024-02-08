import { Tag } from '@chakra-ui/tag';
import Input from './_components/input';
import Chip from './_components/chip';
import RecentItemChip from './_components/recent-chip';
import useUserStore from '../../../../../../../../state/userStore';

function InteractiveArea() {
  return (
    <div className="w-[80%] mx-auto max-w-[600px] mb-24 relative">
      <WelcomeBackText />
      <Input />
      <div className="flex gap-4 mt-4">
        {['Math', 'Science', 'English', 'History'].map((subject) => (
          <Chip key={subject} title={subject} />
        ))}
      </div>
      <div className="w-full absolute max-h-[200px] top-[150%]">
        <p className="text-[#585F68] font-normal text-xs mb-4">RECENTS</p>
        <div className="grid grid-cols-2 gap-5">
          <RecentItemChip title="Socrat plant biology session" />
          <RecentItemChip title="Socrat plant biology session physics" />
          <RecentItemChip title="Socrat plant biology session" />
          <RecentItemChip title="Socrat plant biology session" />
        </div>
      </div>
    </div>
  );
}

const WelcomeBackText = () => {
  const { name } = useUserStore((state) => state.user);
  return (
    <h3 className="text-black text-2xl w-full absolute top-[-4rem] text-center font-semibold">
      Welcome Back, {name.first}
    </h3>
  );
};

export default InteractiveArea;
