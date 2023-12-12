import ApiService from '../services/ApiService';
import flashcardStore from '../state/flashcardStore';
import { FlashcardData, FlashcardQuestion, SchedulePayload } from '../types';
import {
  convertTimeToDateTime,
  convertTimeToTimeZone,
  convertISOToCustomFormat,
  convertUtcToUserTime
} from '../util';
import ScheduleStudyModal, {
  ScheduleFormState
} from '../views/Dashboard/FlashCards/components/scheduleModal';
import CalendarDateInput from './CalendarDateInput';
import { useCustomToast } from './CustomComponents/CustomToast/useCustomToast';
import { CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Box,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Spacer,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { isSameDay, isThisWeek, getISOWeek } from 'date-fns';
import { parseISO, format, parse } from 'date-fns';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { MdOutlineSentimentNeutral, MdOutlineReplay } from 'react-icons/md';
import { useNavigate } from 'react-router';

export default function Events({ event }: any) {
  const {
    isOpen: isOpenReBook,
    onOpen: onOpenReBook,
    onClose: onCloseReBook
  } = useDisclosure();

  const {
    isOpen: isOpenCancelStudy,
    onOpen: onOpenCancelStudy,
    onClose: onCloseCancelStudy
  } = useDisclosure();

  const today = useMemo(() => new Date(), []);

  const getTextByEventType = (eventType, name) => {
    switch (eventType) {
      case 'study':
        return `Flashcard deck "${name}" practice`;
      case 'booking':
        return `${name.subject} lesson with ${name.tutor} `;

      default:
        return undefined;
    }
  };

  const getBgColorByEventType = (eventType) => {
    switch (eventType) {
      case 'study':
        return `bg-green-500`;
      case 'booking':
        return `bg-orange-500`;
      default:
        return undefined;
    }
  };
  const getColorByEventType = (eventType) => {
    switch (eventType) {
      case 'study':
        return `bg-green-50`;
      case 'booking':
        return `bg-orange-50`;
      default:
        return undefined;
    }
  };
  const getHoverColorByEventType = (eventType) => {
    switch (eventType) {
      case 'study':
        return `hover:bg-emerald-50`;
      case 'booking':
        return `hover:bg-amber-50`;
      default:
        return undefined;
    }
  };

  function extractAndConvertTimeFromUTC(
    utcDateString: string,
    userTimeZone: string
  ): string {
    // Parse the UTC date string
    const utcDate = moment.utc(utcDateString);
    // Convert the UTC date to the user's local timezone
    const localDate = utcDate.clone().tz(userTimeZone);
    // Extract the time part in the user's local timezone
    const localTime = localDate.format('hh:mm A');
    return localTime;
  }
  const navigate = useNavigate();

  const currentPath = window.location.pathname;

  const isTutor = currentPath.includes('/dashboard/tutordashboard/');

  const {
    fetchFlashcards,
    setShowStudyList,
    flashcards,
    tags,
    loadFlashcard,
    deleteFlashCard,
    storeFlashcardTags,
    isLoading,
    scheduleFlashcard,
    rescheduleFlashcard,
    pagination,
    loadTodaysFlashcards,
    dailyFlashcards
  } = flashcardStore();

  const toast = useCustomToast();

  const [scheduleItem, setScheduleItem] = useState(null);
  const [reScheduleItem, setReScheduleItem] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newDate, setNewDate] = useState<Date>();

  const handleEventSchedule = async (data: ScheduleFormState) => {
    const parsedTime = parse(data.time.toLowerCase(), 'hh:mm aa', new Date());
    const time = format(parsedTime, 'HH:mm');

    const rePayload = {
      eventId: scheduleItem._id,
      updates: {
        startDate: data.day?.toISOString() as string,
        startTime: time,
        isActive: true
      }
    };

    const isSuccess = await rescheduleFlashcard(rePayload);
    if (isSuccess) {
      toast({
        position: 'top-right',
        title: `${scheduleItem?.entity.deckname} Rescheduled Succesfully`,
        status: 'success'
      });
      setScheduleItem(null);
    } else {
      toast({
        position: 'top-right',
        title: `Failed to reschedule ${scheduleItem?.entity.deckname} flashcards`,
        status: 'error'
      });
    }
  };

  const rebook = async () => {
    const payload = {
      bookingId: scheduleItem._id,
      updates: {
        endDate: newDate
      }
    };
    const response = await ApiService.reScheduleBooking(payload);
    if (response.status === 200) {
      toast({
        position: 'top-right',
        title: `Booking Rescheduled Succesfully`,
        status: 'success'
      });
      setScheduleItem(null);
    } else {
      toast({
        position: 'top-right',
        title: `Failed to reschedule booking`,
        status: 'error'
      });
    }
  };

  const handleCancelEvent = async () => {
    const rePayload = {
      eventId: scheduleItem._id,
      updates: {
        isActive: false
      }
    };

    const isSuccess = await rescheduleFlashcard(rePayload);
    if (isSuccess) {
      toast({
        position: 'top-right',
        title: `${scheduleItem?.entity.deckname} Study Canceled Succesfully`,
        status: 'success'
      });
      setScheduleItem(null);
      onCloseCancelStudy();
    } else {
      toast({
        position: 'top-right',
        title: `Failed to cancel ${scheduleItem?.entity.deckname} flashcard study`,
        status: 'error'
      });
    }
  };
  return (
    <li
      className={`flex gap-x-3 cursor-pointer hover:drop-shadow-sm ${getColorByEventType(
        event.type
      )} ${getHoverColorByEventType(event.type)}`}
      onClick={() => {
        navigate(
          `${
            event.type === 'study'
              ? `/dashboard/flashcards/${event.data.entity.id}`
              : `/dashboard`
          }`
        );
      }}
    >
      <div
        className={`min-h-fit w-1 rounded-tr-full rounded-br-full ${getBgColorByEventType(
          event.type
        )}`}
      />
      <div className="py-2 w-full">
        <div className="flex gap-x-1">
          <div className="min-w-0 flex-auto">
            <Text className="text-xs font-normal leading-6 text-gray-500">
              {getTextByEventType(
                event.type,
                event.data.entity?.deckname
                  ? event.data.entity.deckname
                  : {
                      subject: event.data?.offer?.course?.label,
                      tutor: `${event.data?.offer?.tutor?.user?.name?.first} ${event.data?.offer?.tutor?.user?.name?.last}`
                    }
              )}
            </Text>
            <Flex alignItems={'center'}>
              {' '}
              <Text className="mt-1 flex items-center truncate text-xs leading-5 text-gray-500">
                <span>
                  {convertUtcToUserTime(event.data.startDate)}
                  {/* Format the time as "11:00 AM" */}
                </span>
                {event.type !== 'study' && (
                  <>
                    {' '}
                    <ChevronRightIcon className="w-4 h-4" />
                    <span>{convertUtcToUserTime(event.data.endDate)}</span>
                  </>
                )}
              </Text>
              <Spacer />
              <HStack color="#6b7280" mx={2}>
                {' '}
                <MdOutlineReplay
                  onClick={(e) => {
                    e.stopPropagation();
                    setScheduleItem(event.data);
                    event.type === 'study'
                      ? setReScheduleItem(true)
                      : onOpenReBook();
                  }}
                />
                {event.type !== 'booking' && (
                  <CloseIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setScheduleItem(event.data);
                      onOpenCancelStudy();
                    }}
                    boxSize={2}
                  />
                )}
              </HStack>
            </Flex>
          </div>
        </div>
      </div>
      <ScheduleStudyModal
        isLoading={isLoading}
        onSumbit={(d) => handleEventSchedule(d)}
        onClose={() => setReScheduleItem(false)}
        isOpen={reScheduleItem}
      />
      <Modal isOpen={isOpenReBook} onClose={onCloseReBook}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reschedule Booking</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow="auto">
            <Box width="100%" paddingBottom={'50px'}>
              <FormControl id="newDate" marginBottom="20px">
                <FormLabel>Day</FormLabel>
                <CalendarDateInput
                  disabledDate={{ before: today }}
                  inputProps={{
                    placeholder: 'Select Day'
                  }}
                  value={newDate as Date}
                  onChange={(value) => {
                    setNewDate(value);
                  }}
                />
              </FormControl>
            </Box>
          </ModalBody>

          <ModalFooter
            bg="#F7F7F8"
            borderRadius="0px 0px 10px 10px"
            p="16px"
            justifyContent="flex-end"
          >
            <Button
              isDisabled={!newDate}
              _hover={{
                backgroundColor: '#207DF7',
                boxShadow: '0px 2px 6px 0px rgba(136, 139, 143, 0.10)'
              }}
              bg="#207DF7"
              color="#FFF"
              fontSize="14px"
              fontFamily="Inter"
              fontWeight="500"
              lineHeight="20px"
              onClick={() => rebook()}
              isLoading={isLoading}
              borderRadius="8px"
              boxShadow="0px 2px 6px 0px rgba(136, 139, 143, 0.10)"
              mr={3}
              variant="primary"
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenCancelStudy} onClose={onCloseCancelStudy}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Study Cancellation</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto">
            <Box width="100%" paddingBottom={'50px'}>
              <Text>
                Are you sure you want to Cancel {scheduleItem?.entity?.deckname}{' '}
                study event
              </Text>
            </Box>
          </ModalBody>

          <ModalFooter
            bg="#F7F7F8"
            borderRadius="0px 0px 10px 10px"
            p="16px"
            justifyContent="flex-end"
          >
            <Button
              _hover={{
                backgroundColor: 'red',
                boxShadow: '0px 2px 6px 0px rgba(136, 139, 143, 0.10)'
              }}
              bg="red"
              color="#FFF"
              fontSize="14px"
              fontFamily="Inter"
              fontWeight="500"
              lineHeight="20px"
              onClick={() => handleCancelEvent()}
              isLoading={isLoading}
              borderRadius="8px"
              boxShadow="0px 2px 6px 0px rgba(136, 139, 143, 0.10)"
              mr={3}
              variant="primary"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </li>
  );
}
