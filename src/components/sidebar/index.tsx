import { Link } from 'react-router-dom';
import Logo from '../Logo';
import {
  FiBarChart2,
  FiBriefcase,
  FiChevronDown,
  FiHome,
  FiMenu
} from 'react-icons/fi';
import { cn } from '../../library/utils';
import { BsChatLeftDots, BsPin, BsBook } from 'react-icons/bs';
import { CgNotes } from 'react-icons/cg';
import { TbCards } from 'react-icons/tb';
import { LuBot, LuFileQuestion } from 'react-icons/lu';
import { PiClipboardTextLight } from 'react-icons/pi';
import BarnImg from '../../assets/Barn.svg';
import { MdOutlineFeedback } from 'react-icons/md';
import { RiChat3Line } from 'react-icons/ri';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion';

const listItems = [
  { name: 'Library', icon: BsBook, path: '/dashboard/library', coming: false },
  { name: 'Notes', icon: CgNotes, path: '/dashboard/notes', coming: false },
  {
    name: 'Flashcards',
    icon: TbCards,
    path: '/dashboard/flashcards',
    requiresSubscription: true,
    coming: false
  },
  {
    name: 'Quizzes',
    icon: LuFileQuestion,
    path: '/dashboard/quizzes',
    requiresSubscription: true,
    coming: false
  },
  {
    name: 'Study Plans',
    icon: PiClipboardTextLight,
    path: '',
    requiresSubscription: true,
    coming: true
  }
];

function Sidebar() {
  return (
    <div className="w-full py-[1.5rem] px-[1rem]">
      <div className="w-[7.18rem] h-[2.9rem]">
        <Logo />
      </div>
      <div className="mt-[2.06rem] w-full">
        <SidebarItem title="Home" active={true} icon={<FiHome />} link="/" />
      </div>
      <hr className="h-1 mt-[.56rem] mb-[1.1rem]" />
      <div className="w-full flex flex-col gap-[10px]">
        <Accordion type="single" collapsible className="w-full p-0">
          <AccordionItem
            value="item-1"
            className="p-0 [&_button]:p-0 [&_a]:no-underline [&_a]:hover:no-underline border-none hover:no-underline"
          >
            <AccordionTrigger>
              <SidebarItem
                title="AI Chat"
                active={false}
                icon={<RiChat3Line />}
              />
            </AccordionTrigger>
            <AccordionContent className="px-[1rem] flex flex-col pb-0">
              <SidebarItem
                title="Doc chat"
                active={false}
                icon={null}
                link="/dashboard/doc-chat"
              />
              <SidebarItem
                title="AI Tutor"
                active={false}
                icon={null}
                link="/dashboard/ai-tutor"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {listItems.map((item) => (
          <SidebarItem
            key={item.name}
            title={item.name}
            icon={<item.icon />}
            active={false}
            link={item.path}
            comingSoon={item.coming}
          />
        ))}
      </div>
      <hr className="h-1 mt-[.56rem] mb-[1.1rem]" />
      <div className="w-full">
        <Accordion type="single" collapsible className="w-full p-0">
          <AccordionItem
            value="item-1"
            className="p-0 [&_button]:p-0 [&_a]:no-underline [&_a]:hover:no-underline border-none hover:no-underline"
          >
            <AccordionTrigger>
              <SidebarItem
                title="Shepherds"
                active={false}
                icon={<RiChat3Line />}
              />
            </AccordionTrigger>
            <AccordionContent className="px-[1rem] flex flex-col pb-0">
              <SidebarItem
                title="Find a Shepherd"
                active={false}
                icon={null}
                link="/dashboard/doc-chat"
              />
              <SidebarItem
                title="My Shepherds"
                active={false}
                icon={null}
                link="/dashboard/ai-tutor"
              />
              <SidebarItem
                title="Bookmarks"
                active={false}
                icon={null}
                link="/dashboard/ai-tutor"
              />
              <SidebarItem
                title="Bounties"
                active={false}
                icon={null}
                link="/dashboard/ai-tutor"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <SidebarItem
          title="Shepherd Chat"
          icon={<BsChatLeftDots />}
          active={false}
          link={'/dashboard/messaging'}
          comingSoon={false}
        />
      </div>
      <hr className="h-1 mt-[.56rem] mb-[1.1rem]" />
      <div className="w-full">
        <SidebarItem
          title="Barn"
          icon={<BarnImg />}
          active={false}
          comingSoon={true}
        />
      </div>
      <hr className="h-1 mt-[.56rem] mb-[1.1rem]" />
      <div className="w-full">
        <SidebarItem
          title="Feedback"
          icon={<MdOutlineFeedback />}
          active={false}
          comingSoon={false}
          link=""
        />
      </div>
    </div>
  );
}

const SidebarItem = ({
  title,
  icon,
  active,
  link,
  comingSoon
}: {
  title: string;
  icon?: JSX.Element;
  active: boolean;
  link?: string;
  comingSoon?: boolean;
}) => {
  const Comp = link ? Link : 'div';
  return (
    <Comp
      to={link}
      className={cn({
        'pointer-events-none': comingSoon
      })}
    >
      <div
        className={cn(
          'w-full h-[2.25rem] rounded  px-[1rem] text-[#6E7682] bg-white py-[0.5rem] flex items-center gap-[10px] hover:bg-[#F0F6FE] cursor-pointer',
          {
            'text-[#207DF7] bg-[#F0F6FE]': active
          }
        )}
      >
        {icon && <div className="icon">{icon}</div>}
        <h5 className="title text-[0.87rem] font-medium leading-[1.25rem] whitespace-nowrap">
          {title}
        </h5>
        <div className="flex-1"></div>
        {comingSoon && (
          <p className="text-[10px] border border-[#fc9b65] rounded text-[#fc9b65] px-[4px] whitespace-nowrap">
            Coming Soon
          </p>
        )}
      </div>
    </Comp>
  );
};

export default Sidebar;
