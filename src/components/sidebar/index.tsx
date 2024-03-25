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
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

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
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className={cn(
        'hidden md:flex md:w-[250px] shrink-0 overflow-auto border-r tran justify-end transition-all duration-500 relative',
        {
          'md:w-[80px]': collapsed
        }
      )}
    >
      <button
        className={cn(
          'w-[1.68rem] h-[2rem] absolute bg-[#207DF7] right-0 top-[1.06rem] text-white rounded-tl-md rounded-bl-md flex items-center justify-center z-10'
        )}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        <ChevronLeftIcon
          className={cn('transition-all', {
            'transform rotate-180': collapsed
          })}
        />
      </button>
      <div
        className={cn('w-full py-[1.5rem] px-[1rem] md:w-[250px]', {
          'md:w-[80px] px-[1rem] overflow-hidden pt-[3.6rem]': collapsed
        })}
      >
        <div
          className={cn('w-[7.18rem] h-[2.9rem]', {
            hidden: collapsed
          })}
        >
          <Logo />
        </div>
        <div className="mt-[2.06rem] w-full">
          <SidebarItem
            hideLabel={collapsed}
            title="Home"
            active={true}
            icon={<FiHome />}
            link="/"
          />
        </div>
        <hr className="h-1 mt-[.56rem] mb-[0.56rem]" />
        <div className="w-full flex flex-col gap-[10px]">
          {!collapsed && (
            <Accordion type="single" collapsible className="w-full p-0">
              <AccordionItem
                value="item-1"
                className="p-0 [&_button]:p-0 [&_a]:no-underline [&_a]:hover:no-underline border-none hover:no-underline"
              >
                <AccordionTrigger>
                  <SidebarItem
                    hideLabel={collapsed}
                    title="AI Chat"
                    active={false}
                    icon={<RiChat3Line />}
                  />
                </AccordionTrigger>
                <AccordionContent className="px-[1rem] flex flex-col pb-0">
                  <SidebarItem
                    hideLabel={collapsed}
                    title="Doc chat"
                    active={false}
                    icon={null}
                    link="/dashboard/doc-chat"
                  />
                  <SidebarItem
                    hideLabel={collapsed}
                    title="AI Tutor"
                    active={false}
                    icon={null}
                    link="/dashboard/ai-tutor"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {listItems.map((item) => (
            <SidebarItem
              hideLabel={collapsed}
              key={item.name}
              title={item.name}
              icon={<item.icon />}
              active={false}
              link={item.path}
              comingSoon={item.coming}
            />
          ))}
        </div>
        <hr className="h-1 mt-[.56rem] mb-[0.56rem]" />
        <div className="w-full">
          {!collapsed && (
            <Accordion type="single" collapsible className="w-full p-0">
              <AccordionItem
                value="item-1"
                className="p-0 [&_button]:p-0 [&_a]:no-underline [&_a]:hover:no-underline border-none hover:no-underline"
              >
                <AccordionTrigger>
                  <SidebarItem
                    hideLabel={collapsed}
                    title="Shepherds"
                    active={false}
                    icon={<RiChat3Line />}
                  />
                </AccordionTrigger>
                <AccordionContent className="px-[1rem] flex flex-col pb-0">
                  <SidebarItem
                    hideLabel={collapsed}
                    title="Find a Shepherd"
                    active={false}
                    icon={null}
                    link="/dashboard/doc-chat"
                  />
                  <SidebarItem
                    hideLabel={collapsed}
                    title="My Shepherds"
                    active={false}
                    icon={null}
                    link="/dashboard/ai-tutor"
                  />
                  <SidebarItem
                    hideLabel={collapsed}
                    title="Bookmarks"
                    active={false}
                    icon={null}
                    link="/dashboard/ai-tutor"
                  />
                  <SidebarItem
                    hideLabel={collapsed}
                    title="Bounties"
                    active={false}
                    icon={null}
                    link="/dashboard/ai-tutor"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <SidebarItem
            hideLabel={collapsed}
            title="Shepherd Chat"
            icon={<BsChatLeftDots />}
            active={false}
            link={'/dashboard/messaging'}
            comingSoon={false}
          />
        </div>
        <hr className="h-1 mt-[.56rem] mb-[0.56rem]" />
        <div className="w-full">
          <SidebarItem
            hideLabel={collapsed}
            title="Barn"
            icon={<BarnImg />}
            active={false}
            comingSoon={true}
          />
        </div>
        <hr className="h-1 mt-[.56rem] mb-[0.56rem]" />
        <div className="w-full">
          <SidebarItem
            hideLabel={collapsed}
            title="Feedback"
            icon={<MdOutlineFeedback />}
            active={false}
            comingSoon={false}
            link=""
          />
        </div>
      </div>
    </div>
  );
}

const SidebarItem = ({
  title,
  icon,
  active,
  link,
  comingSoon,
  hideLabel
}: {
  title: string;
  icon?: JSX.Element;
  active: boolean;
  link?: string;
  comingSoon?: boolean;
  hideLabel?: boolean;
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
        {hideLabel ? null : (
          <h5 className="title text-[0.87rem] font-medium leading-[1.25rem] whitespace-nowrap">
            {title}
          </h5>
        )}
        <div className="flex-1"></div>
        {comingSoon && !hideLabel && (
          <p className="text-[10px] border border-[#fc9b65] rounded text-[#fc9b65] px-[4px] whitespace-nowrap">
            Coming Soon
          </p>
        )}
      </div>
    </Comp>
  );
};

export default Sidebar;
