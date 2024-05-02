import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Button } from '../../../../../../../../components/ui/button';
import { SearchIcon } from '@chakra-ui/icons';
import { GridIcon, ListBulletIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { cn } from '../../../../../../../../library/utils';
import ApiService from '../../../../../../../../services/ApiService';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function SelectDocuments() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const startConversation = () => {
    ApiService.multiDocConversationStarter({
      referenceId: selected.length > 0 ? selected[0] : null,
      referenceDocIds: selected,
      language: 'English'
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('multiDocConversationStarter', data);
        navigate(`/dashboard/doc-chat/${data.data}`, { replace: true });
      });
  };

  useEffect(() => {
    ApiService.multiDocVectorDocs('64906166763aa2579e58c97d')
      .then((res) => res.json())
      .then((data) => {
        console.log('upload student documents', data);
        if (data.status === 'success') {
          setDocuments(data.data);
        }
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
        <Button onClick={startConversation}>New Chat</Button>
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
              selected={selected.some((e) => e === document.document_id)}
              layout={layout}
              document={document}
              onClick={() => {
                if (selected.some((e) => e === document.document_id)) {
                  setSelected((prevSelected) =>
                    prevSelected.filter((item) => item !== document.document_id)
                  );
                } else {
                  setSelected((prevSelected) => [
                    ...prevSelected,
                    document.document_id
                  ]);
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
      <Input type="text" rounded="full" className="max-h-[30px] bg-[#F8F8F9]" />
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
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    } else {
      return text;
    }
  }
  return (
    <div
      onClick={onClick}
      role="button"
      key={document.document_id}
      className={cn(
        'border rounded-[10px] transition-all duration-300 cursor-pointer p-2 flex flex-col justify-between relative',
        {
          'w-full h-[10rem] hover:shadow': layout === 'grid',
          'w-full h-8 hover:shadow': layout === 'list',
          'shadow-xl hover:shadow-xl': selected
        }
      )}
    >
      <div></div>
      <div className="rounded-md flex items-center justify-center absolute p-[8px] w-[30px] h-[30px] bg-[#EBF4FE]">
        <span className="text-[#7AA7FB] text-[10px]">PDF</span>
      </div>
      <div className="w-full">
        <p className="text-[10px] text-[#585F68] font-normal">
          {truncateText(document.collection_name, 55)}
        </p>
        <p className="text-[8px] text-[#6E7682] font-normal mt-[2px]">
          Added {format(new Date(document.createdAt), 'dd/MM/yyyy')}
        </p>
      </div>
    </div>
  );
};

export default SelectDocuments;
