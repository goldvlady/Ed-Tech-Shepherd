import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../../../../components/ui/popover';
import { MultiragDocument } from '../../../../../../../types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SourceButton from '../source-button';
import { ReloadIcon } from '@radix-ui/react-icons';

const InputArea = ({
  value,
  setValue,
  submitHandler,
  documents
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  submitHandler: VoidFunction;
  documents: Array<MultiragDocument>;
}) => {
  const [open, setOpen] = useState(false);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '@') {
      console.log('Hey?');
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
      <SourceButton />
      <Popover open={open}>
        <PopoverTrigger className="w-full">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={handleKeyDown}
            className="w-full input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:font-normal text-[#6E7682] font-normal p-0 resize-none"
            placeholder="How can Shepherd help with your homework?"
          />
          <PopoverContent className="z-20 bg-white mr-40">
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
      </Popover>
      <div className="flex items-center gap-3 ml-2">
        <button
          onClick={submitHandler}
          className="w-[1.75rem] h-[1.75rem] rounded-full bg-[#207DF7] flex justify-center items-center"
        >
          <ArrowRight className="text-white w-[17px]" />
        </button>
        <button className="w-[2.18rem] h-[1.75rem] rounded-full bg-[#F9F9FB] flex items-center justify-center">
          <ReloadIcon className="w-[14px]" />
        </button>
      </div>
    </div>
  );
};

export default InputArea;
