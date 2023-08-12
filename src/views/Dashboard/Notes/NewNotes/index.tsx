import { ReactComponent as AddTag } from '../../../../assets/addTag.svg';
import { ReactComponent as BackArrow } from '../../../../assets/backArrowFill.svg';
import { ReactComponent as DocIcon } from '../../../../assets/doc.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/download.svg';
import { ReactComponent as FlashCardIcn } from '../../../../assets/flashCardIcn.svg';
import { ReactComponent as PinIcon } from '../../../../assets/pin.svg';
import { ReactComponent as SideBarPinIcn } from '../../../../assets/sideBarPin.svg';
import { ReactComponent as ArrowRight } from '../../../../assets/small-arrow-right.svg';
import { ReactComponent as ZoomIcon } from '../../../../assets/square.svg';
import { ReactComponent as TrashIcon } from '../../../../assets/trash-icn.svg';
import CustomButton from '../../../../components/CustomComponents/CustomButton';
import { storage } from '../../../../firebase';
import { MAX_FILE_UPLOAD_LIMIT } from '../../../../helpers/constants';
import { saveMarkdownAsPDF } from '../../../../library/fs';
import {
  processDocument,
  uploadBlockNoteDocument
} from '../../../../services/AI';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import TagModal from '../../FlashCards/components/TagModal';
import { NoteModal } from '../Modal';
import {
  NoteDetails,
  NoteServerResponse,
  WorkerCallback,
  WorkerProcess
} from '../types';
import {
  DropDownFirstPart,
  DropDownLists,
  FirstSection,
  Header,
  HeaderButton,
  HeaderButtonText,
  NewNoteWrapper,
  NoteBody,
  PDFWrapper,
  FullScreenNoteWrapper,
  SecondSection
} from './styles';
import { initNoteIngestWorker } from './worker/ingest';
import { Block, BlockNoteEditor } from '@blocknote/core';
import '@blocknote/core/style.css';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import {
  Menu,
  MenuList,
  MenuButton,
  Button,
  AlertStatus,
  ToastPosition
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FaEllipsisH } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const DEFAULT_NOTE_TITLE = 'Enter Note Title';
const DELETE_NOTE_TITLE = 'Delete Note';
const UPDATE_NOTE_TITLE = 'Note Alert';
const NOTE_STORAGE_KEY = 'note';

// Define the type for the pinned note
type PinnedNote = {
  noteId: string | null;
  pinnedNoteJSON: any;
};

type Toast = (...args: any) => void;

const createNote = async (data: any): Promise<NoteServerResponse | null> => {
  const resp = await ApiService.createNote(data);
  const respText = await resp.text();
  try {
    const respDetails: NoteServerResponse = JSON.parse(respText);
    return respDetails;
  } catch (error: any) {
    return { error: error.message, message: error.message };
  }
};

const deleteNote = async (id: string): Promise<NoteServerResponse | null> => {
  const resp = await ApiService.deleteNote(id);
  const respText = await resp.text();
  try {
    const respDetails: NoteServerResponse = JSON.parse(respText);
    return respDetails;
  } catch (error: any) {
    return { error: error.message, message: error.message };
  }
};

const updateNote = async (
  id: string,
  data: any
): Promise<NoteServerResponse | null> => {
  const resp = await ApiService.updateNote(id, data);
  const respText = await resp.text();
  try {
    const respDetails: NoteServerResponse = JSON.parse(respText);
    return respDetails;
  } catch (error: any) {
    return { error: error.message, message: error.message };
  }
};

// const extractEditorContent = (noteDetails: NoteDetails | null): string[] | null => {

//   if (!noteDetails) {
//     return null;
//   }
//   console.log("notes: ", noteDetails.note);
//   let contentArray: string[] = [];

//   try {
//     const noteList = JSON.parse(noteDetails.note);
//     noteList.forEach((block: Block<any>) => {
//       if (block.children === "text") {
//         // contentArray = contentArray.concat(block);
//         contentArray = contentArray.concat(block.content[0].t);
//       } else {
//         // continue list
//       }
//       return true;
//     });
//   } catch (error: any) {
//     console.log(error.message);
//   }

//   return contentArray;
// };

