import React from 'react';

import { useState } from 'react';
import { Box, Flex, Button, Text, Select, FormControl } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import TimePicker from './TimePicker';

function Availability() {
  const [selectedTimes, setSelectedTimes] = useState({});
  const [newTimeInput, setNewTimeInput] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const days = [
    {
      name: 'Monday',
      hours: '4 Hours',
      times: ['10:00 AM - 11:00 AM', '03:00 PM - 06:00 PM']
    }
    // ... Other days with similar structures
  ];

  const handleTimeInput = () => {
    if (!selectedDay || !newTimeInput) return;

    const dayTimes = selectedTimes[selectedDay] || [];
    const newTimes = [...dayTimes, newTimeInput];

    setSelectedTimes({
      ...selectedTimes,
      [selectedDay]: newTimes
    });

    setNewTimeInput('');
  };

  return (
    <Box className="min-h-screen bg-gray-100 p-8">
      <Box className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* ... (rest of the component remains the same) */}
        <Flex direction="column" gap={4}>
          {days.map((day, index) => (
            <Flex
              key={index}
              justify="space-between"
              alignItems="center"
              bg="teal.100"
              p={4}
              rounded="md"
            >
              <Flex alignItems="center">
                <Box
                  bg="teal.500"
                  color="white"
                  fontWeight="bold"
                  py={2}
                  px={4}
                  roundedLeft="md"
                >
                  {day.name}
                </Box>
                <Box px={4}>
                  <Text fontWeight="semibold">{day.hours}</Text>
                </Box>
              </Flex>
              <Flex alignItems="center">
                {day.times.map((time, i) => (
                  <Flex key={i} alignItems="center">
                    <Box
                      bg="white"
                      border={`1px solid teal`}
                      color="teal.500"
                      py={1}
                      px={3}
                      mx={1}
                      rounded="md"
                      textTransform="uppercase"
                    >
                      {time}
                    </Box>
                  </Flex>
                ))}
                <Flex alignItems="center">
                  {selectedDay === day.name ? (
                    <Flex>
                      {/* <Input
                        value={newTimeInput}
                        onChange={(e) => setNewTimeInput(e.target.value)}
                        placeholder="Add Time (e.g. 09:00 AM - 10:00 AM)"
                        mr={2}
                      /> */}
                      <FormControl>
                        <Box>
                          <Box fontSize={14} my={2} color="#5C5F64">
                            Start Time
                          </Box>
                          <TimePicker
                            inputGroupProps={{
                              size: 'lg'
                            }}
                            inputProps={{
                              size: 'md',
                              placeholder: '01:00 PM'
                            }}
                            value={newTimeInput}
                            onChange={(v: string) => {
                              setNewTimeInput(v);
                            }}
                          />
                        </Box>
                      </FormControl>
                      <Button
                        color="teal.500"
                        _hover={{ color: 'teal.700' }}
                        fontWeight="semibold"
                        py={2}
                        px={4}
                        rounded="md"
                        display="inline-flex"
                        alignItems="center"
                        onClick={handleTimeInput}
                      >
                        Add
                      </Button>
                    </Flex>
                  ) : (
                    <Button
                      color="teal.500"
                      _hover={{ color: 'teal.700' }}
                      fontWeight="semibold"
                      py={2}
                      px={4}
                      rounded="md"
                      display="inline-flex"
                      alignItems="center"
                      onClick={() => setSelectedDay(day.name)}
                    >
                      Add New Time
                      <FaPlus className="ml-1" />
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

export default Availability;
