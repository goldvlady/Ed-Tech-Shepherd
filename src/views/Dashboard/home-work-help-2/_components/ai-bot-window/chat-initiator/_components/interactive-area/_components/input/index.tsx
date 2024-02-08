import React from 'react';
import { useState } from 'react';
import Chip from '../chip';

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

const Button = ({
  disabled,
  onClick,
  title,
  ...props
}: {
  disabled: boolean;
  title?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className={`h-[28px] rounded-full bg-[#207DF7] flex gap-2 justify-center items-center transition-all px-2 ${
        disabled ? 'cursor-not-allowed grayscale' : 'cursor-pointer'
      }`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span className="font-medium text-white text-sm">{title}</span>
      <ArrowSVG />
    </button>
  );
};

const ArrowSVG = () => {
  return (
    <svg
      width="13"
      height="11"
      viewBox="0 0 13 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 5.36353L10 5.36353"
        stroke="white"
        stroke-width="1.52728"
        stroke-linecap="round"
      />
      <path
        d="M6.54533 9.72727L11.5739 5.70438C11.7923 5.52969 11.7923 5.19758 11.5739 5.02289L6.54533 1"
        stroke="white"
        stroke-width="1.63637"
        stroke-linecap="round"
      />
    </svg>
  );
};
export default Input;
