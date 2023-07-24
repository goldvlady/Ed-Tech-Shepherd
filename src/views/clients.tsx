import { ReactComponent as DocIcon } from '../assets/doc.svg';
import { ReactComponent as NewNoteIcon } from '../assets/newnote.svg';
import { AllNotesTab, SelectedNoteModal, AllClientTab } from '../components';
import DropdownMenu from '../components/CustomComponents/CustomDropdownMenu';
import CustomTabs from '../components/CustomComponents/CustomTabs';
import Layout from '../components/Layout';
import { SortIcon, FilterByTagsIcon } from '../components/icons';
// import ApiService from '../services/ApiService';
import {
  Checkbox,
  CheckboxContainer,
  FlexContainer,
  Header,
  NewList,
  NotesWrapper,
  SearchInput,
  Section,
  SectionNewList,
  StyledHeader,
  StyledSection
} from './Dashboard/Notes/styles';
// import { BlockNoteEditor } from '@blocknote/core';
// import '@blocknote/core/style.css';
// import { BlockNoteView, useBlockNote } from '@blocknote/react';
import { AddIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const getNotes = JSON.parse(localStorage.getItem('notes') as string) || [];

const filteredBy = [
  {
    id: 1,
    value: '#Chemistry',
    checked: false
  },
  {
    id: 2,
    value: '#Physics',
    checked: false
  },
  {
    id: 3,
    value: '#Biology',
    checked: false
  },
  {
    id: 4,
    value: '#English',
    checked: false
  }
];

const sortedBy = [
  {
    id: 1,
    title: 'By date',
    firstValue: 'Recently created',
    secondValue: 'Recently modified'
  },
  {
    id: 2,
    title: 'By title',
    firstValue: 'A -> Z',
    secondValue: 'Z -> A'
  }
];

const tabLists = [
  {
    id: 1,
    title: 'All'
  },
  {
    id: 2,
    title: 'Active'
  },
  {
    id: 3,
    title: 'Pending'
  },
  {
    id: 4,
    title: 'Ended'
  }
];

const tabPanel = [
  {
    id: 1,
    component: <AllClientTab />
  }
];

const Notes = () => {
  const navigate = useNavigate();
  const [toggleHelpModal, setToggleHelpModal] = useState(false);
  // const [allNotes, setAllNotes] = useState<any>([]);
  // const [loadingNotes, setLoadingNotes] = useState(false);
  // const getNotes = async () => {
  //   setLoadingNotes(true);
  //   const resp = await ApiService.getAllNotes();
  //   const notes = await resp.json();
  //   setAllNotes(notes);
  //   setLoadingNotes(false);
  // };
  const activateHelpModal = () => {
    setToggleHelpModal(true);
  };

  const [checkedState, setCheckedState] = useState(
    new Array(filteredBy.length).fill(false)
  );

  const createNewLists = [
    {
      id: 1,
      iconName: <NewNoteIcon />,
      labelText: 'New note',
      onClick: () => navigate('/dashboard/new-note')
    },
    {
      id: 2,
      iconName: <DocIcon />,
      labelText: 'Upload document',
      onClick: activateHelpModal
    }
  ];

  const handleCheckboxChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  };
  // const initialContent: string | null = localStorage.getItem('editorContent'); //Change to API endpoint for get /notes/{id}
  // const editor: BlockNoteEditor | null = useBlockNote({
  //   initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  //   onEditorContentChange: (editor) => {
  //     localStorage.setItem(
  //       'editorContent',
  //       JSON.stringify(editor.topLevelBlocks)
  //     );
  //   }
  // });
  return (
    <>
      <Layout
        className={`${
          getNotes.length > 0 ? 'bg-white' : 'bg-gray-100'
        } p-3 h-screen`}
      >
        {getNotes?.length > 0 ? (
          <NotesWrapper>
            <header className="flex my-4 justify-between">
              <StyledHeader>
                <span className="font-bold">Clients</span>
                <span className="count-badge">{getNotes?.length}</span>
              </StyledHeader>
              <FlexContainer>
                <DropdownMenu
                  menuTitle="Sort by"
                  DropdownMenuIcon={<SortIcon className="w-[20%] h-[2vh]" />}
                >
                  <>
                    {
                      sortedBy?.map((sorted) => (
                        <StyledSection key={sorted.id}>
                          <div>
                            <Text className="text-label">{sorted.title}</Text>
                            <div>
                              <Text className="text-value">
                                {sorted.firstValue}
                              </Text>
                              <Text className="text-value">
                                {sorted.secondValue}
                              </Text>
                            </div>
                          </div>
                        </StyledSection>
                      ))[0]
                    }
                    {
                      sortedBy?.map((sorted) => (
                        <StyledSection key={sorted.id}>
                          <div>
                            <Text className="text-label">{sorted.title}</Text>
                            <div>
                              <Text className="text-value">
                                {sorted.firstValue}
                              </Text>
                              <Text className="text-value">
                                {sorted.secondValue}
                              </Text>
                            </div>
                          </div>
                        </StyledSection>
                      ))[1]
                    }
                  </>
                </DropdownMenu>
              </FlexContainer>
            </header>
            <CustomTabs tablists={tabLists} tabPanel={tabPanel} />
          </NotesWrapper>
        ) : (
          <NotesWrapper>
            <Header>
              <Text>
                <span>My Notes</span>
              </Text>
            </Header>
            <Section>
              <div>
                <img src="/images/notes.png" alt="notes" />
                <Text>You don't have any notes yet!</Text>
                <DropdownMenu
                  isCreateNewWidth
                  isCreateNew
                  menuTitle="Create new"
                  DropdownMenuIcon={
                    <AddIcon fontWeight="700" marginRight="10px" />
                  }
                >
                  {createNewLists?.map((createNewList) => (
                    <SectionNewList key={createNewList.id}>
                      <NewList onClick={createNewList.onClick}>
                        {createNewList.iconName}
                        <Text>{createNewList.labelText}</Text>
                      </NewList>
                    </SectionNewList>
                  ))}
                </DropdownMenu>
              </div>
            </Section>
          </NotesWrapper>
        )}
        <SelectedNoteModal
          show={toggleHelpModal}
          setShow={setToggleHelpModal}
          setShowHelp={setToggleHelpModal}
        />
      </Layout>
    </>
  );
};

export default Notes;
