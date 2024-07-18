import { MultiragDocument } from '../../../../../../../types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SourceButton from '../source-button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '../../../../../../../library/utils';
import { MentionsInput, Mention } from 'react-mentions';
import { border } from '@chakra-ui/react';
import { merge } from '../../../../../../../util';
import defaultStyle from './defaultStyle';
import defaultMentionStyle from './defaultMentionStyle';

const InputArea = ({
  value,
  setValue,
  submitHandler,
  documents,
  clickable,
  multipleSelectedDocs
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  submitHandler: VoidFunction;
  documents: Array<MultiragDocument>;
  clickable: boolean;
  multipleSelectedDocs: any[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border bg-white rounded-[8px] shadow-md flex px-2 relative">
      <SourceButton multipleSelectedDocs={multipleSelectedDocs} />
      <div className="w-full no-scrollbar [&_*]:no-scrollbar [&_*]:!border-none  [&_*]:focus:!shadow-none [&_textarea]:leading-normal [&_div:nth-child(1)]:!min-h-[0]">
        {/* [&_div:nth-child(1)]:!min-h-[0] */}
        <MentionsInput
          value={value}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submitHandler();
            }
          }}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="Ask anything. Use @ to select docs"
          allowSuggestionsAboveCursor={true}
          a11ySuggestionsListLabel={'Suggested mentions'}
          style={defaultStyle}
          customSuggestionsContainer={(children) => (
            <div className="p-2 rounded-md overflow-hidden shadow-md">
              {children}
            </div>
          )}
        >
          <Mention
            markup="@[[[__display__]]]"
            displayTransform={(url) => `@${url}`}
            trigger="@"
            data={documents?.map((item) => {
              return {
                id: item.collection_name.trim(),
                display: item.collection_name.trim()
              };
            })}
            renderSuggestion={(suggestion, search, highlightedDisplay) => (
              <div>{highlightedDisplay}</div>
            )}
            // onAdd={onAdd}
            style={defaultMentionStyle}
          />
        </MentionsInput>
      </div>
      <div className="flex items-center gap-3 ml-2">
        <button
          onClick={() => {
            submitHandler();
          }}
          style={{ pointerEvents: clickable ? 'auto' : 'none' }}
          className="w-[1.75rem] h-[1.75rem] rounded-full bg-[#207DF7] flex justify-center items-center"
        >
          <ArrowRight className="text-white w-[17px]" />
        </button>
        <button
          style={{ pointerEvents: clickable ? 'auto' : 'none' }}
          className="w-[2.18rem] h-[1.75rem] rounded-full bg-[#F9F9FB] flex items-center justify-center"
        >
          <ReloadIcon className="w-[14px]" />
        </button>
      </div>
    </div>
  );
};

export default InputArea;
