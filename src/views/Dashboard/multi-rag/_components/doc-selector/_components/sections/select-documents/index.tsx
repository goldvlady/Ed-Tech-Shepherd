import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Button } from '../../../../../../../../components/ui/button';
import { SearchIcon } from '@chakra-ui/icons';
import { GridIcon, ListBulletIcon, ReloadIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { cn } from '../../../../../../../../library/utils';
import ApiService from '../../../../../../../../services/ApiService';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckIcon } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Worker } from '@react-pdf-viewer/core';
import {
  Viewer,
  SpecialZoomLevel,
  ViewMode,
  ScrollMode
} from '@react-pdf-viewer/core';
import useUserStore from '../../../../../../../../state/userStore';
import {
  MultiragDocument,
  multiragResponse
} from '../../../../../../../../types';
import { languages } from '../../../../../../../../helpers';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger
} from '../../../../../../../../components/ui/alert-dialog';
import { Input as ShadcnInput } from '../../../../../../../../components/ui/input';

function SelectDocuments() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<Array<string>>([]);
  const { user } = useUserStore();

  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: (data: {
      referenceId: string;
      referenceDocIds: Array<string>;
      language: (typeof languages)[number];
    }) => ApiService.multiDocConversationStarter(data).then((res) => res.json())
  });
  const { data } = useQuery({
    queryKey: ['processed-documents'],
    queryFn: async () => {
      const r: multiragResponse<Array<MultiragDocument>> =
        await ApiService.multiDocVectorDocs(user._id).then((res) => res.json());
      return r;
    }
  });

  const { mutate: mutateChatName, isPending } = useMutation({
    mutationFn: (data: any) =>
      ApiService.multiDocCreateTitle(data).then((res) => res.json())
  });

  const startConversation = () => {
    mutate(
      {
        referenceId: user._id,
        referenceDocIds: selected,
        language: 'English'
      },
      {
        onSuccess(data) {
          mutateChatName(
            {
              docNames: ['new chat name'],
              conversationId: data.data
            },
            {
              onSuccess: (chatName) => {
                if (chatName.status === 'success') {
                  navigate(`/dashboard/doc-chat/${data.data}`, {
                    replace: true
                  });
                }
              }
            }
          );
        }
      }
    );
  };

  return (
    <div className="w-full h-full bg-white px-[2.8rem] py-[1.6rem]">
      <header className="flex w-full items-center">
        <div className="controls flex-1 h-[2rem] grid grid-cols-2 gap-4">
          <div>
            <InputComp />
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Start Chat</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <div className="p-2">
              <ShadcnInput placeholder="Title e.g" />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={startConversation} disabled={isPending}>
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* <Button
          onClick={startConversation}
          disabled={selected.length === 0 || isPending}
        >
          {isPending && <ReloadIcon className="animate-spin mr-2" />}
          Start Chat
        </Button> */}
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
        {data?.data?.map((document) => {
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
  label?: string;
  placeholder?: string;
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
  const pdfURL = `https://shepherd-document-upload.s3.us-east-2.amazonaws.com/${document.collection_name}`;
  return (
    <div
      onClick={onClick}
      role="button"
      key={document.document_id}
      className={cn(
        'border rounded-[10px] transition-all duration-300 cursor-pointer flex relative',
        {
          'w-full h-[10rem] hover:shadow p-2 flex-col justify-between':
            layout === 'grid',
          'w-full h-8 hover:shadow flex gap-2': layout === 'list',
          'shadow-xl hover:shadow-xl': selected && layout === 'grid',
          'shadow-sm hover:shadow-sm border-b-2 border-b-[#207DF7]':
            selected && layout === 'list'
        }
      )}
    >
      <div className="absolute w-full h-full">
        <div className="pointer-events-none absolute w-full pb-2 pr-2 h-full">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfURL}
              defaultScale={SpecialZoomLevel.PageFit}
              viewMode={ViewMode.SinglePage}
              scrollMode={ScrollMode.Page}
            />
          </Worker>
        </div>
      </div>
      <div
        className={cn(
          'w-[22px] h-[22px] absolute top-[-0.5rem] right-[-0.5rem] rounded-full bg-[#207DF7] pointer-events-none opacity-0 transition-opacity flex justify-center items-center',
          {
            'opacity-100': selected && layout === 'grid'
          }
        )}
      >
        <CheckIcon className="w-[12px] h-[12px] text-white font-bold" />
      </div>
      <div
        className={cn({
          hidden: layout === 'list'
        })}
      ></div>
      <div
        className={cn(
          'rounded-md flex items-center justify-center bg-[#EBF4FE]',
          { 'p-[8px] w-[30px] h-[30px] absolute': layout === 'grid' },
          { 'w-[30px] rounded-tr-none rounded-br-none': layout === 'list' }
        )}
      >
        <span className="text-[#7AA7FB] text-[10px]">PDF</span>
      </div>
      <div className="w-full z-10 backdrop-blur-lg">
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