const extractEditorContent = (
  noteDetails: NoteDetails | null
): string[] | null => {
  if (!noteDetails) {
    return null;
  }
  try {
    const notes: Array<any> = JSON.parse(noteDetails.note);
    const textArray: string[] = [];

    const traverseNote = (note: any) => {
      if (note.type === 'text') {
        console.log('cur note found: ' + note);
        if (note.content && note.content[0]?.text) {
          alert('test found: ' + note.content[0].text);
          textArray.push(note.content[0].text);
        }
      }

      if (note.children && note.children.length > 0) {
        for (const child of note.children) {
          traverseNote(child);
        }
      }
    };

    for (const note of notes) {
      traverseNote(note);
    }

    return textArray;
  } catch (error: any) {
    return null;
  }
};

const ingestEditorContent = async (
  noteDetails: NoteDetails,
  callBack: WorkerCallback
) => {
  const editorContentArray = extractEditorContent(noteDetails);
  console.log('editor content extracted', editorContentArray);
  const worker = initNoteIngestWorker(callBack);
  if (!editorContentArray || editorContentArray.length <= 0) {
    // log
    return;
  }

  //post request data
  // worker.postMessage(editorContentArray);

  const resp = await uploadBlockNoteDocument({
    studentId: noteDetails.user._id,
    documentId: noteDetails._id,
    document: editorContentArray ?? ['sample', 'hello'],
    title: noteDetails.topic,
    tags: noteDetails.tags
    // courseId?: string;
  });
  console.log('response:', resp);

  // const respText = await resp.text();
  // try {
  //   const respDetails: NoteServerResponse = JSON.parse(respText);
  //   return respDetails;
  // } catch (error: any) {
  //   return { error: error.message, message: error.message };
  // }
};

const formatDate = (date: Date, format = 'DD ddd, hh:mma'): string => {
  return moment(date).format(format);
};

const saveNoteLocal = (noteId: string, noteContent: string) => {
  const storeId = getLocalStorageNoteId(noteId);
  return localStorage.setItem(storeId, noteContent);
};

const getNoteLocal = (noteId: string | null): string | null => {
  const storageId = getLocalStorageNoteId(noteId);
  const content = localStorage.getItem(storageId);
  return content;
};

const getLocalStorageNoteId = (noteId: string | null): string => {
  const genId = noteId ? noteId : '';
  return genId;
};

const handleOptionClick = (
  onClick: ((...args: any[]) => void) | undefined,
  ...params: any
) => {
  if (typeof onClick === 'function') {
    onClick.call(null, ...(params || []));
  }
};

