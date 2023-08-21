import { ReactComponent as DocIcon } from '../../../assets/doc.svg';
import { ReactComponent as NewNoteIcon } from '../../../assets/newnote.svg';
import { AllNotesTab, SelectedNoteModal } from '../../../components';
import DropdownMenu from '../../../components/CustomComponents/CustomDropdownMenu';
import CustomTabs from '../../../components/CustomComponents/CustomTabs';
import AllTab from '../../../components/allTab/allTab';
import AllDocumentTab from '../../../components/documentTab/allDocument';
import LoaderOverlay from '../../../components/loaderOverlay';
import ApiService from '../../../services/ApiService';
import userStore from '../../../state/userStore';
import {
  Checkbox,
  CheckboxContainer,
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
import { Button, IconButton, Text } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react';
import { Flex, Box } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaFilter as FilterIcon, FaSearch as SearchIcon } from 'react-icons/fa';
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

const Notes = () => {
  const navigate = useNavigate();
  const [toggleHelpModal, setToggleHelpModal] = useState(false);
  const [allNotes, setAllNotes] = useState<Array<NoteDetails>>([]);
  const [showLoader, setShowLoader] = useState(true);
  const [sortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [checkedState, setCheckedState] = useState(
    new Array(tagFilters.length).fill(false)
  );
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [sortedNotes, setSortedNotes] = useState(allNotes);

  const { userDocuments } = userStore();
  const combinedData: any = [...allNotes, ...userDocuments];

  const handleTagSelection = (tagElement) => {
    const lowerCaseTagId = tagElement.toLowerCase();

    if (selectedTags.includes(lowerCaseTagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== lowerCaseTagId));
    } else {
      // setSelectedTags([...selectedTags, lowerCaseTagId]);
      setSelectedTags([lowerCaseTagId]);
    }
  };

  const handleClearFilter = () => {
    setSortedNotes(allNotes);
    setSelectedTags([]);
  };

  const HandleCheckboxChange = (index) => {
    const selectedTag = tagFilters[index].value;
    handleTagSelection(selectedTag);
  };

  const getNotes = useCallback(async () => {
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
    }
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
      component: (
        <AllTab
          data={sortedNotes}
          getNotes={getNotes}
          handleTagSelection={handleTagSelection}
        />
      )
    },
    {
      id: 2,
      component: <AllDocumentTab data={userDocuments} />
    },
    {
      id: 3,
      component: (
        <AllNotesTab
          data={sortedNotes}
          getNotes={getNotes}
          handleTagSelection={handleTagSelection}
        />
      )
    }
  ];

  const FilterMenu = () => {
    return (
      <Stack
        direction={{ base: 'column', md: 'row' }}
        width="95%"
        mb={{ base: '20px', md: '40px' }}
        alignItems="center"
        justifyContent="space-between"
        pr={{ md: '20px', base: '0' }}
        spacing={4}
      >
        <Flex alignItems="center">
          <StyledHeader>
            <span className="font-bold">My Documents</span>
            <span className="count-badge">{combinedData.length}</span>
          </StyledHeader>
        </Flex>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'flex-start', md: 'center' }}
          width={{ base: '100%', md: 'auto' }}
        >
          <DropdownMenu
            menuTitle={`Filter by tags (${selectedTags.length})`}
            iconPlacement="after"
            DropdownMenuIcon={<FilterIcon color="#96999C" size="12px" />}
          >
            <section>
              <Flex mb="5px">
                <IconButton
                  borderRadius="8px"
                  backgroundColor="#FFFFFF"
                  border="none"
                  p="0px"
                  aria-label="Search"
                  _hover={{ bgColor: '#FFFFFF', border: 'none' }}
                  icon={<SearchIcon color="#212224" />}
                  size="sm"
                />
                <SearchInput type="search" placeholder="Search tags" />
              </Flex>
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

          <Box marginLeft={'1.5em'}>
            <DropdownMenu
              isWidth
              menuTitle="Sort by"
              iconPlacement="after"
              DropdownMenuIcon={<FaCalendarAlt color="#96999C" size="12px" />}
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
          </Box>

          <Box marginLeft={'1.5em'}>
            <DropdownMenu
              isCreateNew
              isWidth
              iconPlacement="before"
              DropdownMenuIcon={<AddIcon fontWeight="700" marginRight="10px" />}
              menuTitle="Create new"
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
          </Box>
        </Flex>
      </Stack>
    );
  };

  //  load all notes when page is loaded
  useEffect(() => {
    getNotes().then(() => {
      setNotesLoaded(true);
    });
  }, []);

  // Handle sorting of notes based on selected tags
  useEffect(() => {
    if (selectedTags.length === 0) {
      setSortedNotes(combinedData);
    } else {
      const sorted = combinedData.filter((note) => {
        const tags = note.tags || [];
        const matchingTags = tags.filter((tag) =>
          selectedTags.includes(tag.toLowerCase())
        );
        return matchingTags.length > 0;
      });
      setSortedNotes(sorted);
    }
  }, [selectedTags, allNotes, userDocuments]);

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    // Ensure that the loader stays visible for at least 3000 milliseconds to ensure both the getnotes and sortednotes array are gotten
    const minLoaderDisplayTime = 3000; // Adjust as needed
    const minLoaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, minLoaderDisplayTime);

    return () => {
      clearTimeout(loaderTimer);
      clearTimeout(minLoaderTimer);
    };
  }, []);

  if (showLoader) {
    return <LoaderOverlay />;
  }

  const NoteView = () => {
    if (!notesLoaded) {
      return <LoaderOverlay />;
    } else {
      return (
        <>
          {combinedData.length > 0 ? (
            <NotesWrapper>
              <header className="flex my-4 justify-between">
                <FilterMenu />
              </header>
              {selectedTags.length >= 1 && (
                <Button
                  variant="solid"
                  mb="10px"
                  borderRadius={'10px'}
                  marginLeft={'10px'}
                  colorScheme={'primary'}
                  width={{ base: '100%', md: 'auto' }}
                  onClick={handleClearFilter}
                >
                  <svg
                    width="16"
                    height="18"
                    viewBox="0 0 16 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="white"
                      d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6h.008v.008H6V6z"
                    />
                  </svg>

                  <Text ml="5px">Clear filter</Text>
                </Button>
              )}

              {sortedNotes.length === 0 && selectedTags.length ? (
                <Section>
                  <div>
                    <img src="/images/notes.png" alt="notes" />
                    <Text>Sorry, no notes for the selected tag.</Text>
                  </div>
                </Section>
              ) : (
                <CustomTabs tablists={tabLists} tabPanel={tabPanel} />
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
                  <Text>You don't have any notes/documents yet!</Text>
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
