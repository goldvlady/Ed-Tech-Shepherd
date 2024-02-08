import React from 'react';
import { useState } from 'react';
import Chip from '../chip';
import Button from './_components/button';

function Input({
  actions: { handleSubjectChange, handleTopicChange, onSubmit },
  state: { chatContext }
}: {
  actions: {
    handleSubjectChange: (subject: string) => void;
    handleTopicChange: (topic: string) => void;
    onSubmit: () => void;
  };
  state: { chatContext: { subject: string; topic: string } };
}) {
  const [currentInputType, setCurrentInputType] = useState<'subject' | 'topic'>(
    'subject'
  );

  const handleInputTypeChange = (type: 'subject' | 'topic') => {
    setCurrentInputType(type);
  };

  const handleSubmit = () => {
    if (chatContext.subject.trim() === '') return;
    onSubmit();
  };

  return (
    <React.Fragment>
      <div className="w-full h-[50px] bg-white text-black rounded-lg shadow-md flex gap-2 items-center pr-3">
        <input
          value={
            currentInputType === 'subject'
              ? chatContext.subject
              : chatContext.topic
          }
          onChange={(e) =>
            currentInputType === 'subject'
              ? handleSubjectChange(e.target.value)
              : handleTopicChange(e.target.value)
          }
          className="input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:text-sm placeholder:font-normal text-[#6E7682] font-normal text-sm"
          placeholder={
            currentInputType === 'subject'
              ? 'What subject would you like to start with?'
              : 'What topic you want to learn about?'
          }
        />
        <Button
          disabled={
            currentInputType === 'subject' && chatContext.subject.trim() === ''
          }
          onClick={() => {
            if (currentInputType === 'subject') {
              handleInputTypeChange('topic');
            } else {
              handleSubmit();
            }
          }}
          title={currentInputType === 'subject' ? 'Select Topic' : 'Submit'}
        />
      </div>
      <div
        className={`flex gap-4 mt-4 ${
          currentInputType !== 'subject'
            ? ' transition-opacity opacity-0 pointer-events-none'
            : ''
        }`}
      >
        {['Math', 'Physics', 'Chemistry', 'Programming'].map((subject) => (
          <Chip
            key={subject}
            title={subject}
            onClick={() => handleSubjectChange(subject)}
          />
        ))}
      </div>
    </React.Fragment>
  );
}

export default Input;
