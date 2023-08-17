import { ReactComponent as DocIcon } from '../../../assets/doc.svg';
import { ReactComponent as NewNoteIcon } from '../../../assets/newnote.svg';
import { AllNotesTab, SelectedNoteModal } from '../../../components';
import DropdownMenu from '../../../components/CustomComponents/CustomDropdownMenu';
import CustomTabs from '../../../components/CustomComponents/CustomTabs';
import AllDocumentTab from '../../../components/documentTab/allDocument';
import { SortIcon, FilterByTagsIcon } from '../../../components/icons';
import LoaderOverlay from '../../../components/loaderOverlay';
import { useAuth } from '../../../providers/auth.provider';
import ApiService from '../../../services/ApiService';
import userStore from '../../../state/userStore';
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
} from './styles';
import { NoteDetails, NoteServerResponse, SortOrder } from './types';
import { AddIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const tagFilters = [
  {
    id: 1,
    value: 'Chemistry',
    checked: false
  },
  {
    id: 2,
    value: 'Physics',
    checked: false
  },
  {
    id: 3,
    value: 'Biology',
    checked: false
  },
  {
    id: 4,
    value: 'English',
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

const getLocalStorageNoteId = (noteId: string | null): string => {
  const genId = noteId ? noteId : '';
  return genId;
};

const Notes = () => {
  const navigate = useNavigate();
  const [toggleHelpModal, setToggleHelpModal] = useState(false);
  const [allNotes, setAllNotes] = useState<Array<NoteDetails>>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [sortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [checkedState, setCheckedState] = useState(
    new Array(tagFilters.length).fill(false)
  );
  const [tags, setTags] = useState<string[]>([]);
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [sortedNotes, setSortedNotes] = useState(allNotes);

  const { userDocuments } = userStore();

  const handleTagSelection = (tagId) => {
    const lowerCaseTagId = tagId.toLowerCase();
    if (selectedTags.includes(lowerCaseTagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== lowerCaseTagId));
    } else {
      // setSelectedTags([...selectedTags, lowerCaseTagId]);
      setSelectedTags([lowerCaseTagId]);
    }
  };

  // Handle sorting of notes based on selected tags
  useEffect(() => {
    if (selectedTags.length === 0) {
      setSortedNotes(allNotes);
    } else {
      const sorted = allNotes.filter((note) => {
        const matchingTags = note.tags.filter((tag) =>
          selectedTags.includes(tag.toLowerCase())
        );
        return matchingTags.length > 0;
      });
      setSortedNotes(sorted);
    }
  }, [selectedTags, allNotes]);

  const HandleCheckboxChange = (index) => {
    const selectedTag = tagFilters[index].value;
    handleTagSelection(selectedTag);
  };

  useEffect(() => {
    // console.log({ allNotes });
  }, [userDocuments]);

  const getNotes = useCallback(async () => {
    setLoadingNotes(true);
    try {
      const resp = await ApiService.getAllNotes();
      const respText = await resp.text();
      const respDetails: NoteServerResponse<Array<NoteDetails>> =
        JSON.parse(respText);

      if (respDetails.data) {
        setAllNotes(respDetails.data);
      }
    } catch (error: any) {
      // Handle the error appropriately, e.g., show an error message
      setLoadingNotes(false);
    } finally {
      setLoadingNotes(false);
    }
  }, []);

  //  load all notes when page is loaded
  useEffect(() => {
    getNotes().then(() => {
      setNotesLoaded(true);
    });
  }, []);

  const activateHelpModal = () => {
    setToggleHelpModal(true);
  };

  const orderBy = (order: SortOrder, sortBy = 'createdAt') => {
    if (order === SortOrder.ASC) {
      const notes = [...allNotes].sort((a: any, b: any) => {
        const aDate = new Date(a[sortBy]);
        const bDate = new Date(b[sortBy]);
        if (aDate instanceof Date && bDate instanceof Date) {
          return aDate.getTime() - bDate.getTime();
        } else {
          // use textual check
          return a.topic.localeCompare(b.topic);
        }
      });
      setAllNotes(notes);
    } else {
      const notes = [...allNotes].sort((a: any, b: any) => {
        const aDate = new Date(a[sortBy]);
        const bDate = new Date(b[sortBy]);
        if (aDate instanceof Date && bDate instanceof Date) {
          return bDate.getTime() - aDate.getTime();
        } else {
          // use textual check
          return b.topic.localeCompare(a.topic);
        }
      });
      setAllNotes(notes);
    }
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
      component: <AllNotesTab data={sortedNotes} getNotes={getNotes} />
    },
    {
      id: 2,
      component: <AllDocumentTab data={userDocuments} />
    },
    {
      id: 3,
      component: <AllNotesTab data={sortedNotes} getNotes={getNotes} />
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
                    onChange={() => HandleCheckboxChange(index)}
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

  useEffect(() => {
    // Filter based on tags or sort order
    const filteredNotes = allNotes.filter((note: NoteDetails) => {
      if (tags.length === 0) return true;
      return tags.some((tag) => {
        if (note.tags && Array.isArray(note.tags)) {
          return note.tags.includes(tag);
        } else {
          // Default to true if no tag present on note item
          return true;
        }
      });
    });
    setAllNotes(filteredNotes);
  }, [tags, sortOrder]);

  const NoteView = () => {
    if (!notesLoaded || sortedNotes.length < 1) {
      return <LoaderOverlay />;
    } else {
      return (
        <>
          {allNotes.length > 0 ? (
            <NotesWrapper>
              <header className="flex my-4 justify-between">
                <StyledHeader>
                  <span className="font-bold">My Documents</span>
                  <span className="count-badge">{allNotes.length}</span>
                </StyledHeader>
                <FilterMenu />
              </header>
              {sortedNotes.length > 0 ? (
                <CustomTabs tablists={tabLists} tabPanel={tabPanel} />
              ) : (
                <Section>
                  <div>
                    <img src="/images/notes.png" alt="notes" />
                    <Text>Sorry, no notes for the selected tag.</Text>
                  </div>
                </Section>
              )}
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
            okayButton={true}
          />
        </>
      );
    }
  };

  return <NoteView />;
};

export default Notes;
