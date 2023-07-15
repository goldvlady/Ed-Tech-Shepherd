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
import { Menu, MenuList, MenuButton, Button, Text } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { EditorState, convertToRaw } from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import moment from 'moment';
import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FaEllipsisH } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NewNote = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [markdownContent, setMarkdownContent] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const [, setNoteDirectories] = useState<{
    title: string;
    content: string;
    tags: string;
    createdDate: string;
  }>();
  const [title, setTitle] = useState('');
  const currentTime = moment().format('DD ddd, hh:mma');
  const initialContent: string | null = localStorage.getItem('editorContent'); //Change to API endpoint for get /notes/{id}
  const editor: BlockNoteEditor | null = useBlockNote({});

  const onEditorStateChange = (newEditorState: any) => {
    setEditorState(newEditorState);
    const firtText = convertToRaw(editorState.getCurrentContent());
    setTitle(firtText.blocks[0].text);
    setMarkdownContent(
      draftToMarkdown(convertToRaw(editorState.getCurrentContent()))
    );
  };

  const onSaveNote = () => {
    if (editor) {
      console.log('NoteEditor Content', editor.topLevelBlocks);
      // const res = await createNote(editor.topLevelBlocks); //need id and lastUpdated, etc.
      // setEditorState(await res.json()); //console.log
    }
    setNoteDirectories({
      content: JSON.stringify(markdownContent),
      title: '',
      tags: '',
      createdDate: new Date(Date.now()).toISOString()
    });
    const notes = JSON.parse(localStorage.getItem('notes') as string) || [];
    notes.push({
      id: uid(),
      content: JSON.stringify(markdownContent),
      title,
      tags: '',
      date_created: new Date(Date.now()).toISOString(),
      last_modified: new Date(Date.now()).toISOString()
    });

    localStorage.setItem('notes', JSON.stringify(notes));

    // navigate('/dashboard/note-directory');

    toast({
      title: 'New Added',
      description: `${title} successful added.`,
      status: 'success',
      position: 'top-right',
      duration: 5000,
      isClosable: true
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
      title: 'Delete'
    }
  ];

  const [editedTitle, setEditedTitle] = useState(title || 'Untitled'); //note title from data initially or Untitled
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleChange = (event) => {
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      updateTitle();
    }
  };

  const handleHeaderClick = () => {
    setIsEditingTitle(true);
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
                style={{ width: `${editedTitle.length}ch` }}
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
