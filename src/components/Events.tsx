import {
  convertTimeToDateTime,
  convertTimeToTimeZone,
  convertISOToCustomFormat,
  convertUtcToUserTime
} from '../util';
import { Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import React from 'react';
import { MdOutlineSentimentNeutral } from 'react-icons/md';

export default function Events({ event }: any) {
  // console.log("EVENT", event);
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

  const currentPath = window.location.pathname;

  const isTutor = currentPath.includes('/dashboard/tutordashboard/');

  return (
    <li className={`flex gap-x-3 ${getColorByEventType(event.type)}`}>
      <div
        className={`min-h-fit w-1 rounded-tr-full rounded-br-full ${getBgColorByEventType(
          event.type
        )}`}
      />
      <div className="py-2">
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
          </div>
        </div>
      </div>
    </li>
  );
}
