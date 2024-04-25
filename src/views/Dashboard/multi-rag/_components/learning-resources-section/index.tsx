import { cn } from '../../../../../library/utils';

const LearningResourcesSection = () => {
  return (
    <div className="flex-1 h-full pt-[1.56rem] w-full pr-[6rem]">
      <Header />
      <Body />
    </div>
  );
};

const Header = () => {
  const Item = ({ title, active }: { title: string; active: boolean }) => {
    return (
      <div
        className={cn(
          'px-[1rem] py-[0.43rem] rounded-[10px] shadow-md bg-[#F1F1F1] text-[#969CA6] flex justify-center items-center',
          { 'bg-white text-[#212224]': active }
        )}
      >
        <span className="text-[#212224] text-[0.68rem] font-normal">
          {title}
        </span>
      </div>
    );
  };

  return (
    <header className="flex gap-[10px]">
      <Item active={true} title="Summary" />
      <Item active={false} title="Generate Flashcards" />
      <Item active={false} title="Generate Quiz" />
    </header>
  );
};

const Body = () => {
  return (
    <div className="w-full bg-white rounded-[10px] mt-[0.62rem] px-[2.43rem] py-[2.87rem]">
      <p className="text-[#585F68] text-[0.75rem] font-normal">
        Albert Einstein's theory of relativity is a groundbreaking concept in
        physics that fundamentally changed our understanding of space, time, and
        gravity. It consists of two main parts: special relativity and general
        relativity. Special relativity, proposed in 1905, revolutionized the way
        we think about space and time by showing that they are not separate
        entities but are intertwined in a four-dimensional continuum known as
        spacetime. According to special relativity, the laws of physics are the
        same for all observers, regardless of their relative motion. One of the
        key principles of special relativity is that the speed of light is
        constant for all observers, regardless of the motion of the light source
        or the observer. General relativity, proposed in 1915, extends the
        principles of special relativity to include gravity. According to
        general relativity, gravity is not a force in the traditional sense but
        is instead a curvature of spacetime caused by the presence of mass and
        energy. In other words, massive objects like planets and stars cause
        spacetime to bend around them, and this bending of spacetime influences
        the motion of other objects, such as the planets orbiting the sun.
        Einstein's theory of relativity has had a profound impact on physics and
        our understanding of the universe. It has led to the development of
        technologies such as GPS, which relies on the precise timing of signals
        from satellites, taking into account the effects of both special and
        general relativity. It has also inspired new avenues of research in
        theoretical physics, such as the search for a unified theory that
        combines relativity with quantum mechanics.
      </p>
    </div>
  );
};

export default LearningResourcesSection;
