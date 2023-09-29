import Check from '../../../assets/check.svg';
import Day from '../../../assets/day.svg';
import {
  calculateTimeDifference,
  convertTimeStringToISOString
} from '../../../util';
import {
  Box,
  Flex,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import React from 'react';

function AvailabilityTable(props) {
  const { data } = props;
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  const fixedTimeSlots = [
    '8AM -> 12PM',
    '12PM -> 5PM',
    '5PM -> 9PM',
    '9PM -> 12AM'
  ];

  const timeSlotsInUserTimezone = fixedTimeSlots.map((timeSlot) => {
    const [startTime, endTime] = timeSlot.split(' -> ');

    const startTimeInUserTimezone = calculateTimeDifference(
      convertTimeStringToISOString(startTime),
      data.tz
    );

    const endTimeInUserTimezone = calculateTimeDifference(
      convertTimeStringToISOString(endTime),
      data.tz
    );

    let timeSlotInUserTimezone = `${startTimeInUserTimezone} -> ${endTimeInUserTimezone}`;
    console.log('tz', timeSlotInUserTimezone);

    timeSlotInUserTimezone = timeSlotInUserTimezone.replace(/:\d+\s/g, '');

    return timeSlotInUserTimezone;
  });
  const fixedTimeSlotswithTimezone = timeSlotsInUserTimezone;

  return (
    <>
      <TableContainer my={2}>
        <Box
          border={'1px solid #EEEFF2'}
          borderRadius={8}
          // width="700px"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th width={'155px'}></Th>
                {daysOfWeek.map((day, index) => (
                  <Th key={index}>{day}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {fixedTimeSlotswithTimezone.map((timeSlot, timeIndex) => (
                <Tr key={timeIndex}>
                  <Td fontSize={12}>
                    <Flex>
                      <Image src={Day} ml={-15} /> {timeSlot}
                    </Flex>
                  </Td>
                  {daysOfWeek.map((day, dayIndex) => (
                    <Td
                      key={dayIndex}
                      className={
                        data.schedule[dayIndex.toString()] &&
                        data.schedule[dayIndex.toString()].some(
                          (slot) =>
                            calculateTimeDifference(
                              convertTimeStringToISOString(slot.begin),
                              data.tz
                            ) === timeSlot.split(' ')[0] &&
                            calculateTimeDifference(
                              convertTimeStringToISOString(slot.end),
                              data.tz
                            ) === timeSlot.split(' ')[2]
                        )
                          ? ''
                          : 'stripeBox'
                      }
                    >
                      {data.schedule[dayIndex.toString()] &&
                      data.schedule[dayIndex.toString()].some(
                        (slot) =>
                          calculateTimeDifference(
                            convertTimeStringToISOString(slot.begin),
                            data.tz
                          ) === timeSlot.split(' ')[0] &&
                          calculateTimeDifference(
                            convertTimeStringToISOString(slot.end),
                            data.tz
                          ) === timeSlot.split(' ')[2]
                      ) ? (
                        <Image src={Check} mr={3} />
                      ) : null}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </TableContainer>
    </>
  );
}

export default AvailabilityTable;
