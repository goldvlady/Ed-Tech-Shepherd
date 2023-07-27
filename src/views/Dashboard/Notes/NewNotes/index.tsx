import { ReactComponent as AddTag } from '../../../../assets/addTag.svg';
import { ReactComponent as DocIcon } from '../../../../assets/doc.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/download.svg';
import { ReactComponent as FlashCardIcn } from '../../../../assets/flashCardIcn.svg';
import { ReactComponent as PinIcon } from '../../../../assets/pin.svg';
import { ReactComponent as SideBarPinIcn } from '../../../../assets/sideBarPin.svg';
import { ReactComponent as ArrowRight } from '../../../../assets/small-arrow-right.svg';
import { ReactComponent as ZoomIcon } from '../../../../assets/square.svg';
import { ReactComponent as TrashIcon } from '../../../../assets/trash-icn.svg';
import CustomButton from '../../../../components/CustomComponents/CustomButton';
import { uid } from '../../../../helpers/index';
import ApiService from '../../../../services/ApiService';
import { NoteDetails, NoteServerResponse } from '../types';
import {
  DropDownFirstPart,
  DropDownLists,
  FirstSection,
  Header,
  NewNoteWrapper,
  NoteBody,
  SecondSection
} from './styles';
import { Block, BlockNoteEditor } from '@blocknote/core';
import '@blocknote/core/style.css';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import {
  Menu,
  MenuList,
  MenuButton,
  Button,
  Text,
  UseToastOptions,
  AlertStatus,
  ToastPosition
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FaEllipsisH } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const DEFAULT_NOTE_TITLE = 'Enter Note Title';
const DELETE_NOTE_TITLE = 'Delete Note';
const UPDATE_NOTE_TITLE = 'Note Alert';

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

const NewNote = () => {
  const navigate = useNavigate();
  // get user details
  const defaultNoteTitle = DEFAULT_NOTE_TITLE;

  //note title from data initially or Untitled
  const toast = useToast();
  const params = useParams();
  const [noteParamId, setNoteParamId] = useState<string | null>(
    params.id ?? null
  );
  const [noteId, setNoteId] = useState<string | null>(null);
  const [note, setNote] = useState<NoteDetails | null>(null);
  const [saveButtonState, setSaveButtonState] = useState<boolean>(true);
  const [editedTitle, setEditedTitle] = useState(defaultNoteTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editorContent, setEditorContent] = useState<any>(null);

  const editor: BlockNoteEditor | null = useBlockNote({
    initialContent: editorContent,
    onEditorContentChange: (editor: BlockNoteEditor) => {
      console.log('content changed');
    }
  });

  const currentTime = moment().format('DD ddd, hh:mma');

  const onSaveNote = async () => {
    if (!editor) return;
    // get editor's content
    const noteJSON = editor.topLevelBlocks;

    if (!editedTitle || editedTitle === defaultNoteTitle) {
      return showToast(UPDATE_NOTE_TITLE, 'Enter note title', 'error');
    }
    if (!editorHasContent()) {
      return showToast(UPDATE_NOTE_TITLE, 'Note is empty', 'error');
    }
    setSaveButtonState(false);
    let saveDetails: NoteServerResponse | null;

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
      // Save noteID to state if this is a new note
      if (!noteId) {
        setNoteId(saveDetails.data['_id']);
      }
      showToast(UPDATE_NOTE_TITLE, saveDetails.message, 'success');
      setSaveButtonState(true);
    }
  };

  const onDeleteNote = async () => {
    const noteIdInUse = noteId ?? noteParamId;

    if (!noteIdInUse || noteIdInUse === '') {
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }

    const details = await deleteNote(noteIdInUse);

    if (!details) {
      return showToast(
        DELETE_NOTE_TITLE,
        'An unknown error occurs while adding note. Try again',
        'error'
      );
    }
    console.log("details : ", details);

    if (details.error) {
      return showToast(DELETE_NOTE_TITLE, details.error, 'error');
    } else {
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setEditedTitle(defaultNoteTitle);
      setNoteId('');
      clearEditor();
    }
  };

  const getNoteById = async (noteId: string | null) => {
    if (!noteId) {
      return;
    }
    const resp = await ApiService.getNote(noteId);
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
      // console.log("note details: ", respDetails);
      if (respDetails.data) {
        const note = respDetails.data;
        if (note._id && note.topic && note.note) {
          setEditedTitle(note.topic);
          setEditorContent(note.note);
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
      if (editedTitle.trim() !== '') {
        setEditedTitle(editedTitle.trim());
      } else if (editedTitle.trim() === '') {
        setEditedTitle(defaultNoteTitle);
      }
    }
  };

  const handleFocusOut = () => {
    updateTitle();
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
    for (const block of editor.topLevelBlocks) {
      if (block.content.length > 0) {
        contentFound = true;
        break;
      }
    }
    return contentFound;
  };

  const clearEditor = () => {
    if (!editor) {
      return false;
    }
    // for (const block of editor.topLevelBlocks) {
    //   block.content = [];
    // }
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
      title: title,
      description: description,
      status: status,
      position: position,
      duration: duration,
      isClosable: isClosable
    });
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
      rightIcon: <ArrowRight />
    },
    {
      id: 3,
      leftIcon: <SideBarPinIcn />,
      title: 'Pin to sidebar',
      rightIcon: <ArrowRight />
    },
    {
      id: 4,
      leftIcon: <DocIcon />,
      title: 'Doc Chat',
      rightIcon: <ArrowRight />
    },
    {
      id: 5,
      leftIcon: <DownloadIcon />,
      title: 'Download',
      rightIcon: <ArrowRight />
    },
    {
      id: 6,
      leftIcon: <TrashIcon />,
      title: 'Delete',
      onClick: onDeleteNote
    }
  ];

  // Load notes if noteID is provided via param
  useEffect(() => {
    getNoteById(noteParamId);
  }, [noteParamId]);

  return (
    <NewNoteWrapper>
      <Header>
        <FirstSection>
          <div className="zoom__icn">
            <ZoomIcon />
          </div>
          <div className="doc__name" onClick={handleHeaderClick}>
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleFocusOut}
                onKeyDown={handleKeyDown}
                style={{ minWidth: '200px', width: 'auto' }}
                autoFocus
              />
            ) : (
              <div>{editedTitle}</div>
            )}
          </div>
          <div className="timestamp">
            <p>Created {currentTime}</p>
          </div>
        </FirstSection>
        <SecondSection>
          <CustomButton
            isPrimary
            title="Save"
            type="button"
            onClick={onSaveNote}
            active={saveButtonState}
          />
          <div className="pin__icn">
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
                      <DropDownFirstPart onClick={dropDownOption.onClick}>
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
          </div>
        </SecondSection>
      </Header>
      <NoteBody>
        <BlockNoteView editor={editor} />
      </NoteBody>
    </NewNoteWrapper>
  );
};

export default NewNote;
