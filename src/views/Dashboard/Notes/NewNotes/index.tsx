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
import { useUserDetails } from '../../../../components/hooks/useUserDetails';
import { uid } from '../../../../helpers/index';
import ApiService from '../../../../services/ApiService';
import { NoteServerResponse } from '../types';
import {
  DropDownFirstPart,
  DropDownLists,
  FirstSection,
  Header,
  NewNoteWrapper,
  NoteBody,
  SecondSection
} from './styles';
import { BlockNoteEditor } from '@blocknote/core';
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
import { EditorState, convertToRaw } from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import { isNil } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FaEllipsisH } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const DEFAULT_NOTE_TITLE = 'Enter Note Title';

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
    title: 'Delete'
  }
];

const NewNote = () => {
  const navigate = useNavigate();
  // get user details
  const DefaultNoteTitle = DEFAULT_NOTE_TITLE;

  //note title from data initially or Untitled
  const toast = useToast();
  const [noteId, setNoteId] = useState<string>('');
  const [editedTitle, setEditedTitle] = useState(DefaultNoteTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [markdownContent, setMarkdownContent] = useState('');

  const [, setNoteDirectories] = useState<{
    title: string;
    content: string;
    tags: string;
    createdDate: string;
  }>();
  const currentTime = moment().format('DD ddd, hh:mma');
  const editor: BlockNoteEditor | null = useBlockNote({});
  const userDetails = useUserDetails();
  console.log('user details: ', userDetails);
  // if (!userDetails.found) {
  //   navigate('/login');
  // }
  // if we are loading a note, check path params
  const { id } = useParams();
  // if (id) {
  //   setNoteId(id);
  //   console.log("note ID: ", id);
  // }

  const onSaveNote = async () => {
    if (!editor) return;
    // get editor's content
    const noteJSON = editor.topLevelBlocks;

    if (!editedTitle || editedTitle === DEFAULT_NOTE_TITLE) {
      return showToast('Note Alert', 'Enter note title', 'error');
    }
    if (noteJSON.length <= 0) {
      return showToast('Note Alert', 'Note is empty', 'error');
    }
    console.log('NoteEditor Content', noteJSON);
    const saveDetails = await createNote({
      topic: editedTitle,
      note: noteJSON
    });

    if (!saveDetails) {
      return showToast(
        'Note Alert',
        'An unknown error occurs while adding note. Try again',
        'error'
      );
    }
    if (saveDetails.error) {
      return showToast('Note Alert', saveDetails.error, 'error');
    } else {
      // note created successfully
      showToast('Note Added', saveDetails.message, 'success');
      // clear out all
      setEditedTitle(DefaultNoteTitle);
    }
    console.log('note editor details: ', saveDetails);
  };

  const onDeleteNote = async () => {
    if (!noteId || noteId === '') {
      return showToast('Note Alert', 'No note selected', 'error');
    }
    const details = await deleteNote(noteId);

    if (!details) {
      return showToast(
        'Note Alert',
        'An unknown error occurs while adding note. Try again',
        'error'
      );
    }
    if (details.error) {
      return showToast('Note Alert', details.error, 'error');
    } else {
      showToast('Note Deleted', details.message, 'success');
      setEditedTitle(DefaultNoteTitle);
    }
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

  const handleTitleChange = (event: any) => {
    setIsEditingTitle(true);
    setEditedTitle(event.target.value);
  };

  const updateTitle = () => {
    setIsEditingTitle(false);
    if (editedTitle.trim() !== '') {
      setEditedTitle(editedTitle.trim());
    } else if (editedTitle.trim() === '') {
      setEditedTitle('Untitled');
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
    setIsEditingTitle(true);
  };

  const createNote = async (data: any): Promise<any | null> => {
    const resp = await ApiService.createNote(data);
    const respText = await resp.text();
    try {
      const respDetails: any = JSON.parse(respText);
      return respDetails;
    } catch (error: any) {
      return { error: error.message, message: error.message };
    }
  };
  const deleteNote = async (id: string): Promise<any | null> => {
    const resp = await ApiService.deleteNote(id);
    const respText = await resp.text();
    try {
      const respDetails = JSON.parse(respText);
      return respDetails;
    } catch (error: any) {
      return { error: error.message, message: error.message };
    }
  };

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
                style={{ width: `${editedTitle.length} ch` }}
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
                      <DropDownFirstPart>
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
