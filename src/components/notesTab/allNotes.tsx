import ApiService from '../../services/ApiService';
import TagModal from '../../views/Dashboard/FlashCards/components/TagModal';
import { DeleteModal } from '../../views/Dashboard/FlashCards/components/deleteModal';
import {
  NoteDetails,
  NoteServerResponse
} from '../../views/Dashboard/Notes/types';
import {
  DownloadIcon,
  FlashCardsIcon,
  FlashCardsSolidIcon,
  TrashIcon
} from '../icons';
import SelectableTable, { TableColumn } from '../table';
import {
  StyledMenuButton,
  StyledMenuSection,
  TableTitleWrapper,
  TitleIcon
} from './styles';
import { Block, BlockNoteEditor } from '@blocknote/core';
import { useBlockNote } from '@blocknote/react';
import { Menu, MenuList, MenuButton, Button, Text } from '@chakra-ui/react';
import { AlertStatus, ToastPosition } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import {
  ChevronRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid';
import moment from 'moment';
import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

interface Client {
  id: number;
  title: string;
  date_created: string;
  tags: string;
  last_modified: string;
}

type DataSourceItem = {
  key: number;
  title: string;
  dateCreated: string;
  lastModified: string;
  tags: string;
  id: string | number;
};

export interface Props {
  data: Array<NoteDetails>;
}

const formatTags = (tags: any): string => {
  if (tags || !Array.isArray(tags)) {
    return '';
  }
  // format tags and return
  // TODO: create a tag styling and attache
  return tags.join(' ');
};
const formatDate = (date: Date, format = 'DD ddd, hh:mma'): string => {
  return moment(date).format(format);
};

const AllNotesTab: FC<Props> = ({ data }) => {
  const params = useParams();
  const toast = useToast();
  const [deleteNoteModal, setDeleteNoteModal] = useState(false);
  const [, setDeleteAllNotesModal] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [clientsDetails, setClientDetails] = useState('');
  const [openTags, setOpenTags] = useState<boolean>(false);
  const [openTagsModal, setOpenTagsModal] = useState<boolean>(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [noteParamId, setNoteParamId] = useState<string | null>(
    params.id ?? null
  );

  const getNoteLocal = (noteId: string | null): string | null => {
    const storageId = getLocalStorageNoteId(noteId);
    const content = localStorage.getItem(storageId);
    return content;
  };
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onCancel = () => {
    setDeleteNoteModal(!deleteNoteModal);
  };

  const getLocalStorageNoteId = (noteId: string | null): string => {
    const genId = noteId ? noteId : '';
    return genId;
  };
  const [initialContent, setInitialContent] = useState<any>(
    getNoteLocal(noteParamId)
  );

  const DELETE_NOTE_TITLE = 'Delete Note';
  const DEFAULT_NOTE_TITLE = 'Enter Note Title';
  // get user details
  const defaultNoteTitle = DEFAULT_NOTE_TITLE;

  const [editedTitle, setEditedTitle] = useState(defaultNoteTitle);

  const [dataSource, setDataSource] = useState<DataSourceItem[]>(
    Array.from({ length: data.length }, (_, i) => ({
      key: i,
      id: data[i]?._id,
      title: data[i]?.topic,
      tags: formatTags(data[i]?.tags),
      dateCreated: formatDate(data[i]?.createdAt),
      lastModified: formatDate(data[i]?.updatedAt)
    }))
  );

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < data.length;
    setChecked(selectedPeople.length === data.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedPeople]);

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : data);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const onDeleteNote = (
    isOpenDeleteModal: boolean,
    noteDetails: string,
    noteId: any
  ) => {
    setDeleteNoteModal(isOpenDeleteModal);
    setClientDetails(noteDetails);
    setNoteId(noteId);
  };

  const onAddTag = (
    openTagsModal: boolean,
    noteDetails: string,
    noteId: any
  ) => {
    setOpenTagsModal(openTagsModal);
    setClientDetails(noteDetails);
    setNoteId(noteId);
  };

  const gotoEditNote = (noteId: string | number) => {
    const noteURL = `/dashboard/new-note/${noteId}`;
    if (noteId && noteId !== '') {
      navigate(noteURL);
    }
  };

  const editor: BlockNoteEditor | null = useBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined
  });

  const deleteNote = async (id: string): Promise<NoteServerResponse | null> => {
    const resp = await ApiService.deleteNote(id);
    const respText = await resp.text();
    try {
      const respDetails: NoteServerResponse = JSON.parse(respText);
      if (!respDetails.error) {
        // If there is no error, delete the note from local storage
        const storageId = getLocalStorageNoteId(id);
        localStorage.removeItem(storageId);
      }

      return respDetails;
    } catch (error: any) {
      return { error: error.message, message: error.message };
    }
  };

  const addTag = async (
    id: string,
    tags: string[]
  ): Promise<NoteServerResponse | null> => {
    const data = { tags: tags }; // Wrap the tags array in an object with the key "tags"
    const resp = await ApiService.updateNoteTags(id, data);
    const respText = await resp.text();
    try {
      const respDetails: NoteServerResponse = JSON.parse(respText);
      return respDetails;
    } catch (error: any) {
      return { error: error.message, message: error.message };
    }
  };

  const clearEditor = () => {
    if (!editor) {
      return false;
    }
    editor.forEachBlock((block: Block<any>) => {
      block.children = [];
      block.content = [];
      return true;
    });
  };

  const showToast = (
    title: string,
    description: string,
    status: AlertStatus,
    position: ToastPosition = 'top-right',
    duration = 5000,
    isClosable = true
  ) => {
    toast({
      title: description,
      status: status,
      position: position,
      duration: duration,
      isClosable: isClosable
    });
  };

  const DeleteNote = async () => {
    const noteIdInUse = noteId ?? noteParamId;

    if (!noteIdInUse || noteIdInUse === '') {
      setDeleteNoteModal(false);
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }

    setIsLoading(true);

    const details = await deleteNote(noteIdInUse);
    setIsLoading(false);

    if (!details) {
      setDeleteNoteModal(false);
      return showToast(
        DELETE_NOTE_TITLE,
        'An unknown error occurs while adding note. Try again',
        'error'
      );
    }

    if (details.error) {
      setDeleteNoteModal(false);
      return showToast(DELETE_NOTE_TITLE, details.error, 'error');
    } else {
      setDeleteNoteModal(false);
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setEditedTitle(defaultNoteTitle);
      setNoteId('');

      // Remove the deleted note from the dataSource
      setDataSource((prevDataSource) =>
        prevDataSource.filter((item) => item.id !== noteIdInUse)
      );
      clearEditor();
    }
  };

  const [newTags, setNewTags] = useState<string[]>(tags);

  const AddTag = async () => {
    const noteIdInUse = noteId ?? noteParamId;

    if (!noteIdInUse || noteIdInUse === '') {
      setOpenTagsModal(false);
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }

    const details = await addTag(noteIdInUse, newTags);

    if (!details) {
      setOpenTagsModal(false);
      return showToast(
        DELETE_NOTE_TITLE,
        'An unknown error occurs while adding tag. Try again',
        'error'
      );
    }

    if (details.error) {
      setOpenTagsModal(false);
      return showToast(DELETE_NOTE_TITLE, details.error, 'error');
    } else {
      setOpenTagsModal(false);
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setNoteId('');
      clearEditor();
      setTags(details.data.tags);
    }

    console.log({ tag: details.data.tags, tags });
  };

  const handleAddTag = () => {
    const value = inputValue.toLowerCase().trim();
    if (inputValue && !newTags.includes(value)) {
      setNewTags([...newTags, value]);
    }
    setInputValue('');
  };

  const clientColumn: TableColumn<DataSourceItem>[] = [
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
      align: 'left',
      id: 0,
      render: ({ title, id }) => (
        <TableTitleWrapper>
          <TitleIcon
            onClick={() => gotoEditNote(id)}
            src="/svgs/text-document.svg"
            className="text-gray-400 "
            alt=""
          ></TitleIcon>
          <Text onClick={() => gotoEditNote(id)} fontWeight="500">
            {title}
          </Text>
        </TableTitleWrapper>
      )
    },
    {
      key: 'tags',
      title: 'Tags',
      dataIndex: 'tags',
      align: 'left',
      id: 1
    },
    {
      key: 'dateCreated',
      title: 'Date Created',
      dataIndex: 'dateCreated',
      align: 'left',
      id: 2
    },
    {
      key: 'lastModified',
      title: 'Last Modified',
      dataIndex: 'lastModified',
      align: 'left',
      id: 3
    },
    {
      key: 'actions',
      title: '',
      render: ({ title, id }) => (
        <Menu>
          <MenuButton
            as={Button}
            variant="unstyled"
            borderRadius="full"
            p={0}
            minW="auto"
            height="auto"
          >
            <FaEllipsisH fontSize={'12px'} />
          </MenuButton>
          <MenuList
            fontSize="14px"
            minWidth={'185px'}
            borderRadius="8px"
            backgroundColor="#FFFFFF"
            boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
          >
            <section className="space-y-2 border-b pb-2">
              <button
                onClick={() => navigate(`/clients/${id}`)}
                className="w-full bg-gray-100 rounded-md flex items-center justify-between p-2"
              >
                <div className=" flex items-center space-x-1">
                  <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                    <FlashCardsIcon
                      className="w-4 h-4 text-primaryGray"
                      onClick={undefined}
                    />
                  </div>
                  <Text className="text-sm text-secondaryGray font-medium">
                    Flashcards
                  </Text>
                </div>
                <ChevronRightIcon className="w-2.5 h-2.5" />
              </button>
              <button className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2">
                <div className="flex items-center space-x-1">
                  <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                    <FlashCardsSolidIcon
                      className="w-4 h-4 text-primaryGray"
                      onClick={() => {
                        onAddTag(true, title, id);
                      }}
                    />
                  </div>
                  <Text className="text-sm text-secondaryGray font-medium">
                    Add tag
                  </Text>
                </div>
                <ChevronRightIcon className="w-2.5 h-2.5" />
              </button>
              <button className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2">
                <div className="flex items-center space-x-1">
                  <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                    <DownloadIcon
                      className="w-4 h-4 text-primaryGray"
                      onClick={undefined}
                    />
                  </div>
                  <Text className="text-sm text-secondaryGray font-medium">
                    Download
                  </Text>
                </div>
                <ChevronRightIcon className="w-2.5 h-2.5" />
              </button>
            </section>
            <div
              onClick={() => {
                onDeleteNote(true, title, id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px'
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.08317 2.50033V0.750326C3.08317 0.428162 3.34434 0.166992 3.6665 0.166992H8.33317C8.65535 0.166992 8.9165 0.428162 8.9165 0.750326V2.50033H11.8332V3.66699H10.6665V11.2503C10.6665 11.5725 10.4053 11.8337 10.0832 11.8337H1.9165C1.59434 11.8337 1.33317 11.5725 1.33317 11.2503V3.66699H0.166504V2.50033H3.08317ZM4.24984 1.33366V2.50033H7.74984V1.33366H4.24984Z"
                  fill="#F53535"
                />
              </svg>
              <Text fontSize="14px" lineHeight="20px" fontWeight="400">
                Delete
              </Text>
            </div>
          </MenuList>
        </Menu>
      )
    }
  ];

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle h-screen sm:px-6 lg:px-8 z-10">
            <div className="relative">
              <div className="table-columns  fixed bottom-[80px] right-[36%] left-[36%]">
                {selectedPeople.length > 0 && (
                  <div className="top-0 border px-4 py-8 text-sm rounded-md flex h-12 items-center justify-between space-x-3 w-[600px] bg-white sm:left-12">
                    <p className="text-gray-600">
                      {selectedPeople.length} items selected
                    </p>

                    <div className="flex items-center space-x-4">
                      <button className="text-gray-600" onClick={toggleAll}>
                        Select all
                      </button>
                      <Menu>
                        <StyledMenuButton
                          as={Button}
                          variant="unstyled"
                          borderRadius="full"
                          p={0}
                          minW="auto"
                          height="auto"
                          background="#F4F5F5"
                          display="flex"
                          className="flex items-center gap-2"
                          onClick={() => setOpenTags((prevState) => !prevState)}
                        >
                          <FlashCardsSolidIcon
                            className="w-5"
                            onClick={undefined}
                          />
                          Add tag
                        </StyledMenuButton>
                      </Menu>

                      {openTags && (
                        <Menu>
                          <StyledMenuSection>
                            <form
                              className="relative flex flex-1 py-2"
                              action="#"
                              method="GET"
                            >
                              <label htmlFor="search-field" className="sr-only">
                                Search
                              </label>
                              <MagnifyingGlassIcon
                                className="pl-2 pointer-events-none absolute inset-y-0 left-0 h-full w-7 text-gray-400"
                                aria-hidden="true"
                              />
                              <input
                                id="search-field"
                                className="block rounded-lg border-gray-400 w-full h-10 border py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                placeholder="Search Clients..."
                                type="search"
                                name="search"
                              />
                            </form>
                            <div className="relative cursor-pointer bg-lightGray px-2 py-1 rounded-lg flex items-start">
                              <div className="flex h-6 items-center">
                                <input
                                  id="comments"
                                  aria-describedby="comments-description"
                                  name="comments"
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-primaryBlue ring-0 border-0"
                                />
                              </div>
                              <div className="ml-3 text-sm leading-6">
                                <label
                                  htmlFor="comments"
                                  className="font-normal text-dark"
                                >
                                  #Chemistry
                                </label>
                              </div>
                            </div>

                            <div className="relative cursor-pointer hover:bg-lightGray px-2 py-1 rounded-lg flex items-start">
                              <div className="flex h-6 items-center">
                                <input
                                  id="comments"
                                  aria-describedby="comments-description"
                                  name="comments"
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-primaryBlue ring-0 border-0"
                                />
                              </div>
                              <div className="ml-3 text-sm leading-6">
                                <label
                                  htmlFor="comments"
                                  className="font-normal text-dark"
                                >
                                  #Person
                                </label>
                              </div>
                            </div>

                            <div className="relative cursor-pointer hover:bg-lightGray px-2 py-1 rounded-lg flex items-start">
                              <div className="flex h-6 items-center">
                                <input
                                  id="comments"
                                  aria-describedby="comments-description"
                                  name="comments"
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-primaryBlue ring-0 border-0"
                                />
                              </div>
                              <div className="ml-3 text-sm leading-6">
                                <label
                                  htmlFor="comments"
                                  className="font-normal text-dark"
                                >
                                  #Favorites
                                </label>
                              </div>
                            </div>
                          </StyledMenuSection>
                        </Menu>
                      )}

                      <button
                        onClick={() => setDeleteAllNotesModal(true)}
                        type="button"
                        className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      >
                        <TrashIcon className="w-5" onClick={undefined} />
                        <span>Delete</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg bg-white px-6 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
              <SelectableTable
                columns={clientColumn}
                dataSource={dataSource}
                isSelectable
                fileImage
                onSelect={(e) => setSelectedPeople(e)}
              />
            </div>
          </div>
        </div>
      </div>
      {openTagsModal && (
        <TagModal
          onSubmit={AddTag}
          isOpen={openTagsModal}
          onClose={() => setOpenTagsModal(false)}
          tags={tags}
          inputValue={inputValue}
          handleAddTag={handleAddTag}
          newTags={newTags}
          setNewTags={setNewTags}
          setInputValue={setInputValue}
        />
      )}

      <DeleteModal
        isLoading={isLoading}
        isOpen={deleteNoteModal}
        onCancel={() => onCancel()}
        onDelete={() => DeleteNote()}
        onClose={() => setDeleteNoteModal(false)}
      />
    </>
  );
};

export default AllNotesTab;
