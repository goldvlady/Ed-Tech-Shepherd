import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Button } from '../../../../../../../../components/ui/button';
import { SearchIcon } from '@chakra-ui/icons';
import { GridIcon, ListBulletIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { cn } from '../../../../../../../../library/utils';
import ApiService from '../../../../../../../../services/ApiService';

function SelectDocuments() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    ApiService.getStudentDocuments({})
      .then((res) => res.json())
      .then((data) => {
        console.log('upload student documents', data);
        setDocuments(data.data);
      });
  }, []);

  return (
    <div className="w-full h-full bg-white px-[2.8rem] py-[1.6rem]">
      <header className="flex w-full items-center">
        <div className="controls flex-1 h-[2rem] grid grid-cols-2 gap-4">
          <div>
            <InputComp label="324" placeholder="324" />
          </div>
          <div className="h-full flex items-center">
            <Button
              size="icon"
              className={cn('w-6 h-6', {
                'border bg-primaryBlue text-white': layout === 'grid'
              })}
              variant="ghost"
              onClick={() => {
                setLayout('grid');
              }}
            >
              <GridIcon />
            </Button>
            <Button
              size="icon"
              className={cn('w-6 h-6', {
                'border bg-primaryBlue text-white': layout === 'list'
              })}
              variant="ghost"
              onClick={() => {
                setLayout('list');
              }}
            >
              <ListBulletIcon />
            </Button>
          </div>
        </div>
        <Button>New Chat</Button>
      </header>
      <main
        className={cn(
          'w-full h-full py-[0.9rem] transition-all overflow-scroll',
          {
            'grid grid-cols-4 gap-4': layout === 'grid',
            'space-y-4': layout === 'list'
          }
        )}
      >
        {documents.map((document) => {
          return (
            <DocItem
              selected={selected.some((e) => e === document._id)}
              layout={layout}
              document={document}
              onClick={() => {
                if (selected.some((e) => e === document._id)) {
                  setSelected((pS) =>
                    pS.filter((item) => item !== document.id)
                  );
                } else {
                  setSelected((prev) => [...prev, document._id]);
                }
              }}
            />
          );
        })}
      </main>
    </div>
  );
}

const InputComp = ({
  label,
  placeholder
}: {
  label: string;
  placeholder: string;
}) => {
  return (
    <InputGroup className="max-h-[30px] overflow-hidden flex items-center w-1/2">
      <InputLeftElement pointerEvents="none" className="max-h-[30px] ">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input type="text" rounded="full" className="max-h-[30px]" />
    </InputGroup>
  );
};

const DocItem = ({
  layout,
  document,
  selected,
  onClick
}: {
  layout: 'grid' | 'list';
  document: any;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      key={document._id}
      className={cn(
        'border-2 border-black rounded-[10px] transition-all duration-300 cursor-pointer',
        {
          'w-full h-[10rem] hover:shadow-xl': layout === 'grid',
          'w-full h-8 hover:shadow': layout === 'list',
          'border-4 border-blue-500': selected
        }
      )}
    >
      {document.title}
    </div>
  );
};

export default SelectDocuments;
