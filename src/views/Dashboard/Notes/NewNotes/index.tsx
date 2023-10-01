import { ReactComponent as AddTag } from '../../../../assets/addTag.svg';
import { ReactComponent as BackArrow } from '../../../../assets/backArrowFill.svg';
import { ReactComponent as DocIcon } from '../../../../assets/doc.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/download.svg';
import { ReactComponent as FlashCardIcn } from '../../../../assets/flashCardIcn.svg';
import { ReactComponent as SideBarPinIcn } from '../../../../assets/sideBarPin.svg';
import { ReactComponent as ArrowRight } from '../../../../assets/small-arrow-right.svg';
import { ReactComponent as ZoomIcon } from '../../../../assets/square.svg';
import { ReactComponent as TrashIcon } from '../../../../assets/trash-icn.svg';
import CustomButton from '../../../../components/CustomComponents/CustomButton';
import TableTag from '../../../../components/CustomComponents/CustomTag';
import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import TagModal from '../../../../components/TagModal';
import useDebounce from '../../../../hooks/useDebounce';
import {
  // saveMarkdownAsPDF,
  saveHTMLAsPDF
} from '../../../../library/fs';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import TempPDFViewer from '../../DocChat/TempPDFViewer';
import FlashModal from '../../FlashCards/components/FlashModal';
import { NoteModal } from '../Modal';
import {
  NoteData,
  NoteDetails,
  NoteEnums,
  NoteServerResponse,
  NoteStatus
} from '../types';
import LexicalEditor from './LexicalEditor';
import './editor.css';

import {
  DropDownFirstPart,
  DropDownLists,
  FirstSection,
  Header,
  HeaderButton,
  HeaderWrapper,
  HeaderButtonText,
  NewNoteWrapper,
  NoteBody,
  HeaderTagsWrapper,
  FullScreenNoteWrapper,
  SecondSection
} from './styles';
import '@blocknote/core/style.css';
import {
  Menu,
  MenuList,
  MenuButton,
  Button,
  AlertStatus,
  ToastPosition
} from '@chakra-ui/react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  CLEAR_EDITOR_COMMAND // $createParagraphNode,
  // $getSelection,
  // $createTextNode
} from 'lexical';
import { defaultTo, isEmpty, isNil } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { BsFillPinFill } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';
import {
  useLocation,
  useNavigate,
  useParams,
  useBeforeUnload
} from 'react-router-dom';

// import LexicalEditor from './LexicalEditor';
// import html2pdf from 'html2pdf.js';
// import { uploadBlockNoteDocument } from '../../../../services/AI';
// import { useToast } from '@chakra-ui/react';
// import { Block, BlockNoteEditor } from '@blocknote/core';
// import { BlockNoteView, useBlockNote } from '@blocknote/react';
// import { init } from '@sentry/browser';

// import LexicalEditor from './LexicalEditor';
// import html2pdf from 'html2pdf.js';
// import { uploadBlockNoteDocument } from '../../../../services/AI';
// import { useToast } from '@chakra-ui/react';
// import { Block, BlockNoteEditor } from '@blocknote/core';
// import { BlockNoteView, useBlockNote } from '@blocknote/react';
// import { init } from '@sentry/browser';

// import {
//   // Editor as LexicalEditor,
//   EditorContext as LexicalEditorContextProvider
// } from 'shepherd-editor';

const DEFAULT_NOTE_TITLE = 'Enter Note Title';
const DELETE_NOTE_TITLE = 'Delete Note';
const UPDATE_NOTE_TITLE = 'Note Alert';

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

// Define the type for the pinned note
type PinnedNote = {
  noteId: string | null;
  pinnedNoteJSON: any;
};

