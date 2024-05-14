import { MultiragDocument } from '../../../../../../../types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SourceButton from '../source-button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '../../../../../../../library/utils';

const InputArea = ({
  value,
  setValue,
  submitHandler,
  documents,
  clickable
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  submitHandler: VoidFunction;
  documents: Array<MultiragDocument>;
  clickable: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const openRefDocuments = (value: string) => {
    if (value[value.length - 1] === '@' && value[value.length - 2] !== '@') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const addAtHandler = (name: string) => {
    const v = value + name + ' ';
    setValue(v);
    setOpen(false);
  };
  return (
    <div className="h-[50px] w-full border bg-white rounded-[8px] shadow-md flex px-4 relative">
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
      <SourceButton />
      <input
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
      />
      {/* <Popover open={open}>
        <PopoverTrigger className="w-full">
          <input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitHandler();
              }
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={handleKeyDown}
            className="w-full input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:font-normal text-[#6E7682] font-normal p-0 resize-none"
            placeholder="Ask anything. You can use the @ button to specify a document"
          />
          <PopoverContent className="z-20 bg-white mr-[30px] rounded-xl" >
            {documents
              ? documents
                  .filter((el) =>
                    el.collection_name.includes(value.split('@')[1])
                  )
                  .map((doc) => (
                    <p
                      className="p-1 cursor-pointer hover:bg-slate-200 rounded-md"
                      key={doc.document_id}
                      onClick={() => addAtHandler(doc.collection_name)}
                    >
                      {doc.collection_name}
                    </p>
                  ))
              : null}
          </PopoverContent>
        </PopoverTrigger>
      </Popover> */}
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
