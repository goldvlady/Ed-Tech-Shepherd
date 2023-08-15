import { saveMarkdownAsPDF } from '../../library/fs';
import ApiService from '../../services/ApiService';
import TagModal from '../../views/Dashboard/FlashCards/components/TagModal';
import { NoteModal } from '../../views/Dashboard/Notes/Modal';
import {
  NoteDetails,
  NoteServerResponse
} from '../../views/Dashboard/Notes/types';
import TableTag from '../CustomComponents/CustomTag';
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
  TableTitleWrapper
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
import { setTag } from '@sentry/react';
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
  tags: any[];
  id: string | number;
  status: string;
};

export interface Props {
  data: Array<NoteDetails>;
  getNotes: () => void;
}

const formatTags = (tags: string | string[]): any[] => {
  if (!tags) {
    return [];
  }
  if (typeof tags === 'string') {
    // If tags is a string, split it into an array and return
    return tags.split(',').map((tag) => {
      return <TableTag label={tag} />;
    });
  } else if (Array.isArray(tags)) {
    return tags.map((tag) => {
      return <TableTag label={tag} />;
    });
  } else {
    return [];
  }
};

const formatDate = (date: Date, format = 'DD ddd, hh:mma'): string => {
  return moment(date).format(format);
};

// Define the type for the pinned note
type PinnedNote = {
  noteId: string | null;
  pinnedNoteJSON: any;
};

