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

const users = [
  {
    id: 'walter',
    display: 'Walter White'
  },
  {
    id: 'pipilu',
    display: '皮皮鲁'
  },
  {
    id: 'luxixi',
    display: '鲁西西'
  },
  {
    id: 'satoshi1',
    display: '中本聪'
  },
  {
    id: 'satoshi2',
    display: 'サトシ・ナカモト'
  },
  {
    id: 'nobi',
    display: '野比のび太'
  },
  {
    id: 'sung',
    display: '성덕선'
  },
  {
    id: 'jesse',
    display: 'Jesse Pinkman'
  },
  {
    id: 'gus',
    display: 'Gustavo "Gus" Fring'
  },
  {
    id: 'saul',
    display: 'Saul Goodman'
  },
  {
    id: 'hank',
    display: 'Hank Schrader'
  },
  {
    id: 'skyler',
    display: 'Skyler White'
  },
  {
    id: 'mike',
    display: 'Mike Ehrmantraut'
  },
  {
    id: 'lydia',
    display: 'Lydìã Rôdarté-Qüayle'
  }
];

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

  const openRefDocuments = (value: string) => {
    if (value[value.length - 1] === '@' && value[value.length - 2] !== '@') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const style = merge({}, defaultStyle, {
    input: {
      overflow: 'auto',
      width: '100%',
      border: 'none',
      outline: 'none',
      fontFamily: 'Arial',
      letterSpacing: 0.5
    },
    highlighter: {
      boxSizing: 'border-box',
      overflow: 'hidden'
      // height: 50
    }
  });
  const addAtHandler = (name: string) => {
    const v = value + name + ' ';
    setValue(v);
    setOpen(false);
  };
  return (
    <div className="w-full border bg-white rounded-[8px] shadow-md flex px-2 relative">
      <div
        className={cn(
          'reference-documents w-full p-2 rounded-xl border bg-white absolute left-0 bottom-[3rem] opacity-0 pointer-events-none transition-opacity',
          {
            'opacity-100 pointer-events-auto': open
          }
        )}
      >
        {documents
          ? documents.map((doc) => (
              <p
                className="w-full p-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors rounded-md truncate"
                key={doc.document_id}
                onClick={() => addAtHandler(doc.collection_name)}
              >
                {doc.collection_name}
              </p>
            ))
          : null}
      </div>
      <SourceButton multipleSelectedDocs={multipleSelectedDocs} />
      <div className="w-full no-scrollbar [&_*]:no-scrollbar [&_*]:!border-none  [&_*]:focus:!shadow-none [&_div:nth-child(1)]:!min-h-[0]">
        <MentionsInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="Ask anything. Use the @"
          allowSuggestionsAboveCursor={true}
          a11ySuggestionsListLabel={'Suggested mentions'}
          style={style}
          // style={{
          //   width: '100%',
          //   border: 'none',
          //   outline: 'none',
          //   boxShadow: 'none',
          //   padding: 0
          // }}
        >
          <Mention
            markup="@[__display__](user:__id__)"
            displayTransform={(url) => `@${url}`}
            trigger="@"
            data={documents?.map((item) => {
              return {
                id: item.collection_name.trim(),
                display: item.collection_name.trim()
              };
            })}
            renderSuggestion={(suggestion, search, highlightedDisplay) => (
              <div className="user">{highlightedDisplay}</div>
            )}
            // onAdd={onAdd}
            style={defaultMentionStyle}
          />
        </MentionsInput>
      </div>

      {/* <input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitHandler();
          }
        }}
        value={value}
        onChange={(e) => {
          openRefDocuments(e.target.value);
          setValue(e.target.value);
        }}
        // onKeyUp={handleKeyDown}
        className="w-full input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:font-normal text-[#6E7682] font-normal p-0 resize-none"
        placeholder="Ask anything. You can use the @ button to specify a document"
      /> */}
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
