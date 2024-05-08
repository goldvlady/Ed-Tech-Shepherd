const SuggestionButton = ({ text }) => (
  <div className="px-[1.125rem] py-[0.03rem] rounded-full border h-[1.68rem] border-[#4D8DF9] text-center flex items-center justify-center backdrop-blur-sm">
    <span className="text-[0.75rem] text-center text-[#4D8DF9] whitespace-nowrap">
      {text}
    </span>
  </div>
);

export default SuggestionButton;