const NewNote = () => {
  const [deleteNoteModal, setDeleteNoteModal] = useState(false);
  const defaultNoteTitle = DEFAULT_NOTE_TITLE;

  const [saveDetails, setSaveDetails] =
    useState<NoteServerResponse<NoteDetails> | null>(null);
  const [pinnedNotes, setPinnedNotes] = useState<PinnedNote[]>([]);

  const toast = useToast();
  const params = useParams();
  const [noteParamId, setNoteParamId] = useState<string | null>(
    params.id ?? null
  );
  const [openTags, setOpenTags] = useState<boolean>(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [saveButtonState, setSaveButtonState] = useState<boolean>(true);
  const [editedTitle, setEditedTitle] = useState(defaultNoteTitle);
  const [currentTime, setCurrentTime] = useState<string>(
    formatDate(new Date())
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [initialContent, setInitialContent] = useState<any>(
    getNoteLocal(noteParamId)
  );
  const [editorStyle, setEditorStyle] = useState<any>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const editor: BlockNoteEditor | null = useBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined
  });

  const [isLoading, setIsLoading] = useState(false);

  const [tags, setTags] = useState<string[]>([]);
  const [newTags, setNewTags] = useState<string[]>(tags);
  const [inputValue, setInputValue] = useState('');

  const inputContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [loadingDoc, setLoadingDoc] = useState(false);
  const { userDocuments } = userStore();
  const [studentDocuments, setStudentDocuments] = useState<Array<any>>([]);

  useEffect(() => {
    if (userDocuments.length) {
      setStudentDocuments(userDocuments);
    }
  }, [userDocuments]);

  const onCancel = () => {
    setDeleteNoteModal(!deleteNoteModal);
  };

  const onDeleteNoteBtn = () => {
    setDeleteNoteModal(true);
  };

  const downloadAsPDF = async () => {
    if (!noteId || !editor) {
      return showToast(
        UPDATE_NOTE_TITLE,
        'Cannot download note. Please select a note',
        'error'
      );
    }
    const noteMarkdown: string = await editor.blocksToMarkdown(
      editor.topLevelBlocks
    );
    if (!noteMarkdown) {
      return showToast(
        UPDATE_NOTE_TITLE,
        'Could not extract note content. Please try again',
        'error'
      );
    }
    // use note name also in other
    const noteName = `${editedTitle}`;
    saveMarkdownAsPDF(noteName, noteMarkdown);
  };

  const onSaveNote = async () => {
    if (!editor) return;

    // get editor's content
    let noteJSON: string;

    try {
      noteJSON = JSON.stringify(editor.topLevelBlocks);
    } catch (error: any) {
      return showToast(
        UPDATE_NOTE_TITLE,
        'Oops! Could not get note content',
        'error'
      );
    }

    if (!editedTitle || editedTitle === defaultNoteTitle) {
      return showToast(UPDATE_NOTE_TITLE, 'Enter note title', 'error');
    }
    if (!editorHasContent(editor)) {
      return showToast(UPDATE_NOTE_TITLE, 'Note is empty', 'error');
    }

    setSaveButtonState(false);

    let saveDetails: NoteServerResponse<NoteDetails> | null;

    if (noteId && noteId !== '') {
      saveDetails = await updateNote(noteId, {
        topic: editedTitle,
        note: noteJSON
      });
    } else {
      saveDetails = await createNote({
        topic: editedTitle,
        note: noteJSON
      });
    }
    if (!saveDetails) {
      setSaveButtonState(true);
      return showToast(
        UPDATE_NOTE_TITLE,
        'An unknown error occurs while updating note. Try again',
        'error'
      );
    }
    if (saveDetails.error) {
      setSaveButtonState(true);
      return showToast(UPDATE_NOTE_TITLE, saveDetails.error, 'error');
    } else {
      if (!saveDetails?.data) {
        setSaveButtonState(true);
        return showToast(
          UPDATE_NOTE_TITLE,
          'Could not get note data, please try again',
          'error'
        );
      }
      // Save noteID to state if this is a new note and save locally
      if (!noteId) {
        const newNoteId = saveDetails.data['_id'];
        setNoteId(newNoteId);
        saveNoteLocal(getLocalStorageNoteId(newNoteId), saveDetails.data.note);
      } else {
        saveNoteLocal(getLocalStorageNoteId(noteId), saveDetails.data.note);
      }
      // save note details and other essential params
      setCurrentTime(formatDate(saveDetails.data.updatedAt));
      showToast(UPDATE_NOTE_TITLE, saveDetails.message, 'success');
      setSaveButtonState(true);
      setSaveDetails(saveDetails);

      // after successfully saving the note content, we must call the API service to ingest
      // Ingestion will run in the background

      const callback = (data: any) => {
        alert('call back fetching:');
        console.log('callback: ', data);
      };
      ingestEditorContent(saveDetails.data, callback);
    }
  };

  const onDeleteNote = async () => {
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
    // console.log('details : ', details);

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
      handleBackClick();
      setDeleteNoteModal(false);
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setEditedTitle(defaultNoteTitle);
      setNoteId('');
      clearEditor(editor);
    }
  };

  const getNoteById = async () => {
    if (!noteParamId) {
      return;
    }
    const resp = await ApiService.getNote(noteParamId);
    const respText = await resp.text();
    try {
      const respDetails: NoteServerResponse<NoteDetails> = JSON.parse(respText);
      if (!respDetails || respDetails.error || !respDetails.data) {
        showToast(
          UPDATE_NOTE_TITLE,
          respDetails.error ?? respDetails.message
            ? respDetails.message
            : 'Cannot load note details',
          'error'
        );
        return;
      }
      if (respDetails.data) {
        const note = respDetails.data;
        if (note._id && note.topic && note.note) {
          setEditedTitle(note.topic);
          setCurrentTime(formatDate(note.updatedAt));
          setInitialContent(note.note);
          setSaveDetails(respDetails);
          setNoteId(note._id);
        }
      }
      // set note data
    } catch (error: any) {
      showToast(UPDATE_NOTE_TITLE, error.message, 'error');
      return;
    }
  };

  const handleTitleChange = (event: any) => {
    setIsEditingTitle(true);
    const value = event.target.value;
    setEditedTitle(value);
  };

  const updateTitle = () => {
    setIsEditingTitle(false);
    if (editedTitle) {
      setEditedTitle(editedTitle.trim());
    } else {
      setEditedTitle(defaultNoteTitle);
    }
  };

  const savePinnedNoteLocal = (pinnedNotesArray: any) => {
    const storageId = 'pinned_notes'; // Unique identifier for the array in local storage
    localStorage.setItem(storageId, JSON.stringify(pinnedNotesArray));
  };

  // Function to toggle pin state when the pin icon is clicked
  const handlePinClick = () => {
    if (!saveDetails) {
      return showToast(
        UPDATE_NOTE_TITLE,
        'Please ensure note is loaded ',
        'error'
      );
    }
    // setIsPinned((prevIsPinned) => !prevIsPinned);
    // Save the note to local storage when pinned
    if (saveDetails?.data) {
      if (isNoteAlreadyPinned(saveDetails.data._id)) {
        return showToast(UPDATE_NOTE_TITLE, 'Note already pinned', 'warning');
      }
      const updatedPinnedNotes = [
        ...pinnedNotes,
        {
          noteId: saveDetails?.data['_id'],
          pinnedNoteJSON: saveDetails
        }
      ];
      setPinnedNotes(updatedPinnedNotes);
      savePinnedNoteLocal(updatedPinnedNotes);
      return showToast(UPDATE_NOTE_TITLE, 'Note pinned', 'success');
    }
  };

  const isNoteAlreadyPinned = (noteId: string): boolean => {
    for (const note of pinnedNotes) {
      if (note.noteId === noteId) {
        return true;
      }
    }
    return false;
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

  const handleFocusOut = () => {
    // Check if the click event target is inside the inputContainerRef
    if (
      inputContainerRef.current &&
      !inputContainerRef.current.contains(document.activeElement as Node) // Type assertion here
    ) {
      updateTitle();
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      updateTitle();
    }
  };

  const handleHeaderClick = () => {
    if (editedTitle === defaultNoteTitle) {
      setEditedTitle('');
    }
    setIsEditingTitle(true);
  };

  const editorHasContent = (editor: BlockNoteEditor | null): boolean => {
    if (!editor) {
      return false;
    }
    let contentFound = false;
    for (const block of editor.topLevelBlocks) {
      if (block.content.length > 0) {
        contentFound = true;
        break;
      }
    }
    return contentFound;
  };

  const clearEditor = (editor: BlockNoteEditor | null) => {
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

  const toggleEditorView = () => {
    if (!editorStyle) {
      setEditorStyle({
        position: 'absolute',
        // width: '100vw',
        width: '100%',
        height: '100vh',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1000
      });
      setIsFullScreen(true);
    } else {
      setEditorStyle(null);
      setIsFullScreen(false);
    }
  };

  const handleWindowKey = (event: any) => {
    if (event && event.key) {
      const eventValue = event.key as string;
      if (eventValue.toLowerCase() === 'escape' && editorStyle) {
        // editor is in full screen mode. we must close editor
        toggleEditorView();
      }
    }
  };

  const showTagsDropdown = () => {
    setOpenTags((prevState) => !prevState);
  };

  const goToDocChat = async (documentUrl, docTitle) => {
    try {
      navigate('/dashboard/docchat', {
        state: {
          documentUrl,
          docTitle
        }
      });
      // window.location.reload();
    } catch (error) {
      setLoadingDoc(false);
    }
  };

  const proceed = async () => {
    setLoadingDoc(true);

    const url = studentDocuments[0]?.documentURL;
    const name = studentDocuments[0]?.title;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await goToDocChat(url, name);
    } catch (error) {
      // Handle error
    } finally {
      setLoadingDoc(false);
    }
  };

  const dropDownOptions = [
    {
      id: 1,
      leftIcon: <FlashCardIcn />,
      title: 'Flashcards',
      rightIcon: <ArrowRight />
    },
    {
      id: 2,
      leftIcon: <AddTag />,
      title: 'Add tag',
      rightIcon: <ArrowRight />,
      onClick: showTagsDropdown
    },
    {
      id: 3,
      leftIcon: <SideBarPinIcn />,
      title: 'Pin to sidebar',
      rightIcon: <ArrowRight />,
      onClick: handlePinClick
    },
    {
      id: 4,
      leftIcon: <DocIcon />,
      title: loadingDoc ? 'Uploading...' : 'Doc Chat',
      rightIcon: <ArrowRight />,
      onClick: proceed
    },
    {
      id: 5,
      leftIcon: <DownloadIcon />,
      title: 'Download',
      rightIcon: <ArrowRight />,
      onClick: downloadAsPDF
    },
    {
      id: 6,
      leftIcon: <TrashIcon />,
      title: 'Delete',
      onClick: onDeleteNoteBtn
    }
  ];
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

  const AddTags = async () => {
    const noteIdInUse = noteId ?? noteParamId;

    if (!noteIdInUse || noteIdInUse === '') {
      setOpenTags(false);
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }

    const details = await addTag(noteIdInUse, newTags);

    if (!details) {
      setOpenTags(false);
      return showToast(
        DELETE_NOTE_TITLE,
        'An unknown error occurs while adding tag. Try again',
        'error'
      );
    }

    if (details.error) {
      setOpenTags(false);
      return showToast(DELETE_NOTE_TITLE, details.error, 'error');
    } else {
      setOpenTags(false);
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setNoteId('');
      clearEditor(editor);
      setTags(details.data.tags);
    }
    // console.log({ tag: details.data.tags, tags });
  };

  const handleAddTag = () => {
    const value = inputValue.toLowerCase().trim();
    if (inputValue && !newTags.includes(value)) {
      setNewTags([...newTags, value]);
    }
    setInputValue('');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Load notes if noteID is provided via param
  useEffect(() => {
    getNoteById();
    // event for escape to minimize window
    window.addEventListener('keypress', handleWindowKey);
    return () => {
      window.removeEventListener('keypress', handleWindowKey);
    };
  }, []);

  return (
    <>
      {isFullScreen ? (
        <NewNoteWrapper {...editorStyle}>
          <FullScreenNoteWrapper>
            {isFullScreen ? (
              <HeaderButton onClick={handleBackClick}>
                <BackArrow />
                <HeaderButtonText> Back</HeaderButtonText>
              </HeaderButton>
            ) : null}
            <Header>
              <FirstSection>
                {isFullScreen ? (
                  <div className="zoom__icn" onClick={toggleEditorView}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="18"
                      viewBox="0 0 20 18"
                      fill="none"
                    >
                      <path
                        d="M15.4997 4.41667H19.1663V6.25H13.6663V0.75H15.4997V4.41667ZM6.33301 6.25H0.833008V4.41667H4.49967V0.75H6.33301V6.25ZM15.4997 13.5833V17.25H13.6663V11.75H19.1663V13.5833H15.4997ZM6.33301 11.75V17.25H4.49967V13.5833H0.833008V11.75H6.33301Z"
                        fill="#7E8591"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="zoom__icn" onClick={toggleEditorView}>
                    <ZoomIcon />
                  </div>
                )}
                <div onClick={handleHeaderClick} ref={inputContainerRef}>
                  <div className="doc__name">
                    {isEditingTitle ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={handleTitleChange}
                        onBlur={handleFocusOut}
                        onKeyDown={handleKeyDown}
                        autoFocus
                      />
                    ) : (
                      <>{editedTitle}</>
                    )}
                  </div>
                </div>
                <div className="timestamp">
                  <p>Updated {currentTime}</p>
                </div>
              </FirstSection>
              <SecondSection>
                <CustomButton
                  disabled={!saveButtonState}
                  isPrimary
                  title={!saveButtonState ? 'Saving...' : 'Save'}
                  type="button"
                  onClick={onSaveNote}
                  active={saveButtonState}
                />
                <div className="pin__icn" onClick={handlePinClick}>
                  <PinIcon />
                </div>
                <div>
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
                      fontSize="0.875rem"
                      minWidth={'185px'}
                      borderRadius="8px"
                      backgroundColor="#FFFFFF"
                      boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
                    >
                      <section>
                        {dropDownOptions?.map((dropDownOption) => (
                          <DropDownLists key={dropDownOption.id}>
                            <DropDownFirstPart
                              onClick={() =>
                                handleOptionClick(dropDownOption.onClick)
                              }
                            >
                              <div>
                                {dropDownOption.leftIcon}
                                <p
                                  style={{
                                    color:
                                      dropDownOption.title === 'Delete'
                                        ? '#F53535'
                                        : ''
                                  }}
                                >
                                  {dropDownOption.title}
                                </p>
                              </div>
                              <div>{dropDownOption.rightIcon}</div>
                            </DropDownFirstPart>
                          </DropDownLists>
                        ))}
                      </section>
                    </MenuList>
                  </Menu>

                  {openTags && (
                    <TagModal
                      onSubmit={AddTags}
                      isOpen={openTags}
                      onClose={() => setOpenTags(false)}
                      tags={tags}
                      inputValue={inputValue}
                      handleAddTag={handleAddTag}
                      newTags={newTags}
                      setNewTags={setNewTags}
                      setInputValue={setInputValue}
                    />
                  )}
                </div>
              </SecondSection>
            </Header>
            <NoteBody>
              <BlockNoteView editor={editor} />
              {/* We will show PDF once endpoint is implemented */}
              {/* <PDFWrapper>
          <PDFViewer
            url={"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
            page={1} />
        </PDFWrapper> */}
            </NoteBody>
            <NoteModal
              title="Delete Note"
              description="This will delete Note. Are you sure?"
              isLoading={isLoading}
              isOpen={deleteNoteModal}
              actionButtonText="Delete"
              onCancel={() => onCancel()}
              onDelete={() => onDeleteNote()}
              onClose={() => setDeleteNoteModal(false)}
            />
          </FullScreenNoteWrapper>
        </NewNoteWrapper>
      ) : (
        <NewNoteWrapper {...editorStyle}>
          {isFullScreen ? (
            <HeaderButton onClick={handleBackClick}>
              <BackArrow />
              <HeaderButtonText> Back</HeaderButtonText>
            </HeaderButton>
          ) : null}

          <Header>
            <FirstSection>
              {isFullScreen ? (
                <div className="zoom__icn" onClick={toggleEditorView}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="18"
                    viewBox="0 0 20 18"
                    fill="none"
                  >
                    <path
                      d="M15.4997 4.41667H19.1663V6.25H13.6663V0.75H15.4997V4.41667ZM6.33301 6.25H0.833008V4.41667H4.49967V0.75H6.33301V6.25ZM15.4997 13.5833V17.25H13.6663V11.75H19.1663V13.5833H15.4997ZM6.33301 11.75V17.25H4.49967V13.5833H0.833008V11.75H6.33301Z"
                      fill="#7E8591"
                    />
                  </svg>
                </div>
              ) : (
                <div className="zoom__icn" onClick={toggleEditorView}>
                  <ZoomIcon />
                </div>
              )}
              <div onClick={handleHeaderClick} ref={inputContainerRef}>
                <div className="doc__name">
                  {isEditingTitle ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={handleTitleChange}
                      onBlur={handleFocusOut}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  ) : (
                    <>{editedTitle}</>
                  )}
                </div>
              </div>
              <div className="timestamp">
                <p>Updated {currentTime}</p>
              </div>
            </FirstSection>
            <SecondSection>
              <CustomButton
                disabled={!saveButtonState}
                isPrimary
                title={!saveButtonState ? 'Saving...' : 'Save'}
                type="button"
                onClick={onSaveNote}
                active={saveButtonState}
              />
              <div className="pin__icn" onClick={handlePinClick}>
                <PinIcon />
              </div>
              <div>
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
                    fontSize="0.875rem"
                    minWidth={'185px'}
                    borderRadius="8px"
                    backgroundColor="#FFFFFF"
                    boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
                  >
                    <section>
                      {dropDownOptions?.map((dropDownOption) => (
                        <DropDownLists key={dropDownOption.id}>
                          <DropDownFirstPart
                            onClick={() =>
                              handleOptionClick(dropDownOption.onClick)
                            }
                          >
                            <div>
                              {dropDownOption.leftIcon}
                              <p
                                style={{
                                  color:
                                    dropDownOption.title === 'Delete'
                                      ? '#F53535'
                                      : ''
                                }}
                              >
                                {dropDownOption.title}
                              </p>
                            </div>
                            <div>{dropDownOption.rightIcon}</div>
                          </DropDownFirstPart>
                        </DropDownLists>
                      ))}
                    </section>
                  </MenuList>
                </Menu>

                {openTags && (
                  <TagModal
                    onSubmit={AddTags}
                    isOpen={openTags}
                    onClose={() => setOpenTags(false)}
                    tags={tags}
                    inputValue={inputValue}
                    handleAddTag={handleAddTag}
                    newTags={newTags}
                    setNewTags={setNewTags}
                    setInputValue={setInputValue}
                  />
                )}
              </div>
            </SecondSection>
          </Header>
          <NoteBody>
            <BlockNoteView editor={editor} />
            {/* We will show PDF once endpoint is implemented */}
            {/* <PDFWrapper>
          <PDFViewer
            url={"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
            page={1} />
        </PDFWrapper> */}
          </NoteBody>

          <NoteModal
            title="Delete Note"
            description="This will delete Note. Are you sure?"
            isLoading={isLoading}
            isOpen={deleteNoteModal}
            actionButtonText="Delete"
            onCancel={() => onCancel()}
            onDelete={() => onDeleteNote()}
            onClose={() => setDeleteNoteModal(false)}
          />
        </NewNoteWrapper>
      )}
    </>
  );
};

export default NewNote;
