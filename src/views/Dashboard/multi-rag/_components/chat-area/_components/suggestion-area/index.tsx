import SuggestionButton from '../suggestion-button';

import { useState } from 'react';

const SuggestionArea = ({ setUserMessage }) => {
  const [usedSuggestions, setUsedSuggestions] = useState({});

  const handleSuggestionClick = (message) => {
    setUserMessage(message);
    setUsedSuggestions((prev) => ({ ...prev, [message]: true }));
  };

  return (
    <div className="w-full h-[3.75rem] absolute top-[-4.5rem] space-y-2 flex flex-col justify-center items-center">
      {!usedSuggestions[
        'What do I need to know to understand this document?'
      ] && (
        <SuggestionButton
          text="What do I need to know to understand this document?"
          onClick={() =>
            handleSuggestionClick(
              'What do I need to know to understand this document?'
            )
          }
        />
      )}
      {!usedSuggestions[
        'What topics should I explore after this document?'
      ] && (
        <SuggestionButton
          text="What topics should I explore after this document?"
          onClick={() =>
            handleSuggestionClick(
              'What topics should I explore after this document?'
            )
          }
        />
      )}
    </div>
  );
};

export default SuggestionArea;
