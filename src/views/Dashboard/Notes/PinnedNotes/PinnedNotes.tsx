import { ReactComponent as DocIcon } from '../../../../assets/doc.svg';
import { ReactComponent as NewNoteIcon } from '../../../../assets/newnote.svg';
import { SelectedNoteModal } from '../../../../components';
import DropdownMenu from '../../../../components/CustomComponents/CustomDropdownMenu';
import CustomTabs from '../../../../components/CustomComponents/CustomTabs';
import { SortIcon, FilterByTagsIcon } from '../../../../components/icons';
import LoaderOverlay from '../../../../components/loaderOverlay';
import ApiService from '../../../../services/ApiService';
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
} from '../styles';
import { NoteServerResponse, PinnedNoteDetails, SortOrder } from '../types';
import PinnedNotesTab from './PinnedNotesTab';
import { AddIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

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

const tagFilters = [
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

const sortedByDate = [
  {
    id: 1,
    title: 'By date',
    firstValue: { label: 'Recently created', order: SortOrder.DESC },
    secondValue: { label: 'Recently modified', order: SortOrder.ASC }
  }
];

const sortedByTitle = [
  {
    id: 2,
    title: 'By title',
    firstValue: { label: 'A -> Z', order: SortOrder.ASC },
    secondValue: { label: 'Z -> A', order: SortOrder.DESC }
  }
];

const PinnedNotes = () => {
  const navigate = useNavigate();
  const [toggleHelpModal, setToggleHelpModal] = useState(false);
  const [allPinnedNotes, setAllPinnedNotes] = useState<
    Array<PinnedNoteDetails>
  >([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [sortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [checkedState, setCheckedState] = useState(
    new Array(tagFilters.length).fill(false)
  );
  const [tags, setTags] = useState<string[]>([]);

  const getNotes = useCallback(async () => {
    setLoadingNotes(true);
    const resp = await ApiService.getAllNotes();
    const respText = await resp.text();
    try {
      const respDetails: NoteServerResponse<Array<PinnedNoteDetails>> =
        JSON.parse(respText);
      if (respDetails.data) {
        setAllPinnedNotes(respDetails.data);
      }
      setLoadingNotes(false);
      // set notes list
    } catch (error: any) {
      setLoadingNotes(false);
      return;
    }
  }, []);

  const activateHelpModal = () => {
    setToggleHelpModal(true);
  };

  const handleCheckboxChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    updateTagFilter(tagFilters[position]?.value);
    setCheckedState(updatedCheckedState);
  };

  const orderBy = (order: SortOrder, sortBy = 'createdAt') => {
    if (order === SortOrder.ASC) {
      const notes = [...allPinnedNotes].sort((a: any, b: any) => {
        const aDate = new Date(a[sortBy]);
        const bDate = new Date(b[sortBy]);
        if (aDate instanceof Date && bDate instanceof Date) {
          return aDate.getTime() - bDate.getTime();
        } else {
          // use textual check
          return a.topic.localeCompare(b.topic);
        }
      });
      setAllPinnedNotes(notes);
    } else {
      const notes = [...allPinnedNotes].sort((a: any, b: any) => {
        const aDate = new Date(a[sortBy]);
        const bDate = new Date(b[sortBy]);
        if (aDate instanceof Date && bDate instanceof Date) {
          return bDate.getTime() - aDate.getTime();
        } else {
          // use textual check
          return b.topic.localeCompare(a.topic);
        }
      });
      setAllPinnedNotes(notes);
    }
  };

  const updateTagFilter = (selectedTag: string) => {
    const index = tags.indexOf(selectedTag);
    let newTags: string[] = [];
    if (index !== -1) {
      newTags = tags.filter((tag) => tag !== selectedTag);
    } else {
      newTags = [...tags, selectedTag];
    }
    setTags(newTags);
  };

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

  const FilterMenu = () => {
    return (
      <FlexContainer>
        <DropdownMenu
          isCreateNew
          isWidth
          menuTitle="Create new"
          DropdownMenuIcon={<AddIcon fontWeight="700" marginRight="10px" />}
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
          isWidth
          menuTitle="Sort by"
          DropdownMenuIcon={<SortIcon className="w-[20%] h-[2vh]" />}
        >
          <>
            {
              sortedByDate?.map((sorted: any) => (
                <StyledSection key={sorted.id}>
                  <div>
                    <Text className="text-label">{sorted.title}</Text>

                    <Text
                      onClick={() => orderBy(sorted.firstValue.order)}
                      className="text-value"
                    >
                      {sorted.firstValue.label}
                    </Text>

                    <Text
                      onClick={() => orderBy(sorted.secondValue.order)}
                      className="text-value"
                    >
                      {sorted.secondValue.label}
                    </Text>
                  </div>
                </StyledSection>
              ))[0]
            }
            {
              sortedByTitle?.map((sorted: any) => (
                <StyledSection key={sorted.id}>
                  <div>
                    <Text className="text-label">{sorted.title}</Text>
                    <div>
                      <Text
                        onClick={() =>
                          orderBy(sorted.secondValue.order, 'topic')
                        }
                        className="text-value"
                      >
                        {sorted.firstValue.label}
                      </Text>
                      <Text
                        onClick={() =>
                          orderBy(sorted.secondValue.order, 'topic')
                        }
                        className="text-value"
                      >
                        {sorted.secondValue.label}
                      </Text>
                    </div>
                  </div>
                </StyledSection>
              ))[1]
            }
          </>
        </DropdownMenu>

        <DropdownMenu
          menuTitle="Filtered by tags"
          DropdownMenuIcon={<FilterByTagsIcon className="w-5 h-5" />}
        >
          <section>
            <SearchInput type="search" placeholder="Search tags" />
            <div>
              {tagFilters?.map((filtered, index) => (
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
    );
  };

  // Define the type for the pinned note
  type PinnedNote = {
    noteId: string | null;
    pinnedNoteJSON: any;
  };

  // Helper function to convert PinnedNote to PinnedNoteDetails
  const convertToPinnedNoteDetails = (
    pinnedNote: PinnedNote
  ): PinnedNoteDetails => {
    // Extract properties from pinnedNote.pinnedNoteJSON
    const {
      data: { topic, note, tags, createdAt, updatedAt, user }
    } = pinnedNote.pinnedNoteJSON;

    return {
      user: user || {},
      topic: topic || '',
      note: note || '',
      tags: tags || [],

      _id: pinnedNote.noteId || '',
      createdAt: new Date(createdAt) || new Date(),
      updatedAt: new Date(updatedAt) || new Date()
    };
  };

  // Function to get pinned notes from local storage
  const getPinnedNotesFromLocalStorage = (): PinnedNote[] => {
    const storageId = 'pinned_notes';
    const pinnedNotesString = localStorage.getItem(storageId);
    try {
      if (pinnedNotesString) {
        const parsedPinnedNotes = JSON.parse(pinnedNotesString);
        if (Array.isArray(parsedPinnedNotes)) {
          return parsedPinnedNotes;
        }
      }
    } catch (error) {
      console.error('Error parsing pinned notes from local storage:', error);
    }

    return [];
  };

  useEffect(() => {
    const pinnedNotesFromLocalStorage = getPinnedNotesFromLocalStorage();
    if (pinnedNotesFromLocalStorage) {
      const convertedPinnedNotes = pinnedNotesFromLocalStorage.map(
        convertToPinnedNoteDetails
      );
      setAllPinnedNotes((prevPinnedNotes) => [
        ...prevPinnedNotes,
        ...convertedPinnedNotes
      ]);
    }
  }, []);

  const tabPanel = [
    {
      id: 1,
      component: <PinnedNotesTab data={allPinnedNotes} />
    },
    {
      id: 2,
      component: <></>
    },
    {
      id: 3,
      component: <PinnedNotesTab data={allPinnedNotes} />
    }
  ];

  const PinnedNoteView = () => {
    if (loadingNotes) {
      return <>{loadingNotes && <LoaderOverlay />}</>;
    } else {
      return (
        <>
          {allPinnedNotes.length > 0 ? (
            <NotesWrapper>
              <header className="flex my-4 justify-between">
                <StyledHeader>
                  <span className="font-bold">My Pinned Notes</span>
                  <span className="count-badge">{allPinnedNotes.length}</span>
                </StyledHeader>
                <FilterMenu />
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
        </>
      );
    }
  };

  return <PinnedNoteView />;
};

export default PinnedNotes;
