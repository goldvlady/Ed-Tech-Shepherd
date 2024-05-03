import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../../../library/utils';

const ActionButton = ({
  children,
  onClick,
  active
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <div
    className={cn(
      'h-[30px] rounded-[10px] bg-white flex justify-center items-center cursor-pointer select-none transition-shadow hover:shadow-md px-[0.43rem] py-[0.93rem]',
      {
        'bg-[#F2F2F2]': active
      }
    )}
    role="button"
    onClick={onClick}
  >
    <span className="text-xs inline-block text-black whitespace-nowrap">
      {children}
    </span>
  </div>
);

const LearningResourcesSection = ({
  conversationID
}: {
  conversationID: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <div className="w-[10rem] flex justify-end p-4 pb-0">
        <ActionButton onClick={() => setExpanded(!expanded)}>
          <span className="flex items-center justify-center">
            Quick Action
            <ChevronDown
              className={cn('w-[18px] transition-transform rotate-[-90deg]', {
                'rotate-0': expanded
              })}
            />
          </span>
        </ActionButton>
      </div>
      <div
        className={cn(
          'items mt-2 flex justify-end items-end gap-3 p-4 pt-2 flex-col w-full opacity-0 pointer-events-none transition-opacity',
          {
            'opacity-100 pointer-events-auto': expanded
          }
        )}
      >
        <SummarySection />
        <HighlightsSection />
        <PinnedSection />
        <GenerateQuizSection />
        <GenerateFlashcardsSection />
      </div>
    </div>
  );
};

const SummarySection = () => {
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const toggleExpand = () => {
    setSummaryExpanded(!summaryExpanded);
  };
  return (
    <div className="relative">
      <ActionButton active={summaryExpanded} onClick={toggleExpand}>
        Summary
      </ActionButton>
      <div
        className={cn(
          'absolute w-[31.25rem] bg-white rounded-md shadow-md right-0 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar',
          {
            'opacity-100 pointer-events-auto': summaryExpanded
          }
        )}
      >
        <p className="p-[1.625rem] text-[#585F68] text-[0.75rem]">
          Albert Einstein's theory of relativity is a groundbreaking concept in
          physics that fundamentally changed our understanding of space, time,
          and gravity. It consists of two main parts: special relativity and
          general relativity.
          <br />
          <br />
          Special relativity, proposed in 1905, revolutionized the way we think
          about space and time by showing that they are not separate entities
          but are intertwined in a four-dimensional continuum known as
          spacetime. According to special relativity, the laws of physics are
          the same for all observers, regardless of their relative motion. One
          of the key principles of special relativity is that the speed of light
          is constant for all observers, regardless of the motion of the light
          source or the observer.
          <br />
          <br />
          General relativity, proposed in 1915, extends the principles of
          special relativity to include gravity. According to general
          relativity, gravity is not a force in the traditional sense but is
          instead a curvature of spacetime caused by the presence of mass and
          energy. In other words, massive objects like planets and stars cause
          spacetime to bend around them, and this bending of spacetime
          influences the motion of other objects, such as the planets orbiting
          the sun.
          <br />
          <br />
          Einstein's theory of relativity has had a profound impact on physics
          and our understanding of the universe. It has led to the development
          of technologies such as GPS, which relies on the precise timing of
          signals from satellites, taking into account the effects of both
          special and general relativity. It has also inspired new avenues of
          research in theoretical physics, such as the search for a unified
          theory that combines relativity with quantum mechanics.
        </p>
      </div>
    </div>
  );
};

const HighlightsSection = () => {
  return <ActionButton>Highlights</ActionButton>;
};

const PinnedSection = () => {
  return <ActionButton>Pinned</ActionButton>;
};

const GenerateQuizSection = () => {
  return <ActionButton>Generate Quiz</ActionButton>;
};

const GenerateFlashcardsSection = () => {
  return <ActionButton>Generate Flashcards</ActionButton>;
};

export default LearningResourcesSection;
