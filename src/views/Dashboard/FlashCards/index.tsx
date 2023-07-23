import EmptyIllustration from '../../../assets/empty_illustration.svg';
import { FlashCardModal } from '../../../components/flashcardDecks';
import LoaderOverlay from '../../../components/loaderOverlay';
import SelectableTable, { TableColumn } from '../../../components/table';
import { useSearch } from '../../../hooks';
import flashcardStore from '../../../state/flashcardStore';
import { FlashcardData, FlashcardQuestion } from '../../../types';
import { Score, MinimizedStudy } from '../../../types';
import { useToast } from '@chakra-ui/react';
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
  Image
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react';
import { isSameDay, isThisWeek, getISOWeek } from 'date-fns';
import { parseISO, format } from 'date-fns';
import { startCase } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaEllipsisH, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

const StyledImage = styled(Box)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 50%;
  height: 26px;
  width: 26px;
  border: 0.6px solid #eaeaeb;
  box-shadow: 0 2px 10px rgba(63, 81, 94, 0.1);
`;

export const DeleteModal = ({
  isOpen,
  onCancel,
  onDelete,
  isLoading
}: {
  isOpen: boolean;
  onCancel: () => void;
  onDelete: () => void;
  isLoading: boolean;
}) => {
  return (
    <Modal
      onClose={() => {
        return;
      }}
      isOpen={isOpen}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        minWidth={{ base: '80%', md: '500px' }}
        mx="auto"
        w="fit-content"
        borderRadius="10px"
      >
        <ModalBody alignItems={'center'} justifyContent={'center'}>
          <Flex
            flexDirection="column"
            justifyContent={'center'}
            padding={'40px'}
            alignItems="center"
          >
            <Box>
              <svg
                width="73"
                height="72"
                viewBox="0 0 73 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_2506_16927)">
                  <circle cx="36.5" cy="28" r="20" fill="white" />
                  <circle
                    cx="36.5"
                    cy="28"
                    r="19.65"
                    stroke="#EAEAEB"
                    stroke-width="0.7"
                  />
                </g>
                <path
                  d="M36.5002 37.1663C31.4376 37.1663 27.3335 33.0622 27.3335 27.9997C27.3335 22.9371 31.4376 18.833 36.5002 18.833C41.5627 18.833 45.6668 22.9371 45.6668 27.9997C45.6668 33.0622 41.5627 37.1663 36.5002 37.1663ZM35.5835 30.7497V32.583H37.4168V30.7497H35.5835ZM35.5835 23.4163V28.9163H37.4168V23.4163H35.5835Z"
                  fill="#F53535"
                />
                <defs>
                  <filter
                    id="filter0_d_2506_16927"
                    x="0.5"
                    y="0"
                    width="72"
                    height="72"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="8" />
                    <feGaussianBlur stdDeviation="8" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.32 0 0 0 0 0.389333 0 0 0 0 0.48 0 0 0 0.11 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_2506_16927"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_2506_16927"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </Box>
            <Text
              fontSize="18px"
              fontFamily="Inter"
              fontStyle="normal"
              fontWeight="500"
              lineHeight="21px"
              marginBottom={'10px'}
              letterSpacing="0.112px"
              color="#212224"
            >
              Delete flashcard?
            </Text>
            <Text
              color="#6E7682"
              textAlign="center"
              fontSize="14px"
              fontFamily="Inter"
              width={'80%'}
              fontStyle="normal"
              fontWeight="400"
              lineHeight="20px"
            >
              This will permanently remove this flashcard from your list.
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter
          bg="#F7F7F8"
          borderRadius="0px 0px 10px 10px"
          p="16px"
          justifyContent="flex-end"
        >
          <Button
            disabled={isLoading}
            _hover={{
              backgroundColor: '#FFF',
              boxShadow: '0px 2px 6px 0px rgba(136, 139, 143, 0.10)'
            }}
            color="#5C5F64"
            fontSize="14px"
            fontFamily="Inter"
            fontWeight="500"
            lineHeight="20px"
            onClick={() => onCancel()}
            borderRadius="8px"
            border="1px solid #E7E8E9"
            bg="#FFF"
            boxShadow="0px 2px 6px 0px rgba(136, 139, 143, 0.10)"
            mr={3}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            _hover={{
              backgroundColor: '#F53535'
            }}
            onClick={() => onDelete()}
            bg="#F53535"
            color="#ffffff"
            borderRadius="6px"
            px="16px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

type DataSourceItem = {
  key: string;
  deckname: string;
  studyType: string;
  studyPeriod: string;
  createdAt: string;
  scores: Score[];
  questions: FlashcardQuestion[];
  currentStudy?: MinimizedStudy;
};

// const dataSource: DataSourceItem[] = Array.from({ length: 10 }, (_, i) => ({
//   key: i,
//   title: `Title ${i + 1}`,
//   dateCreated: new Date().toISOString().split("T")[0], // current date in yyyy-mm-dd format
//   lastModified: new Date().toISOString().split("T")[0], // current date in yyyy-mm-dd format
//   lastAttemptedScore: Math.floor(Math.random() * 101), // random score between 0 and 100
// }));

function findNextFlashcard(
  flashcards: FlashcardData[]
): FlashcardData | undefined {
  // Order of preference for studyPeriods
  const studyPeriodPreference = [
    'daily',
    'weekly',
    'biweekly',
    'spacedRepetition'
  ];

  // Sort flashcards based on studyPeriodPreference
  const sortedFlashcards = flashcards.sort((a, b) => {
    return (
      studyPeriodPreference.indexOf(a.studyPeriod) -
      studyPeriodPreference.indexOf(b.studyPeriod)
    );
  });

  // Get today's date
  const today = new Date();

  // Go through sorted flashcards to find the one that should be loaded
  for (const card of sortedFlashcards) {
    // Get date of last attempt
    const lastAttemptDate =
      card.scores.length > 0
        ? new Date(card.scores[card.scores.length - 1].date)
        : undefined;

    // Check if the flashcard should be attempted today based on its studyPeriod
    switch (card.studyPeriod) {
      case 'daily':
        if (!lastAttemptDate || !isSameDay(lastAttemptDate, today)) {
          return card;
        }
        break;
      case 'weekly':
        if (!lastAttemptDate || !isThisWeek(lastAttemptDate)) {
          return card;
        }
        break;
      case 'biweekly':
        if (
          !lastAttemptDate ||
          !isThisWeek(lastAttemptDate) ||
          getISOWeek(today) % 2 === 0
        ) {
          return card;
        }
        break;
      case 'spacedRepetition':
        // In case of spaced repetition, load the card only if it's due
        // Here we need more information on how the spaced repetition should work
        break;
      default:
        break;
    }
  }

  // If no card is found, return undefined
  return undefined;
}

const CustomTable: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [hasSearched, setHasSearched] = useState(false);

  const {
    fetchFlashcards,
    flashcards,
    flashcard,
    loadFlashcard,
    deleteFlashCard,
    isLoading
  } = flashcardStore();

  const actionFunc = useCallback(
    (query: string) => {
      if (!hasSearched) setHasSearched(true);
      fetchFlashcards({ search: query });
    },
    [fetchFlashcards, hasSearched]
  );

  const handleSearch = useSearch(actionFunc);

  const [deleteItem, setDeleteItem] = useState<{
    flashcard: FlashcardData;
  } | null>(null);

  useEffect(() => {
    fetchFlashcards();
    // eslint-disable-next-line
  }, []);

  const columns: TableColumn<DataSourceItem>[] = [
    {
      title: 'Deckname',
      dataIndex: 'deckname',
      key: 'deckname',
      render: ({ deckname }) => <Text fontWeight="500">{deckname}</Text>
    },
    {
      title: 'Study Type',
      dataIndex: 'studyType',
      key: 'studyType',
      render: ({ studyType }) => {
        return (
          <Text>
            {startCase(studyType.replace(/([a-z])([A-Z])/g, '$1 $2'))}
          </Text>
        );
      }
    },
    {
      title: 'Study Period',
      dataIndex: 'studyPeriod',
      key: 'studyPeriod',
      render: ({ studyPeriod }) => {
        return <Text>{startCase(studyPeriod)}</Text>;
      }
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: ({ createdAt }) => {
        const date = parseISO(createdAt); // parse the date string into a Date object
        const formattedDate = format(date, 'dd-MMMM-yyyy'); // format the date
        return <Text>{formattedDate}</Text>;
      }
    },
    {
      title: 'Last Attempted',
      key: 'lastAttempted',
      render: ({ scores }) => {
        if (!scores?.length) return <Text>N/A</Text>;
        const date = parseISO(scores[scores.length - 1].date);
        const formattedDate = format(date, 'dd-MMMM-yyyy');
        return (
          <Text>{formattedDate.replace('pm', 'PM').replace('am', 'AM')}</Text>
        );
      }
    },
    {
      title: 'Last Attempted Score',
      key: 'lastAttemptedScore',
      render: ({ scores, questions }) => {
        if (!scores?.length) return <Text fontWeight="500">N/A</Text>;
        const percentage = (
          (scores[scores.length - 1]?.score / questions.length) *
          100
        ).toFixed(0);
        return <Text fontWeight="500">{percentage}%</Text>;
      }
    },
    {
      title: '',
      key: 'action',
      render: (flashcard) => (
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
            fontSize="14px"
            minWidth={'185px'}
            borderRadius="8px"
            backgroundColor="#FFFFFF"
            boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
          >
            {flashcard.currentStudy && (
              <MenuItem
                p="6px 8px 6px 8px"
                _hover={{ bgColor: '#F2F4F7' }}
                onClick={() =>
                  loadFlashcard(flashcard.key, flashcard.currentStudy)
                }
              >
                <StyledImage marginRight="10px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="10"
                    height="14"
                  >
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </StyledImage>

                <Text
                  color="#212224"
                  fontSize="14px"
                  lineHeight="20px"
                  fontWeight="400"
                >
                  Resume
                </Text>
              </MenuItem>
            )}
            <MenuItem
              p="6px 8px 6px 8px"
              _hover={{ bgColor: '#F2F4F7' }}
              onClick={() => loadFlashcard(flashcard.key)}
            >
              <StyledImage marginRight="10px">
                <svg
                  width="10"
                  height="14"
                  viewBox="0 0 10 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5835 5.83301H9.66683L4.41683 13.4163V8.16634H0.333496L5.5835 0.583008V5.83301Z"
                    fill="#6E7682"
                  />
                </svg>
              </StyledImage>

              <Text
                color="#212224"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="400"
              >
                Study
              </Text>
            </MenuItem>
            {/* <MenuItem p="6px 8px 6px 8px" _hover={{ bgColor: "#F2F4F7" }}>
              <StyledImage marginRight="10px">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.243811 6.9511C0.137604 6.31182 0.14111 5.66963 0.244325 5.04867C0.886697 5.0643 1.46441 4.75612 1.68895 4.21404C1.91348 3.67197 1.72289 3.04554 1.25764 2.60235C1.62373 2.09028 2.07534 1.63371 2.60248 1.25678C3.0457 1.72231 3.67231 1.91306 4.21453 1.68846C4.75675 1.46387 5.06497 0.885899 5.04917 0.243322C5.68844 0.137115 6.33063 0.140621 6.95159 0.243842C6.93596 0.886208 7.24419 1.46392 7.78622 1.68846C8.32832 1.913 8.95476 1.7224 9.39792 1.25715C9.91002 1.62324 10.3666 2.07485 10.7435 2.602C10.278 3.04521 10.0872 3.67182 10.3118 4.21404C10.5364 4.75626 11.1144 5.06448 11.757 5.04867C11.8631 5.68795 11.8596 6.33014 11.7564 6.9511C11.1141 6.93552 10.5363 7.2437 10.3118 7.78573C10.0873 8.32782 10.2779 8.95426 10.7431 9.39742C10.377 9.90953 9.92542 10.3661 9.39826 10.743C8.95505 10.2775 8.32843 10.0867 7.78622 10.3113C7.24402 10.5359 6.93584 11.1139 6.95159 11.7565C6.31232 11.8627 5.67012 11.8592 5.04917 11.756C5.0648 11.1136 4.75661 10.5359 4.21453 10.3113C3.67246 10.0868 3.04603 10.2774 2.60284 10.7426C2.09077 10.3765 1.6342 9.92493 1.25727 9.39783C1.72279 8.95461 1.91354 8.328 1.68895 7.78573C1.46435 7.24352 0.886388 6.93535 0.243811 6.9511ZM6.00041 7.74991C6.96687 7.74991 7.75041 6.96638 7.75041 5.99991C7.75041 5.03339 6.96687 4.2499 6.00041 4.2499C5.03388 4.2499 4.25038 5.03339 4.25038 5.99991C4.25038 6.96638 5.03388 7.74991 6.00041 7.74991Z"
                    fill="#6E7682"
                  />
                </svg>
              </StyledImage>

              <Text
                color="#212224"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="400"
              >
                Update Setting
              </Text>
            </MenuItem> */}
            <MenuItem
              p="6px 8px 6px 8px"
              color="#F53535"
              onClick={() =>
                setDeleteItem({
                  flashcard: flashcard as unknown as FlashcardData
                })
              }
              _hover={{ bgColor: '#F2F4F7' }}
            >
              <StyledImage marginRight="10px">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.08317 2.50033V0.750326C3.08317 0.428162 3.34434 0.166992 3.6665 0.166992H8.33317C8.65535 0.166992 8.9165 0.428162 8.9165 0.750326V2.50033H11.8332V3.66699H10.6665V11.2503C10.6665 11.5725 10.4053 11.8337 10.0832 11.8337H1.9165C1.59434 11.8337 1.33317 11.5725 1.33317 11.2503V3.66699H0.166504V2.50033H3.08317ZM4.24984 1.33366V2.50033H7.74984V1.33366H4.24984Z"
                    fill="#F53535"
                  />
                </svg>
              </StyledImage>

              <Text fontSize="14px" lineHeight="20px" fontWeight="400">
                Delete
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      )
    }
    // rest of your columns...
  ];

  return (
    <>
      {isLoading && <LoaderOverlay />}
      <FlashCardModal isOpen={Boolean(flashcard)} />
      <DeleteModal
        isLoading={isLoading}
        isOpen={Boolean(deleteItem)}
        onCancel={() => setDeleteItem(null)}
        onDelete={async () => {
          if (deleteFlashCard) {
            const isDeleted = await deleteFlashCard(
              deleteItem?.flashcard._id as string
            );
            if (isDeleted) {
              toast({
                title: `${deleteItem?.flashcard.deckname} deleted Succesfully`,
                status: 'success'
              });
              setDeleteItem(null);
            } else {
              toast({
                title: `Failed to delete ${deleteItem?.flashcard.deckname} flashcards`,
                status: 'error'
              });
            }
          }
        }}
      />
      {!flashcards?.length && !hasSearched && !isLoading ? (
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
            paddingTop={'20px'}
            paddingLeft="20px"
          >
            <Text
              fontFamily="Inter"
              fontWeight="600"
              fontSize="24px"
              lineHeight="30px"
              letterSpacing="-2%"
              color="#212224"
            >
              Flashcard
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
            <Image src={EmptyIllustration} />
            <Text
              color="text.300"
              fontFamily="Inter"
              fontSize="16px"
              fontStyle="normal"
              fontWeight="500"
              lineHeight="21px"
              letterSpacing="0.112px"
            >
              You don’t have any flashcards yet!
            </Text>
            <Button
              variant="solid"
              marginTop={'20px'}
              width={{ sm: '80%', md: '300px' }}
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

              <Text marginLeft={'10px'}>Create New</Text>
            </Button>
          </Box>
        </Box>
      ) : (
        <Box padding={'50px'}>
          <Flex
            width="100%"
            marginBottom={'40px'}
            alignItems="center"
            justifyContent="space-between"
            paddingRight={'20px'}
            color="#E5E6E6"
          >
            <Text
              fontFamily="Inter"
              fontWeight="600"
              fontSize="24px"
              lineHeight="30px"
              letterSpacing="-2%"
              color="#212224"
            >
              Flashcard
            </Text>
            <Button
              variant="solid"
              marginLeft={'20px'}
              borderRadius={'10px'}
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

              <Text marginLeft={'10px'}>Create a Flashcard</Text>
            </Button>
            {/* <Flex
            cursor={"pointer"}
            border="1px solid #E5E6E6"
            padding="5px 10px"
            borderRadius={"6px"}
            alignItems="center"
          >
            

            <Text
              fontWeight="400"
              fontSize="14px"
              marginRight={"5px"}
              color="#5E6164"
            >
              All Time
            </Text>
            <FaCalendarAlt color="#96999C" size="12px" />
          </Flex> */}
          </Flex>
          <Flex
            width="100%"
            marginBottom="40px"
            alignItems="center"
            justifyContent="space-between"
            paddingRight="20px"
            color="#E5E6E6"
          >
            <Flex alignItems="center">
              <InputGroup
                size="sm"
                borderRadius="6px"
                width="200px"
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
                  placeholder="     Search"
                  borderRadius="6px"
                />
              </InputGroup>
            </Flex>
            <Flex>
              <Flex
                cursor="pointer"
                border="1px solid #E5E6E6"
                padding="5px 10px"
                borderRadius="6px"
                alignItems="center"
              >
                <Text
                  fontWeight="400"
                  fontSize="14px"
                  marginRight="5px"
                  color="#5E6164"
                >
                  All Time
                </Text>
                <FaCalendarAlt color="#96999C" size="12px" />
              </Flex>
              <Button
                variant="solid"
                marginLeft={'20px'}
                borderRadius={'10px'}
                colorScheme={'primary'}
                onClick={() => {
                  if (!flashcards) return;
                  const nextFlashCard = findNextFlashcard(flashcards);
                  if (!nextFlashCard) {
                    toast({
                      title: 'You have attempted all flashcards for this week',
                      status: 'info'
                    });
                  } else {
                    loadFlashcard(nextFlashCard?._id);
                  }
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

                <Text marginLeft={'10px'}>Practice today's cards</Text>
              </Button>
            </Flex>
          </Flex>
          {flashcards && (
            <SelectableTable
              isSelectable
              columns={columns}
              dataSource={flashcards.map((card) => ({
                ...card,
                key: card._id
              }))}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default CustomTable;
