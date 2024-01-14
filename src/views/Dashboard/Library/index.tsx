import LoaderOverlay from '../../../components/loaderOverlay';
import { useSearch } from '../../../hooks';
import librarySubjectStore from '../../../state/librarySubjectStore';
import { FlashcardData } from '../../../types';
import CardsComponent from '../LibraryCards/components/LibraryCards';
import SubjectsComponent from '../LibraryCards/components/Subjects';
import TopicsComponent from '../LibraryCards/components/Topics';
import { Stack } from '@chakra-ui/react';
import {
  Flex,
  Text,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
  TagLabel,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [hasSearched, setHasSearched] = useState(false);
  const [displayMode, setDisplayMode] = useState('subjects');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const handleSubjectClick = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setDisplayMode('topics');
    navigate(`/dashboard/library/subjects/${subjectId}`);
  };

  const handleTopicClick = (topicId) => {
    setSelectedTopicId(topicId);
    setDisplayMode('cards');
    navigate(`/dashboard/library/topics/${topicId}`);
  };

  const { fetchLibrarySubjects, isLoading, librarySubjects } =
    librarySubjectStore();

  const actionFunc = useCallback(
    (query: string) => {
      if (!hasSearched) setHasSearched(true);
      fetchLibrarySubjects({ search: query });
    },
    [fetchLibrarySubjects, hasSearched]
  );

  const handleSearch = useSearch(actionFunc);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/subjects/')) {
      setDisplayMode('topics');
      setSelectedSubjectId(path.split('/subjects/')[1]);
    } else if (path.includes('/topics/')) {
      setDisplayMode('cards');
      setSelectedTopicId(path.split('/topics/')[1]);
    } else {
      setDisplayMode('subjects');
      setSelectedSubjectId(null);
      setSelectedTopicId(null);
    }
  }, [location]);

  useEffect(() => {
    fetchLibrarySubjects();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {isLoading && !librarySubjects?.length && <LoaderOverlay />}

      {!librarySubjects?.length && !hasSearched && !isLoading ? (
        <Box
          background={'#F8F9FB'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          height={'calc(100vh - 80px)'}
        >
          <Flex
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            color="#E5E6E6"
            pt={{ base: '10px', md: '20px' }}
            pl={{ base: '10px', md: '20px' }}
          >
            <Text
              fontFamily="Inter"
              fontWeight="600"
              fontSize={{ base: '18px', md: '24px' }}
              lineHeight="30px"
              letterSpacing="-2%"
              color="#212224"
            >
              Library
            </Text>
          </Flex>
          <Box
            width={'100%'}
            display={'flex'}
            height="100%"
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}
          >
            <img
              src="/images/empty_illustration.svg"
              alt="empty directory icon"
            />
            <Text
              color="text.300"
              fontFamily="Inter"
              fontSize="16px"
              fontStyle="normal"
              fontWeight="500"
              lineHeight="21px"
              letterSpacing="0.112px"
            >
              No cards to display
            </Text>
          </Box>
        </Box>
      ) : (
        <Box
          padding={{ md: '20px', base: '10px' }}
          overflowX={{ base: 'hidden' }}
        >
          <Flex
            width="100%"
            marginBottom={'40px'}
            alignItems="center"
            justifyContent="space-between"
            paddingRight={{ md: '20px' }}
            color="#E5E6E6"
          >
            <Box display="flex">
              <Text
                fontFamily="Inter"
                fontWeight="600"
                fontSize="24px"
                lineHeight="30px"
                letterSpacing="-2%"
                color="#212224"
              >
                Library
              </Text>
              <Tag ml="10px" borderRadius="5" background="#f7f8fa" size="md">
                <TagLabel fontWeight={'bold'}>
                  {' '}
                  {librarySubjects?.length || 0}
                </TagLabel>
              </Tag>
            </Box>
          </Flex>

          <Stack
            direction={{ base: 'column', md: 'row' }}
            width="100%"
            mb={{ base: '20px', md: '40px' }}
            alignItems="center"
            justifyContent="space-between"
            pr={{ md: '20px', base: '0' }}
            color="#E5E6E6"
            spacing={4}
          >
            <Flex alignItems="center">
              <InputGroup
                size="sm"
                borderRadius="6px"
                width={{ base: '100%', md: '200px' }}
                height="32px"
              >
                <InputLeftElement marginRight={'10px'} pointerEvents="none">
                  <BsSearch color="#5E6164" size="14px" />
                </InputLeftElement>
                <Input
                  type="text"
                  variant="outline"
                  onChange={(e) => handleSearch(e.target.value)}
                  size="sm"
                  placeholder="Search"
                  borderRadius="6px"
                />
              </InputGroup>
            </Flex>
          </Stack>

          <Tabs>
            <TabList mb="1em">
              <Tab>{displayMode}</Tab>
              {/* Add other tabs as needed */}
            </TabList>
            <TabPanels>
              <TabPanel>
                {displayMode === 'subjects' && (
                  <SubjectsComponent
                    subjects={librarySubjects}
                    onSelectSubject={handleSubjectClick}
                  />
                )}
                {displayMode === 'topics' && (
                  <TopicsComponent
                    subjectId={selectedSubjectId}
                    onSelectSubject={handleTopicClick}
                  />
                )}
                {displayMode === 'cards' && (
                  <CardsComponent topicId={selectedTopicId} />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </>
  );
};

export default Library;
