import EmptyIllustration from '../../../assets/empty_illustration.svg';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import { FlashCardModal } from '../../../components/flashcardDecks';
import LoaderOverlay from '../../../components/loaderOverlay';
import SelectableTable, { TableColumn } from '../../../components/table';
import { useSearch } from '../../../hooks';
import flashcardStore from '../../../state/flashcardStore';
import {
  FlashcardData,
  FlashcardQuestion,
  SchedulePayload
} from '../../../types';
import { Score, MinimizedStudy } from '../../../types';
import { DeleteModal } from './components/deleteModal';
import ScheduleStudyModal, {
  ScheduleFormState
} from './components/scheduleModal';
import TagModal from './components/tagsModal';
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
  TagLeftIcon,
  Image
} from '@chakra-ui/react';
import { isSameDay, isThisWeek, getISOWeek } from 'date-fns';
import { parseISO, format, parse } from 'date-fns';
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

type DataSourceItem = {
  key: string;
  deckname: string;
  studyPeriod: string;
  createdAt: string;
  scores: Score[];
  questions: FlashcardQuestion[];
  currentStudy?: MinimizedStudy;
  tags: string[];
};

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
  const toast = useCustomToast();
  const [hasSearched, setHasSearched] = useState(false);

  const {
    fetchFlashcards,
    flashcards,
    flashcard,
    loadFlashcard,
    deleteFlashCard,
    storeFlashcardTags,
    isLoading,
    scheduleFlashcard
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

  const [scheduleItem, setScheduleItem] = useState<{
    flashcard: FlashcardData;
  } | null>(null);

  const [tagEditItem, setTagEditItem] = useState<{
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
      title: 'Study Period',
      dataIndex: 'studyPeriod',
      key: 'studyPeriod',
      render: ({ studyPeriod }) => {
        return <Text fontWeight="500">{startCase(studyPeriod)}</Text>;
      }
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: ({ tags }) => {
        if (!tags.length) return <Text fontWeight="500">None</Text>;
        return (
          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 0.5fr)"
            alignItems="start"
            justifyItems="start"
            width="100%"
            marginTop="10px"
            gridGap="10px"
          >
            {tags.map((tag) => (
              <Tag key={tag} borderRadius="5" background="#f7f8fa" size="md">
                <TagLeftIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    width="25px"
                    height="25px"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 6h.008v.008H6V6z"
                    />
                  </svg>
                </TagLeftIcon>
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </Box>
        );
      }
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: ({ createdAt }) => {
        const date = parseISO(createdAt); // parse the date string into a Date object
        const formattedDate = format(date, 'dd-MMMM-yyyy'); // format the date
        return <Text fontWeight="500">{formattedDate}</Text>;
      }
    },
    {
      title: 'Last Attempted',
      key: 'lastAttempted',
      render: ({ scores }) => {
        if (!scores?.length) return <Text>Not Attempted</Text>;
        const date = parseISO(scores[scores.length - 1].date);
        const formattedDate = format(date, 'dd-MMMM-yyyy');
        return (
          <Text fontWeight="500">
            {formattedDate.replace('pm', 'PM').replace('am', 'AM')}
          </Text>
        );
      }
    },
    {
      title: 'Last Attempted Score',
      key: 'lastAttemptedScore',
      render: ({ scores, questions }) => {
        if (!scores?.length) return <Text fontWeight="500">Not Attempted</Text>;
        const percentage =
          (scores[scores.length - 1]?.score / questions.length) * 100;
        const percentageString = percentage.toFixed(0);
        type ColorRange = {
          max: number;
          min: number;
          color: string;
          backgroundColor: string;
        };
        const colorRanges: ColorRange[] = [
          { max: 100, min: 85.1, color: '#4CAF50', backgroundColor: '#EDF7EE' },
          { max: 85, min: 60, color: '#FB8441', backgroundColor: '#FFEFE6' },
          { max: 59.9, min: 0, color: '#F53535', backgroundColor: '#FEECEC' }
        ];

        const { color, backgroundColor } = colorRanges.find(
          (range) => percentage <= range.max && percentage >= range.min
        ) as ColorRange;
        return (
          <Box width={'fit-content'}>
            <Box
              padding="5px 10px"
              color={color}
              background={backgroundColor}
              borderRadius={'5px'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Text fontSize={'14px'} fontWeight="bold">
                {percentageString}%
              </Text>
            </Box>
          </Box>
        );
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
            <MenuItem
              p="6px 8px 6px 8px"
              onClick={() =>
                setScheduleItem({
                  flashcard: flashcard as unknown as FlashcardData
                })
              }
              _hover={{ bgColor: '#F2F4F7' }}
            >
              <StyledImage marginRight="10px">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="12"
                  height="12"
                >
                  <path
                    fillRule="evenodd"
                    fill="#6E7682"
                    d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </StyledImage>

              <Text
                color="#212224"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="400"
              >
                Schedule
              </Text>
            </MenuItem>
            <MenuItem
              p="6px 8px 6px 8px"
              onClick={() =>
                setTagEditItem({
                  flashcard: flashcard as unknown as FlashcardData
                })
              }
              _hover={{ bgColor: '#F2F4F7' }}
            >
              <StyledImage marginRight="10px">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    fill="#6E7682"
                    d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
                    clipRule="evenodd"
                  />
                </svg>

                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="12"
                  height="12"
                >
                  <path
                    fillRule="evenodd"
                    fill="#6E7682"
                    d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                    clipRule="evenodd"
                  />
                </svg> */}
              </StyledImage>

              <Text
                color="#212224"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="400"
              >
                Edit Tags
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
  ];

  const handleEventSchedule = async (data: ScheduleFormState) => {
    const parsedTime = parse(data.time.toLowerCase(), 'hh:mm aa', new Date());
    const time = format(parsedTime, 'HH:mm');

    const payload: SchedulePayload = {
      entityId: scheduleItem?.flashcard._id as string,
      entityType: 'flashcard',
      startDates: [data.day?.toISOString() as string],
      startTime: time
    };

    if (data.frequency && data.frequency !== 'none') {
      payload.recurrence = { frequency: data.frequency };
    }
    const isSuccess = await scheduleFlashcard(payload);
    if (isSuccess) {
      toast({
        position: 'top-right',
        title: `${scheduleItem?.flashcard.deckname} Scheduled Succesfully`,
        status: 'success'
      });
      setScheduleItem(null);
    } else {
      toast({
        position: 'top-right',
        title: `Failed to schedule ${scheduleItem?.flashcard.deckname} flashcards`,
        status: 'error'
      });
    }
  };

  return (
    <>
      {isLoading && !flashcards?.length && <LoaderOverlay />}
      <FlashCardModal isOpen={Boolean(flashcard)} />
      {tagEditItem?.flashcard && (
        <TagModal
          tags={tagEditItem?.flashcard?.tags || []}
          onSubmit={async (d) => {
            const isSaved = await storeFlashcardTags(
              tagEditItem?.flashcard?._id as string,
              d
            );
            if (isSaved) {
              toast({
                position: 'top-right',
                title: `Tags Added for ${tagEditItem?.flashcard.deckname}`,
                status: 'success'
              });
              setTagEditItem(null);
            } else {
              toast({
                position: 'top-right',
                title: `Failed to add tags for ${tagEditItem?.flashcard.deckname} flashcards`,
                status: 'error'
              });
            }
          }}
          onClose={() => setTagEditItem(null)}
          isOpen={Boolean(tagEditItem)}
        />
      )}
      <ScheduleStudyModal
        isLoading={isLoading}
        onSumbit={(d) => handleEventSchedule(d)}
        onClose={() => setScheduleItem(null)}
        isOpen={Boolean(scheduleItem)}
      />
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
                position: 'top-right',
                title: `${deleteItem?.flashcard.deckname} deleted Succesfully`,
                status: 'success'
              });
              setDeleteItem(null);
            } else {
              toast({
                position: 'top-right',
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
          padding={{ md: '50px', base: '20px' }}
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
                  placeholder="     Search"
                  borderRadius="6px"
                />
              </InputGroup>
            </Flex>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'flex-start', md: 'center' }}
              width={{ base: '100%', md: 'auto' }}
            >
              <Flex
                display={'none'}
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
                  All Time
                </Text>
                <FaCalendarAlt color="#96999C" size="12px" />
              </Flex>
              <Button
                variant="solid"
                ml={{ base: '0', md: '20px' }}
                borderRadius={'10px'}
                colorScheme={'primary'}
                width={{ base: '100%', md: 'auto' }}
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

                <Text ml={'10px'}>Practice today's cards</Text>
              </Button>
            </Flex>
          </Stack>
          <Box overflowX={{ base: 'scroll', md: 'hidden' }}>
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
        </Box>
      )}
    </>
  );
};

export default CustomTable;
