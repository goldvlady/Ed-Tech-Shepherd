import React from 'react';
import { useState } from 'react';
import Chip from '../chip';
import Button from './_components/button';
import { PencilIcon } from '../../../../../../../../../../components/icons';
import useResourceStore from '../../../../../../../../../../state/resourceStore';
import { languages } from '../../../../../../../../../../helpers';
import { Select } from '@chakra-ui/react';
type Language = (typeof languages)[number];
function Input({
  actions: {
    handleSubjectChange,
    handleTopicChange,
    onSubmit,
    handleLevelChange,
    handleLanguageChange
  },
  state: { chatContext }
}: {
  actions: {
    handleSubjectChange: (subject: string) => void;
    handleTopicChange: (topic: string) => void;
    handleLanguageChange: (language: Language) => void;
    handleLevelChange: (level: string) => void;

    onSubmit: () => void;
  };
  state: { chatContext: { subject: string; topic: string; level: string } };
}) {
  const { courses: courseList, levels } = useResourceStore();
  const [currentInputType, setCurrentInputType] = useState<
    'subject' | 'topic' | 'level'
  >('subject');
  const [isSelectingLanguage, setIsSelectingLanguage] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(
    languages[0]
  );
  const [filterKeyword, setFilterKeyword] = useState({
    keyword: '',
    active: false
  });

  const handleInputTypeChange = (type: 'subject' | 'topic' | 'level') => {
    if (type === 'level') {
      setFilterKeyword({
        keyword: '',
        active: true
      });
    } else {
      setFilterKeyword({
        keyword: '',
        active: false
      });
    }

    setCurrentInputType(type);
  };

  const handleSubmit = () => {
    if (chatContext.subject.trim() === '') return;
    setFilterKeyword({
      keyword: '',
      active: false
    });
    onSubmit();
  };

  const handleButtonClick = () => {
    if (currentInputType === 'subject') {
      if (chatContext.subject === '') return;
      setFilterKeyword({
        active: true,
        keyword: ''
      });
      handleInputTypeChange('level');
    } else if (currentInputType === 'level') {
      if (chatContext.level === '') return;
      handleInputTypeChange('topic');
    } else {
      if (chatContext.topic === '') return;
      setIsSelectingLanguage(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleButtonClick();
    }
  };

  return (
    <React.Fragment>
      <div
        className={`w-full h-[50px]  text-black rounded-lg  flex gap-2 items-center pr-3 relative ${
          isSelectingLanguage ? 'bg-none ' : 'bg-white shadow-md'
        }`}
      >
        {chatContext.subject.trim() !== '' && currentInputType === 'topic' ? (
          <span className="text-xs absolute top-[-85%] left-[4%] flex ">
            Level -
            <span
              className="ml-1 inline-flex text-[#207DF7] gap-1 items-center cursor-pointer"
              onClick={() => {
                setCurrentInputType('level');
                setIsSelectingLanguage(false);
              }}
            >
              {' '}
              {chatContext.level}{' '}
              {<PencilIcon className="w-4 h-4" onClick={''} />}
            </span>
          </span>
        ) : null}
        {chatContext.subject.trim() !== '' &&
        (currentInputType === 'level' || currentInputType === 'topic') ? (
          <span className="text-xs absolute top-[-48%] left-[4%] flex ">
            Subject -
            <span
              className="ml-1 inline-flex text-[#207DF7] gap-1 items-center cursor-pointer"
              onClick={() => {
                setCurrentInputType('subject');
                setIsSelectingLanguage(false);
              }}
            >
              {' '}
              {chatContext.subject}{' '}
              {<PencilIcon className="w-4 h-4" onClick={''} />}
            </span>
          </span>
        ) : null}
        {chatContext.subject.trim() !== '' &&
        chatContext.level.trim() !== '' &&
        isSelectingLanguage ? (
          <span className="text-xs  absolute top-[-10%] left-[4%] flex ">
            Topic -
            <span
              className="ml-1 inline-flex text-[#207DF7] gap-1 items-center cursor-pointer"
              onClick={() => {
                setCurrentInputType('level');
                setIsSelectingLanguage(false);
              }}
            >
              {' '}
              {chatContext.level}{' '}
              {<PencilIcon className="w-4 h-4" onClick={''} />}
            </span>
          </span>
        ) : null}

        {!isSelectingLanguage ? (
          <>
            <input
              value={(() => {
                if (currentInputType === 'subject') {
                  return chatContext.subject;
                } else if (currentInputType === 'level') {
                  return chatContext.level;
                } else {
                  return chatContext.topic;
                }
              })()}
              onChange={(e) => {
                if (currentInputType === 'subject') {
                  handleSubjectChange(e.target.value);
                  setFilterKeyword((p) => ({ ...p, keyword: e.target.value }));
                } else if (currentInputType === 'level') {
                  handleLevelChange(e.target.value);
                  setFilterKeyword((p) => ({ ...p, keyword: e.target.value }));
                } else {
                  handleTopicChange(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              className="input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:text-sm placeholder:font-normal text-[#6E7682] font-normal text-sm min-w-0"
              placeholder={
                currentInputType === 'subject'
                  ? 'What subject would you like to start with?'
                  : currentInputType === 'level'
                  ? 'Level'
                  : 'What topic would you like to learn about?'
              }
            />
            <Button
              disabled={
                currentInputType === 'subject' &&
                chatContext.subject.trim() === ''
              }
              onClick={handleButtonClick}
              title={
                currentInputType === 'subject'
                  ? 'Select Level'
                  : currentInputType === 'level'
                  ? 'Enter Topic'
                  : 'Select Language'
              }
            />
            <AutocompleteWindow
              currentInputType={currentInputType}
              active={
                filterKeyword.keyword.trim() !== '' || filterKeyword.active
              }
              filterKeyword={filterKeyword}
              onClick={(value) => {
                if (currentInputType === 'subject') handleSubjectChange(value);
                else if (currentInputType === 'level') handleLevelChange(value);
                else handleTopicChange(value);
                setFilterKeyword({
                  active: false,
                  keyword: ''
                });
              }}
              courseList={courseList}
              levels={levels}
            />
          </>
        ) : (
          <div className="flex-1 mt-20">
            <Select
              isRequired
              name="language_select"
              className="w-full mb-2 rounded-lg "
              value={preferredLanguage}
              onChange={(e) => {
                handleLanguageChange(
                  e.target.value as typeof preferredLanguage
                );
                setPreferredLanguage(
                  e.target.value as typeof preferredLanguage
                );
              }}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Select>
            <button
              className={`bg-[#207DF7] text-white rounded-md w-full p-2  ${
                currentInputType === 'subject' &&
                chatContext.subject.trim() === ''
                  ? 'cursor-not-allowed grayscale'
                  : 'cursor-pointer'
              }`}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        )}
      </div>

      <div
        className={`flex gap-1 md:gap-4 mt-4 flex-wrap ${
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

const AutocompleteWindow = ({
  active,
  filterKeyword = {
    keyword: '',
    active: false
  },
  currentInputType,
  onClick,
  courseList,
  levels
}: any) => {
  if (!active) return null;

  return (
    <div className="w-full p-2 absolute top-[90%] bg-white rounded-lg rounded-t-none shadow-md z-10 max-h-[20rem] overflow-y-scroll py-2 no-scrollbar">
      {currentInputType === 'subject'
        ? courseList
            ?.filter((item) =>
              item.label
                .toLowerCase()
                .includes(filterKeyword.keyword.toLowerCase())
            )
            .map((item) => (
              <AutocompleteItem
                title={item.label}
                onClick={() => {
                  onClick(item.label);
                }}
              />
            ))
        : null}
      {currentInputType === 'level'
        ? levels
            ?.filter((item) =>
              item.label
                .toLowerCase()
                .includes(filterKeyword.keyword.toLowerCase())
            )
            .sort((a, b) => a.level - b.level) // Sort by item.level in ascending order
            .map((item) => (
              <AutocompleteItem
                title={item.label}
                onClick={() => {
                  onClick(item.label);
                }}
              />
            ))
        : null}
    </div>
  );
};

const AutocompleteItem = ({
  title,
  onClick
}: {
  title: string;
  onClick: () => void;
}) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className="p-2 hover:bg-[#F9F9FB] border-l-4 border-transparent hover:border-l-4 hover:border-l-[#207DF7] cursor-pointer"
    >
      <p className="text-[#6E7682] text-sm font-medium">{title}</p>
    </div>
  );
};
export default Input;
