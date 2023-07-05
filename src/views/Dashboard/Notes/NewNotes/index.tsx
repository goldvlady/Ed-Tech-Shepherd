import { ReactComponent as AddTag } from '../../../../assets/addTag.svg';
import { ReactComponent as DocIcon } from '../../../../assets/doc.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/download.svg';
import { ReactComponent as FlashCardIcn } from '../../../../assets/flashCardIcn.svg';
import { ReactComponent as PinIcon } from '../../../../assets/pin.svg';
import { ReactComponent as SideBarPinIcn } from '../../../../assets/sideBarPin.svg';
import { ReactComponent as ArrowRight } from '../../../../assets/small-arrow-right.svg';
import { ReactComponent as ZoomIcon } from '../../../../assets/square.svg';
import { ReactComponent as TrashIcon } from '../../../../assets/trash-icn.svg';
import {
  DropDownFirstPart,
  DropDownLists,
  FirstSection,
  Header,
  NewNoteWrapper,
  NoteBody,
  SecondSection
} from './styles';
import { Menu, MenuList, MenuButton, Button, Text } from '@chakra-ui/react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FaEllipsisH } from 'react-icons/fa';

const NewNote = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (newEditorState: any) => {
    setEditorState(newEditorState);
  };

  const handleCustomButtonClick = () => {
    // Handle the custom button click logic here
    // This function will be called when the custom button is clicked
  };

  const handleDropdownChange = (e) => {
    e.preventDefault(); // Prevent the default action (page refresh)

    // Handle the dropdown change logic here
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

  return (
    <NewNoteWrapper>
      <Header>
        <FirstSection>
          <div className="zoom__icn">
            <ZoomIcon />
          </div>
          <div className="doc__name">
            <p>Untitled</p>
          </div>
          <div className="timestamp">
            <p>Created 26 Thur, 08:00pm</p>
          </div>
        </FirstSection>
        <SecondSection>
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
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          placeholder="Untitled"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
        />
      </NoteBody>
    </NewNoteWrapper>
  );
};

export default NewNote;