const createNote = async (
  data: NoteData
): Promise<NoteServerResponse | null> => {
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
  data: NoteData
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

  const toast = useCustomToast();
  const params = useParams();
  const location = useLocation();
  const [noteParamId, setNoteParamId] = useState<string | null>(null);
  const [openTags, setOpenTags] = useState<boolean>(false);
  const [openFlashCard, setOpenFlashCard] = useState<boolean>(false);
  const [noteId, setNoteId] = useState<any | null>(null);
  const [saveButtonState, setSaveButtonState] = useState<boolean>(true);
  const [editedTitle, setEditedTitle] = useState(defaultNoteTitle);
  const editedTitleRef = useRef<any>(null);
  const draftNoteId = useRef<any>();
  const [currentTime, setCurrentTime] = useState<string>(
    formatDate(new Date())
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [initialContent, setInitialContent] = useState<string | null>('');
  const [editorStyle, setEditorStyle] = useState<any>({});
  const [isFullScreen, setIsFullScreen] = useState(false);

  // const editor: BlockNoteEditor | null = useBlockNote({
  //   initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  //   onEditorContentChange: (editor) => handleAutoSave(editor)
  // });

  const [editor] = useLexicalComposerContext();

  const [isLoading, setIsLoading] = useState(false);

  const [tags, setTags] = useState<string[]>([]);
  const [newTags, setNewTags] = useState<string[]>(tags);
  const [inputValue, setInputValue] = useState('');

  const inputContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [loadingDoc, setLoadingDoc] = useState(false);
  const { userDocuments } = userStore();
  const [studentDocuments, setStudentDocuments] = useState<Array<any>>([]);
  const [pinned, setPinned] = useState<boolean>(false);
  const debounce = useDebounce(1000, 10);

  const onCancel = () => {
    setDeleteNoteModal(!deleteNoteModal);
  };

  const onDeleteNoteBtn = () => {
    setDeleteNoteModal(true);
  };

  const downloadAsPDF = async () => {
    if (editor.getEditorState().isEmpty()) {
      // if (!noteId || !editor.getEditorState().isEmpty()) {
      return showToast(
        UPDATE_NOTE_TITLE,
        'Cannot download note. Please select a note',
        'error'
      );
    }

    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      saveHTMLAsPDF(editedTitle, htmlString);
    });
  };

  const onSaveNote = async () => {
    if (!editor) return;

    // get editor's content
    let noteJSON = '';

    try {
      const editorJson = await editor?.getEditorState().toJSON();
      noteJSON = JSON.stringify(editorJson);
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
    if (!editorHasContent()) {
      return showToast(UPDATE_NOTE_TITLE, 'Note is empty', 'error');
    }

    setSaveButtonState(false);

    let saveDetails: NoteServerResponse<NoteDetails> | null;

    if (!isEmpty(noteId)) {
      saveDetails = await updateNote(noteId, {
        topic: editedTitle,
        note: noteJSON,
        tags: tags,
        status: NoteStatus.SAVED
      });
    } else {
      saveDetails = await createNote({
        topic: editedTitle,
        note: noteJSON,
        tags: tags,
        status: NoteStatus.SAVED
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
      setSaveDetails(saveDetails);
      setCurrentTime(formatDate(saveDetails.data.updatedAt));
      showToast(UPDATE_NOTE_TITLE, saveDetails.message, 'success');
      setSaveButtonState(true);
      // ingest Note content
      ingestNote(saveDetails.data);
    }
  };

  const onDeleteNote = async () => {
    const noteIdInUse = noteId ?? noteParamId;

    if (isEmpty(noteIdInUse)) {
      setDeleteNoteModal(false);
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }
    setIsLoading(true);

    const details = await deleteNote(noteIdInUse);
    setIsLoading(false);
    if (isEmpty(details) || isNil(details)) {
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
      handleBackClick();
      setDeleteNoteModal(false);
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setEditedTitle(defaultNoteTitle);
      setNoteId('');
      clearEditor();
    }
  };

  const getNoteById = async (paramsIdForNote = noteParamId) => {
    if (isEmpty(paramsIdForNote)) {
      return;
    }
    const resp = await ApiService.getNote(paramsIdForNote as string);

    const respText = await resp.text();
    try {
      const respDetails: NoteServerResponse<{ data: NoteDetails }> =
        JSON.parse(respText);

      const emptyRespDetails =
        isEmpty(respDetails) ||
        isNil(respDetails) ||
        isEmpty(respDetails.data) ||
        isNil(respDetails.data);
      if (emptyRespDetails || respDetails.error) {
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
        const { data: note } = respDetails.data;
        if (note._id && note.topic && note.note) {
          setEditedTitle(note.topic);
          setCurrentTime(formatDate(note.updatedAt));
          setInitialContent(note.note);
          setSaveDetails({ ...respDetails, data: respDetails.data.data });
          setNoteId(note._id);
          setTags(note.tags);
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

  const unPinNote = async () => {
    const noteIdInUse = noteId;
    if (!noteIdInUse || noteIdInUse === '') {
      return showToast(DELETE_NOTE_TITLE, 'No note  to unpin', 'warning');
    }
    try {
      // Remove the deleted note from the dataSource
      const storageId = NoteEnums.PINNED_NOTE_STORE_ID;
      localStorage.removeItem(storageId);
      showToast(DELETE_NOTE_TITLE, 'Note unpinned', 'success');
      setPinned(false);
    } catch (error: any) {
      showToast(DELETE_NOTE_TITLE, error.message, 'error');
    }
  };

  const pinNote = () => {
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
        unPinNote();
        // return showToast(UPDATE_NOTE_TITLE, 'Note already pinned', 'warning');
        return;
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
      setPinned(true);
      return showToast(UPDATE_NOTE_TITLE, 'Note pinned', 'success');
    }
  };

  // Function to toggle pin state when the pin icon is clicked
  const handlePinClick = () => {
    pinNote();
  };

  const isNoteAlreadyPinned = (noteId: string): boolean => {
    for (const note of pinnedNotes) {
      if (note.noteId === noteId) {
        setPinned(true);
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

  const editorHasContent = (): boolean => {
    if (!editor) {
      return false;
    }
    let contentFound = false;
    editor.update(() => {
      const root = $getRoot();

      const children = root.getChildren();

      if (!isEmpty(children)) {
        contentFound = true;
      }
    });

    return contentFound;
  };

  const clearEditor = () => {

    if (editor.getEditorState().isEmpty()) {
      return false;
    }


    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    editor.focus();
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
      title: description ?? title,
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

  const showFlashCardDropdown = () => {
    setOpenFlashCard((prevState) => !prevState);
  };

  const goToNoteChat = async (
    noteUrl: string,
    noteTitle: string,
    content: any
  ) => {
    try {
      navigate('/dashboard/docchat', {
        state: {
          // documentUrl: noteUrl,
          // docTitle: noteTitle,
          noteUrl,
          noteTitle,
          content
        }
      });
    } catch (error) {
      setLoadingDoc(false);
    }
  };

  const proceed = async () => {
    setLoadingDoc(true);
    if (!saveDetails || !saveDetails.data) {
      return showToast(DEFAULT_NOTE_TITLE, 'Note not loaded', 'warning');
    }
    const note = saveDetails.data;
    const url = note.documentId ?? '';
    const topic = note.topic;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await goToNoteChat(url, topic, initialContent);
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
      rightIcon: <ArrowRight />,
      onClick: showFlashCardDropdown
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
    if (editedTitle === '' || editedTitle === defaultNoteTitle) {
      // simply save the note title
      setOpenTags(false);
      return;
    }
    if (!noteIdInUse || noteIdInUse === '') {
      setOpenTags(false);
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }

    const details = await addTag(noteIdInUse, newTags);

    if (!details) {
      setOpenTags(false);
      showToast(
        DELETE_NOTE_TITLE,
        'An unknown error occurs while adding tag. Try again',
        'error'
      );
      return;
    }

    if (details.error) {
      setOpenTags(false);
      showToast(DELETE_NOTE_TITLE, details.error, 'error');
      return;
    } else {
      setOpenTags(false);
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      // setNoteId('');
      // setNewTags([]);
      clearEditor();
    }
  };

  const handleAddTag = () => {
    const value = inputValue.toLowerCase().trim();
    if (inputValue && !newTags.includes(value)) {
      setNewTags([...newTags, value]);
    }
    setInputValue('');
  };

  const handleBackClick = () => {
    clearEditor();
    setTimeout(() => {
      navigate(-1);
    }, 100);
  };

  /**
   * Ingest note content. This sends the note content to the AI service for processing
   */
  const ingestNote = async (noteDetails: NoteDetails) => {
    const noteArrayContent = [noteDetails.note];

    // uploadBlockNoteDocument({
    //   studentId: noteDetails.user._id,
    //   documentId: noteDetails.id,
    //   document: noteArrayContent,
    //   title: noteDetails.topic,
    //   tags: noteDetails.tags
    // }).then((response: AIServiceResponse) => {
    //   if (!response) {
    //     showToast(UPDATE_NOTE_TITLE, 'Could not ingest note', 'warning');
    //     return false;
    //   }
    //   if (!Array.isArray(response.data) || response.data.length <= 0) {
    //     showToast(UPDATE_NOTE_TITLE, 'Could not ingest note', 'warning');
    //   }
    //   // get data documentID is not already updated. Pick the first value in
    //   const documentDetails: NoteDocumentDetails = response.data[0];
    //   if (
    //     !documentDetails?.documentURL ||
    //     documentDetails?.documentURL === ''
    //   ) {
    //     showToast(UPDATE_NOTE_TITLE, 'Could not ingest note', 'warning');
    //   }
    //   // TODO: update with full note details
    //   const resp = ApiService.updateNoteDocumentId(
    //     noteDetails.id,
    //     documentDetails.documentURL
    //   )
    //     .then((response) => {
    //       console.log('update note details: ', response);
    //       showToast(
    //         UPDATE_NOTE_TITLE,
    //         'Note document details saved',
    //         'success'
    //       );
    //     })
    //     .catch((error: any) => {
    //       showToast(
    //         UPDATE_NOTE_TITLE,
    //         'Could not save note document URL',
    //         'error'
    //       );
    //     });
    // });
    // return true;
  };

  const handleAutoSave = useCallback((editor: any) => {
    // use debounce filter
    // TODO: we must move this to web worker
    // additional condition for use to save note details

    const saveLocalCallback = (noteId: string, note: string) => {
      saveNoteLocal(getLocalStorageNoteId(noteId), note);
    };
    // evaluate other conditions to true or false
    const saveCondition = () => true;
    // note save callback wrapper
    const saveCallback = () => {
      autoSaveNote(editor, saveLocalCallback);
    };
    debounce(saveCallback, saveCondition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Auto-save note contents
   *
   * @returns
   */
  const autoSaveNote = async (
    editor: any,
    saveCallback: (noteId: string, note: string) => any
  ) => {
    if (!editor) return;

    const noteTitle = editedTitleRef.current.value ?? editedTitle;

    let noteIdToUse = '';
    let draftNoteIdToUse = '';
    let noteJSON = '';
    let noteStatus: NoteStatus;

    try {
      const editorJson = editor?.getEditorState().toJSON();
      noteJSON = JSON.stringify(editorJson);
    } catch (error: any) {
      return;
    }

    if (noteId || noteParamId) {
      noteIdToUse = noteId ? noteId : noteParamId ?? '';
      noteStatus = NoteStatus.SAVED;
    } else {
      draftNoteIdToUse = draftNoteId.current ? draftNoteId.current.value : '';
      noteStatus = NoteStatus.DRAFT;
    }

    if (noteIdToUse && noteIdToUse !== '') {
      updateNote(noteIdToUse, {
        topic: noteTitle,
        note: noteJSON,
        tags: tags,
        status: noteStatus
      }).then((saveDetails) => {
        // console.log('existing note updated ', saveDetails);
        saveCallback(noteIdToUse, noteJSON);
      });
    } else {
      if (draftNoteIdToUse && draftNoteIdToUse !== '') {
        // update existing draft note
        updateNote(draftNoteIdToUse, {
          topic: noteTitle,
          note: noteJSON,
          tags: newTags,
          status: noteStatus
        }).then((saveDetails) => {
          saveCallback(draftNoteIdToUse, noteJSON);
          // console.log('existing draft note updated ', saveDetails);
        });
      } else {
        // create a new draft note
        createNote({
          topic: noteTitle,
          note: noteJSON,
          tags: newTags,
          status: noteStatus
        }).then((saveDetails) => {
          // console.log('draft note  created ', saveDetails);
          // save new draft note details for update
          if (saveDetails?.data) {
            draftNoteId.current.value = saveDetails.data['_id'];
            saveCallback(draftNoteIdToUse, noteJSON);
          }
        });
      }
    }
  };

  // Load notes if noteID is provided via param
  useEffect(() => {
    // event for escape to minimize window
    window.addEventListener('keypress', handleWindowKey);
    return () => {
      window.removeEventListener('keypress', handleWindowKey);
      clearEditor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pinnedNotesFromLocalStorage = getPinnedNotesFromLocalStorage();
    if (pinnedNotesFromLocalStorage) {
      setPinnedNotes(pinnedNotesFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(params?.id)) {
      setNoteParamId(params?.id as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userDocuments.length) {
      setStudentDocuments(userDocuments);
    }
  }, [userDocuments]);

  useEffect(() => {
    if (editedTitleRef.current && editedTitle !== editedTitleRef.current) {
      editedTitleRef.current.value = editedTitle;
    }
  }, [editedTitle]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        if (process.env.NODE_ENV === 'production') handleAutoSave(editor);
      });
    });
  }, [editor, handleAutoSave]);

  useEffect(() => {
    (async () => {
      if (!isEmpty(noteParamId) || !isNil(noteParamId)) {
        setInitialContent(getNoteLocal(noteParamId) as string);
        await getNoteById();
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteParamId]);

  useEffect(() => {
    const initialValue =
      '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
    if (!isEmpty(initialContent)) {
      const editorState = editor.parseEditorState(
        defaultTo(initialContent, initialValue)
      );
      editor.setEditorState(editorState);
    }
  }, [editor, initialContent]);

  return (
    <>
      <HeaderWrapper>
        <div style={{ display: 'none' }}>
          <input type="text" ref={editedTitleRef} />
          <input type="text" ref={draftNoteId} />
        </div>
        <HeaderButton onClick={handleBackClick}>
          <BackArrow />
          <HeaderButtonText> Back</HeaderButtonText>
        </HeaderButton>
        <HeaderTagsWrapper>{formatTags(tags)}</HeaderTagsWrapper>
      </HeaderWrapper>

      {isFullScreen ? (
        <NewNoteWrapper {...editorStyle}>
          <FullScreenNoteWrapper>
            {location.state?.documentUrl ? (
              ''
            ) : (
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
                  <div onClick={handlePinClick}>
                    <BsFillPinFill
                      className={`pin-icon ${
                        pinnedNotes.some((note) => note.noteId === noteId)
                          ? 'pinned'
                          : 'not-pinned'
                      }`}
                    />
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
                        zIndex={3}
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
            )}

            <NoteBody>
              {location.state?.documentUrl ? (
                <TempPDFViewer
                  pdfLink={location.state.documentUrl}
                  name={location.state.docTitle}
                />
              ) : (
                <div className="note-editor-test">
                  {/* <BlockNoteView editor={editor} /> */}
                  <LexicalEditor />
                  {/* <LexicalEditor editorHistory={initialContent} /> */}
                </div>
              )}
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
        <NewNoteWrapper {...{ ...editorStyle, width: '290mm' }}>
          {location.state?.documentUrl ? (
            ''
          ) : (
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
                <div onClick={handlePinClick}>
                  <BsFillPinFill
                    className={`pin-icon ${
                      pinnedNotes.some((note) => note.noteId === noteId)
                        ? 'pinned'
                        : 'not-pinned'
                    }`}
                  />
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
                      zIndex={3}
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
          )}

          <NoteBody>
            {/* We will show PDF once endpoint is implemented */}
            {location.state?.documentUrl ? (
              <TempPDFViewer
                pdfLink={location.state.documentUrl}
                name={location.state.docTitle}
              />
            ) : (
              <div className="note-editor-test">
                {/* <BlockNoteView editor={editor} /> */}
                <LexicalEditor />
                {/* <LexicalEditor editorHistory={initialContent} /> */}
              </div>
            )}
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

      {openFlashCard && (
        <FlashModal
          isOpen={openFlashCard}
          onClose={() => setOpenFlashCard(false)}
          title="Flash Card Title"
          loadingButtonText="Creating..."
          buttonText="Create"
          onSubmit={(noteId) => {
            // submission here
          }}
        />
      )}
    </>
  );
};

export default NewNote;