const AllNotesTab: FC<Props> = ({ data, getNotes }) => {
  const params = useParams();
  const toast = useToast();
  const [deleteNoteModal, setDeleteNoteModal] = useState(false);
  const [deleteAllNoteModal, setDeleteAllNoteModal] = useState(false);
  const [tagAllNoteModal, setTagAllNoteModal] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [openTags, setOpenTags] = useState<boolean>(false);
  const [openTagsModal, setOpenTagsModal] = useState<boolean>(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [noteParamId, setNoteParamId] = useState<string | null>(
    params.id ?? null
  );

  const [, setPinnedNotes] = useState<PinnedNote[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [selectedNoteIdToDelete, setSelectedNoteIdToDelete] = useState(null);
  const [selectedNoteIdToDeleteArray, setSelectedNoteIdToDeleteArray] =
    useState<string[]>([]);
  const [selectedNoteIdToAddTagsArray, setSelectedNoteIdToAddTagsArray] =
    useState<string[]>([]);
  const [selectedNoteIdToAddTags, setSelectedNoteIdToAddTags] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTags, setNewTags] = useState<string[]>(tags);

  const getNoteLocal = (noteId: string | null): string | null => {
    const storageId = getLocalStorageNoteId(noteId);
    const content = localStorage.getItem(storageId);
    return content;
  };

  const onCancel = () => {
    setDeleteNoteModal(!deleteNoteModal);
    setSelectedRowKeys([]);
    setSelectedPeople([]);
  };

  const getLocalStorageNoteId = (noteId: string | null): string => {
    const genId = noteId ? noteId : '';
    return genId;
  };

  const [initialContent, setInitialContent] = useState<any>(
    getNoteLocal(noteParamId)
  );

  const DELETE_NOTE_TITLE = 'Delete Note';

  const [dataSource, setDataSource] = useState<DataSourceItem[]>(
    Array.from({ length: data.length }, (_, i) => ({
      key: i,
      id: data[i]?._id,
      title: data[i]?.topic,
      tags: formatTags(data[i]?.tags),
      dateCreated: formatDate(data[i]?.createdAt),
      lastModified: formatDate(data[i]?.updatedAt),
      status: data[i]?.status
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

  const handleSelectAll = () => {
    if (!allChecked) {
      const newSelectedRowKeys = dataSource.map(
        (data) => data.key as unknown as string
      );

      setSelectedRowKeys(newSelectedRowKeys);

      const newSelectedNoteIds = dataSource.map((data) => data.id);
      const newSelectedNoteIdsAsString = newSelectedNoteIds.map((id) =>
        id.toString()
      );
      // Append the new selected note IDs to the existing array
      setSelectedNoteIdToDeleteArray((prevArray) => [
        ...prevArray,
        ...newSelectedNoteIdsAsString
      ]);

      setSelectedNoteIdToAddTagsArray((prevArray) => [
        ...prevArray,
        ...newSelectedNoteIdsAsString
      ]);
    } else {
      setSelectedRowKeys([]);
      setSelectedPeople([]);
      setSelectedNoteIdToDelete(null);
      setSelectedNoteIdToAddTags(null);
    }
    setAllChecked(!allChecked);
  };

  function Done() {
    setSelectedRowKeys([]);
    setSelectedPeople([]);
    setAllChecked(false);

    setSelectedNoteIdToDelete(null);
  }

  useEffect(() => {
    // console.log({ checked, selectedPeople });
  }, [checked, selectedPeople]);

  const onDeleteNote = (isOpenDeleteModal: boolean, noteId: any) => {
    setDeleteNoteModal(isOpenDeleteModal);
    setSelectedPeople([]);
    setNoteId(noteId);
  };

  const onDeleteAllNote = (isOpenDeleteModal: boolean, noteId: any) => {
    setDeleteAllNoteModal(isOpenDeleteModal);
    setSelectedPeople([]);
    setNoteId(noteId);
  };

  const onAddTagToMultipleNotes = (
    isOpenTagAllNoteModal: boolean,
    noteId: any,
    tags: string[]
  ) => {
    setTagAllNoteModal(isOpenTagAllNoteModal);
    setNoteId(noteId);
  };

  const onAddTagBottomModal = (
    isOpenTagBottomNoteModal: boolean,
    noteId: any,
    tags: string[]
  ) => {
    setTagAllNoteModal(isOpenTagBottomNoteModal);
    setNoteId(noteId);
  };

  const onAddTag = (openTagsModal: boolean, noteId: any, tags: string[]) => {
    setOpenTagsModal(openTagsModal);
    setNoteId(noteId);
    // setTags(tags);
    // console.log({ tags });
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

  const deleteAllNote = async (
    id: string[]
  ): Promise<NoteServerResponse | null> => {
    const resp = await ApiService.deleteAllNote(id);
    const respText = await resp.text();
    try {
      const respDetails: NoteServerResponse = JSON.parse(respText);
      if (!respDetails.error) {
        // If there is no error, delete the note from local storage
        for (const singleId of id) {
          const storageId = getLocalStorageNoteId(singleId);
          localStorage.removeItem(storageId);
        }
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
    const data = { tags: tags };
    const resp = await ApiService.updateNoteTags(id, data);
    const respText = await resp.text();
    try {
      const respDetails: NoteServerResponse = JSON.parse(respText);
      return respDetails;
    } catch (error: any) {
      return { error: error.message, message: error.message };
    }
  };

  const addAllNoteTags = async (
    id: string[],
    tags: string[]
  ): Promise<NoteServerResponse | null> => {
    const resp = await ApiService.updateAllNoteTags(id, tags);
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

  const savePinnedNoteLocal = (pinnedNotesArray: any) => {
    const storageId = 'pinned_notes'; // Unique identifier for the array in local storage
    localStorage.setItem(storageId, JSON.stringify(pinnedNotesArray));
  };

  // Function to get pinned notes from local storage
  const getPinnedNotesFromLocalStorage = (): PinnedNote[] | null => {
    const storageId = 'pinned_notes';
    const pinnedNotesString = localStorage.getItem(storageId);
    if (pinnedNotesString) {
      return JSON.parse(pinnedNotesString);
    }
    return null;
  };

  useEffect(() => {
    const pinnedNotesFromLocalStorage = getPinnedNotesFromLocalStorage();
    if (pinnedNotesFromLocalStorage) {
      setPinnedNotes(pinnedNotesFromLocalStorage);
    } else {
      setPinnedNotes([]);
    }
  }, []);

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
      // Remove the deleted note from pinned notes in local storage
      const pinnedNotesFromLocalStorage = getPinnedNotesFromLocalStorage();
      if (pinnedNotesFromLocalStorage) {
        const updatedPinnedNotes = pinnedNotesFromLocalStorage.filter(
          (pinnedNote) => pinnedNote.noteId !== noteIdInUse
        );
        savePinnedNoteLocal(updatedPinnedNotes);
      }
      setDeleteNoteModal(false);
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setNoteId('');
      getNotes();

      // Remove the deleted note from the dataSource
      setDataSource((prevDataSource) =>
        prevDataSource.filter((item) => item.id !== noteIdInUse)
      );
      clearEditor();
    }
  };

  const DeleteAllNote = async () => {
    let noteIdsInUse: string[] = [];

    if (Array.isArray(noteId)) {
      noteIdsInUse = noteId;
    } else if (noteId) {
      noteIdsInUse.push(noteId);
    } else if (noteParamId) {
      noteIdsInUse.push(noteParamId);
    } else {
      setDeleteNoteModal(false);
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }

    setIsLoading(true);

    console.log({ noteIdsInUse });

    const details = await deleteAllNote(noteIdsInUse);
    setIsLoading(false);

    if (!details) {
      setDeleteNoteModal(false);
      return showToast(
        DELETE_NOTE_TITLE,
        'An unknown error occurred while deleting the note. Please try again.',
        'error'
      );
    }

    if (details.error) {
      setDeleteNoteModal(false);
      return showToast(DELETE_NOTE_TITLE, details.error, 'error');
    } else {
      // Remove the deleted notes from pinned notes in local storage
      const pinnedNotesFromLocalStorage = getPinnedNotesFromLocalStorage();
      if (pinnedNotesFromLocalStorage) {
        const updatedPinnedNotes = pinnedNotesFromLocalStorage.filter(
          (pinnedNote) => !noteIdsInUse.includes(pinnedNote.noteId as string)
        );
        savePinnedNoteLocal(updatedPinnedNotes);
      }
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setNoteId('');
      getNotes();

      // Remove the deleted notes from the dataSource
      setDataSource((prevDataSource) =>
        prevDataSource.filter(
          (item) => !noteIdsInUse.includes(item.id as string)
        )
      );
      clearEditor();
    }
  };

  const downloadAsPDF = async (noteId: string | number, title: string) => {
    if (!noteId || !editor) {
      return showToast(
        'Download Alert',
        'Cannot download note. Please select a note',
        'error'
      );
    }
    // const noteMarkdown: string = await editor.blocksToMarkdown(editor.topLevelBlocks);
    // if (!noteMarkdown) {
    //   return showToast(
    //     "Download Alert",
    //     'Could not extract note content. Please try again',
    //     'error'
    //   );
    // }
    // use note name also in other
    const noteName = `${title}`;
    // saveMarkdownAsPDF(noteName, noteMarkdown);
    saveMarkdownAsPDF(noteName, '');
  };

  const AddTag = async (tagsArray) => {
    setIsLoading(true);
    const noteIdInUse = noteId ?? noteParamId;
    if (!noteIdInUse || noteIdInUse === '') {
      setOpenTagsModal(false);
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }
    const details = await addTag(noteIdInUse, tagsArray);

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
      setIsLoading(false);
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setNoteId('');
      clearEditor();
      getNotes();

      // setTags(details.data.tags);

      setDataSource((prevDataSource) => {
        return prevDataSource.map((item) => {
          if (item.id === noteIdInUse) {
            return { ...item, tags: formatTags(newTags) };
          }
          return item;
        });
      });
    }
    setIsLoading(false);
  };

  const AddAllNoteTags = async () => {
    setIsLoading(true);
    let noteIdsInUse: string[] = [];

    if (Array.isArray(noteId)) {
      noteIdsInUse = noteId;
    } else if (noteId) {
      noteIdsInUse.push(noteId);
    } else if (noteParamId) {
      noteIdsInUse.push(noteParamId);
    } else {
      setTagAllNoteModal(false);
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }

    setIsLoading(true);

    const details = await addAllNoteTags(noteIdsInUse, selectedTags);
    setIsLoading(false);
    // console.log({ noteIdsInUse, selectedTags });

    if (!details) {
      setTagAllNoteModal(false);
      return showToast(
        DELETE_NOTE_TITLE,
        'An unknown error occurs while adding tag. Try again',
        'error'
      );
    }

    if (details.error) {
      setTagAllNoteModal(false);
      return showToast(DELETE_NOTE_TITLE, details.error, 'error');
    } else {
      setIsLoading(false);
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setNoteId('');
      getNotes();

      setDataSource((prevDataSource) => {
        return prevDataSource.filter((item) => {
          if (!noteIdsInUse.includes(item.id as string)) {
            return { ...item, tags: formatTags(newTags) };
          }
          return item;
        });
      });
      clearEditor();
    }
    setIsLoading(false);
  };

  const handleAddTag = () => {
    const value = inputValue.toLowerCase().trim();
    if (inputValue && !newTags.includes(value)) {
      setNewTags([...newTags, value]);
    }
    setInputValue('');
  };

  const handleTagChange = (event, tag) => {
    const tagValue = tag.toLowerCase();

    if (event.target.checked) {
      setSelectedTags([...selectedTags, tagValue]);
    } else {
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tagValue)
      );
    }
  };

  const clientColumn: TableColumn<DataSourceItem>[] = [
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
      align: 'left',
      id: 0,
      render: ({ title, id, status }) => (
        <TableTitleWrapper>
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
      id: 1,
      render: ({ tags }) => (
        <>
          {' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            width="25px"
            height="25px"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 6h.008v.008H6V6z"
            />
          </svg>
          {tags}
        </>
      )
    },
    {
      key: 'status',
      title: 'Staus',
      dataIndex: 'status',
      align: 'left',
      id: 2,
      render: ({ status }) => <>{status}</>
    },
    {
      key: 'dateCreated',
      title: 'Date Created',
      dataIndex: 'dateCreated',
      align: 'left',
      id: 3
    },
    {
      key: 'lastModified',
      title: 'Last Modified',
      dataIndex: 'lastModified',
      align: 'left',
      id: 4
    },
    {
      key: 'actions',
      title: '',
      render: ({ title, id, tags }) => (
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
              <button
                onClick={() => {
                  onAddTag(true, id, tags);
                }}
                className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2"
              >
                <div className="flex items-center space-x-1">
                  <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                    <FlashCardsSolidIcon
                      onClick={undefined}
                      className="w-4 h-4 text-primaryGray"
                    />
                  </div>
                  <Text className="text-sm text-secondaryGray font-medium">
                    Edit tag
                  </Text>
                </div>
                <ChevronRightIcon className="w-2.5 h-2.5" />
              </button>
              <button className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2">
                <div
                  className="flex items-center space-x-1"
                  onClick={() => {
                    downloadAsPDF(id, title);
                  }}
                >
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
                onDeleteNote(true, id);
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
  useEffect(() => {
    // console.log('new tags loaded: ', newTags);
  }, [newTags]);

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle h-screen sm:px-6 lg:px-8 z-10">
            <div className="relative">
              <div className="table-columns  fixed bottom-[80px] right-[36%] left-[36%]">
                {selectedPeople.length > 0 || allChecked ? (
                  <div className="top-0 border px-4 py-8 text-sm rounded-md flex h-12 items-center justify-between space-x-3 w-[600px] bg-white sm:left-12">
                    <p className="text-gray-600">
                      {selectedPeople.length} items selected
                    </p>

                    <div className="flex items-center space-x-4">
                      <button
                        className="text-gray-600"
                        onClick={handleSelectAll}
                      >
                        {allChecked ? 'Deselect all' : 'Select all'}
                      </button>

                      <Menu>
                        {selectedPeople.length > 1 || allChecked ? (
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
                            onClick={() => {
                              if (selectedNoteIdToAddTagsArray) {
                                onAddTagToMultipleNotes(
                                  true,
                                  selectedNoteIdToAddTagsArray,
                                  newTags
                                );
                              }
                            }}
                          >
                            <FlashCardsSolidIcon
                              className="w-5"
                              onClick={undefined}
                            />
                            Add tags to all notes
                          </StyledMenuButton>
                        ) : (
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
                            onClick={() => {
                              if (setSelectedNoteIdToAddTags) {
                                onAddTag(
                                  true,
                                  selectedNoteIdToAddTags,
                                  newTags
                                );
                                setSelectedNoteIdToAddTags(null);
                              }
                            }}
                          >
                            <FlashCardsSolidIcon
                              className="w-5"
                              onClick={undefined}
                            />
                            Add tag
                          </StyledMenuButton>
                        )}
                      </Menu>

                      {tagAllNoteModal && (
                        <TagModal
                          onSubmit={AddAllNoteTags}
                          isOpen={tagAllNoteModal}
                          onClose={() => setTagAllNoteModal(false)}
                          tags={tags}
                          inputValue={inputValue}
                          handleAddTag={handleAddTag}
                          newTags={newTags}
                          setNewTags={setNewTags}
                          setInputValue={setInputValue}
                        />
                      )}
                    </div>

                    {selectedPeople.length > 1 || allChecked ? (
                      <button
                        type="button"
                        className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        onClick={() => {
                          if (selectedNoteIdToDeleteArray) {
                            onDeleteAllNote(true, selectedNoteIdToDeleteArray);
                            setSelectedNoteIdToDeleteArray([]);
                          }
                        }}
                      >
                        <TrashIcon className="w-5" onClick={undefined} />
                        <span>Delete All</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        onClick={() => {
                          if (selectedNoteIdToDelete) {
                            onDeleteNote(true, selectedNoteIdToDelete);
                            setSelectedNoteIdToDelete(null);
                          }
                        }}
                      >
                        <TrashIcon className="w-5" onClick={undefined} />
                        <span>Delete</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg bg-white px-6 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      onClick={Done}
                    >
                      Done
                    </button>
                  </div>
                ) : null}
              </div>
              <SelectableTable
                columns={clientColumn}
                dataSource={dataSource}
                isSelectable
                fileImage
                onSelect={(e) => setSelectedPeople(e)}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                handleSelectAll={handleSelectAll}
                allChecked={allChecked}
                setAllChecked={setAllChecked}
                setSelectedNoteIdToDelete={setSelectedNoteIdToDelete}
                selectedNoteIdToDelete={selectedNoteIdToDelete}
                setSelectedNoteIdToDeleteArray={setSelectedNoteIdToDeleteArray}
                selectedNoteIdToDeleteArray={selectedNoteIdToDeleteArray}
                selectedNoteIdToAddTagsArray={selectedNoteIdToAddTagsArray}
                setSelectedNoteIdToAddTagsArray={
                  setSelectedNoteIdToAddTagsArray
                }
                selectedNoteIdToAddTags={selectedNoteIdToAddTags}
                setSelectedNoteIdToAddTags={setSelectedNoteIdToAddTags}
              />
            </div>
          </div>
        </div>
      </div>
      {openTagsModal && (
        <TagModal
          onSubmit={() => AddTag(newTags)}
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
      <NoteModal
        title="Delete Notes"
        description="Are you sure you want to delete Note?"
        isLoading={isLoading}
        isOpen={deleteNoteModal}
        onCancel={() => onCancel()}
        onDelete={() => DeleteNote()}
        onClose={() => setDeleteNoteModal(false)}
      />
      <NoteModal
        title="Delete All Notes"
        description="Are you sure you want to delete all the marked Notes?"
        isLoading={isLoading}
        isOpen={deleteAllNoteModal}
        onCancel={() => {
          setDeleteAllNoteModal(!deleteAllNoteModal);
          setSelectedRowKeys([]);
          setSelectedPeople([]);
        }}
        onDelete={() => DeleteAllNote()}
        onClose={() => setDeleteAllNoteModal(!deleteAllNoteModal)}
      />
    </>
  );
};

export default AllNotesTab;
