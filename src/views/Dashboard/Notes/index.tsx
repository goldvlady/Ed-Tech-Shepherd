import { ReactComponent as DocIcon } from '../../../assets/doc.svg';
import { ReactComponent as NewNoteIcon } from '../../../assets/newnote.svg';
import { AllNotesTab, HelpModal } from '../../../components';
import DropdownMenu from '../../../components/CustomComponents/CustomDropdownMenu';
import CustomTabs from '../../../components/CustomComponents/CustomTabs';
import { SortIcon, FilterByTagsIcon } from '../../../components/icons';
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
  StyledSection,
  Text
} from './styles';
import { AddIcon } from '@chakra-ui/icons';
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
    title: 'Documents'
  },
  {
    id: 3,
    title: 'Notes'
  }
];

const tabPanel = [
  {
    id: 1,
    component: <AllNotesTab />
  }
];

const Notes = () => {
  const navigate = useNavigate();
  const [toggleHelpModal, setToggleHelpModal] = useState(false);

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

  return (
    <>
      {getNotes?.length > 0 ? (
        <NotesWrapper>
          <header className="flex my-4 justify-between">
            <StyledHeader>
              <span className="font-bold">My Notes</span>
              <span className="count-badge">{getNotes?.length}</span>
            </StyledHeader>
            <FlexContainer>
              <DropdownMenu
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
                      <p>{createNewList.labelText}</p>
                    </NewList>
                  </SectionNewList>
                ))}
              </DropdownMenu>
              <DropdownMenu
                menuTitle="Sort by"
                DropdownMenuIcon={<SortIcon className="w-[20%] h-[2vh]" />}
              >
                <>
                  {
                    sortedBy?.map((sorted) => (
                      <StyledSection key={sorted.id}>
                        <div>
                          <p className="text-label">{sorted.title}</p>
                          <div>
                            <p className="text-value">{sorted.firstValue}</p>
                            <p className="text-value">{sorted.secondValue}</p>
                          </div>
                        </div>
                      </StyledSection>
                    ))[0]
                  }
                  {
                    sortedBy?.map((sorted) => (
                      <StyledSection key={sorted.id}>
                        <div>
                          <p className="text-label">{sorted.title}</p>
                          <div>
                            <p className="text-value">{sorted.firstValue}</p>
                            <p className="text-value">{sorted.secondValue}</p>
                          </div>
                        </div>
                      </StyledSection>
                    ))[1]
                  }
                </>
              </DropdownMenu>
              <DropdownMenu
                menuTitle="Filtered By"
                DropdownMenuIcon={<FilterByTagsIcon className="w-5 h-5" />}
              >
                <section>
                  <SearchInput type="search" placeholder="Search tags" />
                  <div>
                    {filteredBy?.map((filtered, index) => (
                      <CheckboxContainer key={filtered.id}>
                        <Checkbox
                          type="checkbox"
                          onChange={() => handleCheckboxChange(index)}
                          checked={checkedState[index]}
                        />
                        <Text>{filtered.value}</Text>
                      </CheckboxContainer>
                    ))}
                  </div>
                </section>
              </DropdownMenu>
            </FlexContainer>
          </header>
          <CustomTabs tablists={tabLists} tabPanel={tabPanel} />
        </NotesWrapper>
      ) : (
        <NotesWrapper>
          <Header>
            <h4>
              <span>My Notes</span>
            </h4>
          </Header>
          <Section>
            <div>
              <img src="/images/notes.png" alt="" />
              <p>You don't have any notes yet!</p>
              <DropdownMenu
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
                      <p>{createNewList.labelText}</p>
                    </NewList>
                  </SectionNewList>
                ))}
              </DropdownMenu>
            </div>
          </Section>
        </NotesWrapper>
      )}
      <HelpModal
        toggleHelpModal={toggleHelpModal}
        setToggleHelpModal={setToggleHelpModal}
      />
    </>
  );
};

export default Notes;
