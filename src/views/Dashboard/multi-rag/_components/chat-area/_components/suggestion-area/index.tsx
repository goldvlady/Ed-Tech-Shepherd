import SuggestionButton from '../suggestion-button';

const SuggestionArea = () => (
  <div className="w-full h-[3.75rem] absolute top-[-4.5rem] cursor-pointer space-y-2 flex flex-col justify-center items-center">
    <SuggestionButton text="What do I need to know to understand this document?" />
    <SuggestionButton text="What topics should I explore after this document?" />
  </div>
);

export default SuggestionArea;
