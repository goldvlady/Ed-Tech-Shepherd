import EmptyIllustration from '../../../assets/empty_illustration.svg';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import DropDownFilter from '../../../components/CustomComponents/DropDownFilter';
import LoaderOverlay from '../../../components/loaderOverlay';
import { useSearch } from '../../../hooks';
import flashcardStore from '../../../state/flashcardStore';
import mnemonicStore from '../../../state/mnemonicStore';
import { FlashcardData } from '../../../types';
import MnemonicCard from '../FlashCards/components/mneomics_preview_card';
import { Stack } from '@chakra-ui/react';
import {
  Button,
  Flex,
  Text,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  MenuItem,
  MenuList,
  MenuButton,
  Menu,
  Tag,
  TagLabel,
  Image,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Library: React.FC = () => {
  const navigate = useNavigate();

  const toast = useCustomToast();
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<
    Array<string | number>
  >([]);

  const { fetchFlashcards, flashcards } = flashcardStore();

  const { fetchMnemonics, subjects, isLoading, mnemonics } = mnemonicStore();

  const actionFunc = useCallback(
    (query: string) => {
      if (!hasSearched) setHasSearched(true);
      fetchMnemonics({ search: query });
    },
    [fetchMnemonics, hasSearched]
  );

  const handleSearch = useSearch(actionFunc);

  const [tagEditItem, setTagEditItem] = useState<{
    flashcard?: FlashcardData;
    flashcardIds?: string[];
  } | null>(null);

  useEffect(() => {
    fetchMnemonics();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {isLoading && !mnemonics?.length && <LoaderOverlay />}

      {!mnemonics?.length && !hasSearched && !isLoading ? (
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
            <EmptyIllustration />
            <Text
              color="text.300"
              fontFamily="Inter"
              fontSize="16px"
              fontStyle="normal"
              fontWeight="500"
              lineHeight="21px"
              letterSpacing="0.112px"
            >
              You don’t have any mnemonic yet!
            </Text>
            <Button
              variant="solid"
              mt={{ base: '10px', md: '20px' }}
              width={{ base: '100%', sm: '80%', md: '300px' }}
              borderRadius={'8px'}
              colorScheme={'primary'}
              onClick={() => navigate('/dashboard/flashcards/create')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <Text ml={'10px'}>Create New</Text>
            </Button>
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
                  {mnemonics?.length || 0}
                </TagLabel>
              </Tag>
            </Box>
            <Button
              variant="solid"
              marginLeft={'20px'}
              borderRadius={'10px'}
              colorScheme={'primary'}
              onClick={() =>
                navigate('/dashboard/flashcards/create?type=mnemonics')
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>

              <Text marginLeft={'10px'}>Create Mnemonics</Text>
            </Button>
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
            {/* <Flex
              direction={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'flex-start', md: 'center' }}
              width={{ base: '100%', md: 'auto' }}
            >
              <DropDownFilter
                selectedItems={selectedSubjects}
                multi
                style={{ marginRight: '20px' }}
                filterLabel="Filter By Tags"
                onSelectionChange={(item) => {
                  const subjects = Array.isArray(item)
                    ? item.join(',')
                    : (item as string);

                  const query: { [key: string]: any } = {};
                  if (subjects || subjects.length) {
                    query.subjects = subjects;
                  }

                  fetchFlashcards(query);
                }}
                items={subjects.map((subjects) => ({
                  id: subjects,
                  value: subjects
                }))}
              />
              <Menu>
                <MenuButton>
                  <Flex
                    cursor="pointer"
                    border="1px solid #E5E6E6"
                    padding="5px 10px"
                    borderRadius="6px"
                    alignItems="center"
                    mb={{ base: '10px', md: '0' }}
                    width={{ base: '-webkit-fill-available', md: 'auto' }}
                  >
                    <Text
                      fontWeight="400"
                      fontSize={{ base: '12px', md: '14px' }}
                      marginRight="5px"
                      color="#5E6164"
                      width={{ base: '100%', md: 'auto' }}
                    >
                      Sort By
                    </Text>
                    <FaCalendarAlt color="#96999C" size="12px" />
                  </Flex>
                </MenuButton>
                <MenuList
                  fontSize="14px"
                  minWidth={'185px'}
                  borderRadius="8px"
                  backgroundColor="#FFFFFF"
                  boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
                >
                  <MenuItem
                    color="#212224"
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => fetchFlashcards({ sort: 'createdAt' })}
                    fontSize="14px"
                    lineHeight="20px"
                    fontWeight="400"
                    p="6px 8px 6px 8px"
                  >
                    Date
                  </MenuItem>
                  <MenuItem
                    color="#212224"
                    fontSize="14px"
                    onClick={() => fetchFlashcards({ sort: 'lastAttempted' })}
                    _hover={{ bgColor: '#F2F4F7' }}
                    lineHeight="20px"
                    fontWeight="400"
                    p="6px 8px 6px 8px"
                  >
                    Last Attempted
                  </MenuItem>
                  <MenuItem
                    _hover={{ bgColor: '#F2F4F7' }}
                    color="#212224"
                    fontSize="14px"
                    onClick={() => fetchFlashcards({ sort: 'deckname' })}
                    lineHeight="20px"
                    fontWeight="400"
                    p="6px 8px 6px 8px"
                  >
                    Deckname
                  </MenuItem>
                  <MenuItem
                    _hover={{ bgColor: '#F2F4F7' }}
                    color="#212224"
                    onClick={() => fetchFlashcards({ sort: 'subject' })}
                    fontSize="14px"
                    lineHeight="20px"
                    fontWeight="400"
                    p="6px 8px 6px 8px"
                  >
                    Subject
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex> */}
          </Stack>
          <Tabs>
            <TabList mb="1em">
              <Tab>Mnemonics</Tab>
              {/* Add other tabs as needed */}
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 2, xl: 3 }}
                  spacing={10}
                >
                  {mnemonics?.map((mnemonic) => (
                    <MnemonicCard
                      key={mnemonic.prompt}
                      answer={mnemonic.answer}
                      explanation={mnemonic.explanation}
                    />
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
          {/* <Box overflowX={{ base: 'scroll', md: 'hidden' }}>
            {selectedFlashcards.length ? (
              <Box>
                <Button
                  variant="solid"
                  mb="10px"
                  borderRadius={'10px'}
                  colorScheme={'#F53535'}
                  _hover={{ bg: '#F53535' }}
                  bg="#F53535"
                  width={{ base: '100%', md: 'auto' }}
                  onClick={() => {
                    if (!flashcards) return;
                    setDeleteItem((prev) => ({
                      ...prev,
                      currentDeleteType: 'multiple',
                      flashcardIds: selectedFlashcards
                    }));
                  }}
                >
                  <svg
                    width="16"
                    height="18"
                    viewBox="0 0 16 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.83317 4.00033V1.50033C3.83317 1.04009 4.20627 0.666992 4.6665 0.666992H14.6665C15.1267 0.666992 15.4998 1.04009 15.4998 1.50033V13.167C15.4998 13.6272 15.1267 14.0003 14.6665 14.0003H12.1665V16.4996C12.1665 16.9602 11.7916 17.3337 11.3275 17.3337H1.33888C0.875492 17.3337 0.5 16.9632 0.5 16.4996L0.502167 4.83438C0.50225 4.37375 0.8772 4.00033 1.34118 4.00033H3.83317ZM5.49983 4.00033H12.1665V12.3337H13.8332V2.33366H5.49983V4.00033ZM3.83317 8.16699V9.83366H8.83317V8.16699H3.83317ZM3.83317 11.5003V13.167H8.83317V11.5003H3.83317Z"
                      fill="white"
                    />
                  </svg>
                  <Text ml="5px">Delete Flashcards</Text>
                </Button>

                <Button
                  variant="solid"
                  mb="10px"
                  borderRadius={'10px'}
                  marginLeft={'10px'}
                  colorScheme={'primary'}
                  width={{ base: '100%', md: 'auto' }}
                  onClick={() => {
                    if (!flashcards) return;
                    setTagEditItem((prev) => ({
                      ...prev,
                      flashcardIds: selectedFlashcards
                    }));
                  }}
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

                  <Text ml="5px">Add Tag</Text>
                </Button>
              </Box>
            ) : (
              ''
            )}
            {flashcards && (
              <SelectableTable
                onSelect={(selected) => setSelectedFlashcard(selected)}
                isSelectable
                columns={columns}
                dataSource={flashcards.map((card) => ({
                  ...card,
                  key: card._id
                }))}
              />
            )}
          </Box> */}
        </Box>
      )}
    </>
  );
};

export default Library;
