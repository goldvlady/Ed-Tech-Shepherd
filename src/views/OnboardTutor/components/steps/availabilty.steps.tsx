import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { Schedule, TimeSchedule } from '../../../../types';
import timezones from "./timezones";
import { Flex, Button, Fade } from "@chakra-ui/react";
import CustomDropdown from "../../../../components/CustomDropdown";
import { motion, AnimatePresence } from "framer-motion";
import onboardTutorStore from "../../../../state/onboardTutorStore";

export type Availability = { [key: string]: SlotData };
export interface SlotData {
  timezone: string;
  slots: string[];
}

interface MyComponentProps {
  onConfirm: (d: string[], timezone: string) => void;
  day: string;
  value?: SlotData;
}

const slotTimes: { [key: string]: any } = {
  slot1: "8AM → 12PM",
  slot2: "12PM → 5PM",
  slot3: "5PM → 9PM",
  slot4: "9PM → 12AM",
};

function SelectTimeSlot({ onConfirm, day, value }: MyComponentProps) {
  console.log(day, value)
  const [selectedSlot, setSelectedSlot] = useState<string[]>([]);
  const [timezone, setTimezone] = useState("");



  const handleSlotClick = (slot: string) => {
    setSelectedSlot((prev) => {
      if (prev.includes(slot)) {
        const index = prev.findIndex((pre) => pre === slot);
        prev.splice(index, 1);
      } else {
        prev.push(slot);
      }
      return [...prev];
    });
  };

  const handleConfirm = () => {
    const timeSlot = selectedSlot.map((slot) => slotTimes[slot]);
    console.log(timeSlot)
    return onConfirm(timeSlot, timezone);
  };

  function getKeyByValue(object: { [key: string]: any }, value: string) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  useEffect(() => {
    console.log(
      value?.slots
        .filter((slot) => {
          return getKeyByValue(slotTimes, slot);
        })
        .map((slot) => getKeyByValue(slotTimes, slot))
    );

    setSelectedSlot(
      value?.slots
        ? value.slots
            ?.filter((slot) => {
              return getKeyByValue(slotTimes, slot);
            })
            ?.map((slot) => getKeyByValue(slotTimes, slot) as string)
        : []
    ); // Reset selected slots

    setTimezone(value?.timezone ? value.timezone : ""); // Reset timezone
  }, [day]);

  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  
  const transition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  };
  
  



  return (
    <Box width="100%">
      {/* Upper Section */}
      <AnimatePresence>
      (
          <motion.div
          key={day}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={transition}
          >
            <Flex direction="column" bg="white" borderRadius="6px" p={4} mb={4}>
              <VStack spacing={4} alignItems="center">
                <FormControl>
                  <FormLabel
                    fontStyle="normal"
                    fontWeight={500}
                    fontSize={14}
                    lineHeight="20px"
                    letterSpacing="-0.001em"
                    color="#5C5F64"
                  >
                    Time Zone
                  </FormLabel>
                  <Select
                    bg="#FFFFFF"
                    border="1px solid #E4E5E7"
                    boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                    borderRadius="6px"
                    placeholder="Select a time zone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    _placeholder={{
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: "20px",
                      letterSpacing: "-0.003em",
                      color: "#9A9DA2",
                    }}
                  >
                    {timezones.map((timezone) => (
                                          <option value={timezone.text}>{timezone.text}</option>
                    ))}                   
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel
                    fontStyle="normal"
                    fontWeight={500}
                    fontSize={14}
                    lineHeight="20px"
                    letterSpacing="-0.001em"
                    color="#5C5F64"
                  >
                    What time on {day} will you be available
                  </FormLabel>
                  <Box display="flex">
                    {/* Badge 1 */}
                    <Box
                      bg={selectedSlot.includes("slot1") ? "#EBF4FE" : "white"}
                      color={!selectedSlot.includes("slot1") ? "#9A9DA2": "#212224"}
                      fontWeight={400}
                      fontSize="14px"
                      lineHeight="20px"
                      letterSpacing="-0.003em"
                      flex="1"
                      display={"flex"}
                      justifyContent={"center"}
                      justifyItems={"center"}
                      border={`1.4px solid ${
                        selectedSlot.includes("slot1") ? "#207DF7" : "#E4E5E7"
                      }`}
                      boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                      borderRadius="6px 0px 0px 6px"
                      p={2}
                      onClick={() => handleSlotClick("slot1")}
                      _hover={{ bg: "#EBF4FE" }}
                      cursor="pointer"
                    >
                      8AM → 12PM
                    </Box>
                    {/* Badge 2 */}
                    <Box
                      bg={selectedSlot.includes("slot2") ? "#EBF4FE" : "white"}

                      color={!selectedSlot.includes("slot2") ? "#9A9DA2": "#212224"}
                      fontWeight={400}
                      fontSize="14px"
                      lineHeight="20px"
                      display={"flex"}
                      justifyContent={"center"}
                      justifyItems={"center"}
                      letterSpacing="-0.003em"
                      flex="1"
                      border={`1.4px solid ${
                        selectedSlot.includes("slot2") ? "#207DF7" : "#E4E5E7"
                      }`}
                      boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                      p={2}
                      onClick={() => handleSlotClick("slot2")}
                      _hover={{ bg: "#EBF4FE" }}
                      cursor="pointer"
                    >
                      12PM → 5PM
                    </Box>
                    {/* Badge 3 */}
                    <Box
                      bg={selectedSlot.includes("slot3") ? "#EBF4FE" : "white"}
                      color={!selectedSlot.includes("slot3") ? "#9A9DA2": "#212224"}
                      fontWeight={400}
                      fontSize="14px"
                      lineHeight="20px"
                      display={"flex"}
                      justifyContent={"center"}
                      justifyItems={"center"}
                      letterSpacing="-0.003em"
                      flex="1"
                      border={`1.4px solid ${
                        selectedSlot.includes("slot3") ? "#207DF7" : "#E4E5E7"
                      }`}
                      boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                      p={2}
                      onClick={() => handleSlotClick("slot3")}
                      _hover={{ bg: "#EBF4FE" }}
                      cursor="pointer"
                    >
                      5PM → 9PM
                    </Box>
                    <Box
                      bg={selectedSlot.includes("slot4") ? "#EBF4FE" : "white"}
                      color={!selectedSlot.includes("slot4") ? "#9A9DA2": "#212224"}
                      fontWeight={400}
                      fontSize="14px"
                      lineHeight="20px"
                      display={"flex"}
                      justifyContent={"center"}
                      justifyItems={"center"}
                      letterSpacing="-0.003em"
                      flex="1"
                      border={`1.4px solid ${
                        selectedSlot.includes("slot4") ? "#207DF7" : "#E4E5E7"
                      }`}
                      boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                      borderRadius="0px 6px 6px 0px"
                      p={2}
                      onClick={() => handleSlotClick("slot4")}
                      _hover={{ bg: "#EBF4FE" }}
                      cursor="pointer"
                    >
                      9PM → 12AM
                    </Box>
                  </Box>
                </FormControl>
              </VStack>
            </Flex>
          </motion.div>
        )
      </AnimatePresence>

      {/* Footer */}
      <Fade in={true} unmountOnExit>
        <Flex
          bg="#F7F7F8"
          borderRadius="0px 0px 10px 10px"
          p={4}
          justifyContent="flex-end"
        >
          <Button
            isDisabled={[selectedSlot.length, timezone].some((v) => !v)}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Flex>
      </Fade>
    </Box>
  );
}

const AvailabilityForm = () => {
  const { schedule } = onboardTutorStore.useStore();
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [availability, setTutorAvailability] = useState<{ [key: string]: SlotData}>(
    {}
  );

  const availabilityDays = Object.keys(availability);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [previousDayIndex, setPreviousDayIndex] = useState(0)

  const totalDayIndex = useMemo(() => availabilityDays.length - 1, [availabilityDays.length]);
  const isLastDayToFirstDay = useMemo(() => previousDayIndex === totalDayIndex, [previousDayIndex, totalDayIndex]);

  console.log("is last to first day", isLastDayToFirstDay)
  
  function formatAvailabilityData(availability: Availability): Schedule {
    const scheduleObj: Schedule = {};
  
    const dayMap: { [key: string]: number } = {
      sunday: 1,
      monday: 2,
      tuesday: 3,
      wednesday: 4,
      thursday: 5,
      friday: 6,
      saturday: 7,
    };
  
    Object.keys(availability).forEach((day) => {
      const dayNumber: number = dayMap[day.toLowerCase()];
  
      if (dayNumber) {
        const slotData: SlotData = availability[day];
        const timeSlots: string[] = slotData.slots;
  
        const formattedSlots: TimeSchedule[] = timeSlots.map((slot) => {
          const begin: string = slot.split(' - ')[0];
          const end: string = slot.split(' - ')[1];
          return { begin, end };
        });
  
        scheduleObj[dayNumber] = formattedSlots;
      }
    });
  
    return scheduleObj;
  }

  function formatScheduleToAvailability(schedule: Schedule): Availability {
    const availability: Availability = {};
  
    const dayMap: { [key: number]: string } = {
      1: 'sunday',
      2: 'monday',
      3: 'tuesday',
      4: 'wednesday',
      5: 'thursday',
      6: 'friday',
      7: 'saturday',
    };
  
    Object.keys(schedule).forEach((dayNumber: string) => {
      const day: string = dayMap[parseInt(dayNumber)];
      const timeSlots: TimeSchedule[] = schedule[parseInt(dayNumber)];
  
      const formattedSlots: string[] = timeSlots.map((timeSlot) => {
        return `${timeSlot.begin} - ${timeSlot.end}`;
      });
  
      availability[day] = { timezone: '', slots: formattedSlots };
    });
  
    return availability;
  }

  useEffect(() => {
    if(Object.keys(schedule).length){
     const availability = formatScheduleToAvailability(schedule)
     setTutorAvailability(availability)
    }
  }, [])

  useEffect(() => {
    if(Object.keys(availability).length){
     const schedule = formatAvailabilityData(availability)
     onboardTutorStore.set?.schedule(schedule)
    }
  }, [availability])


 


  const setAvailability = (
    f: (v: typeof availability) => typeof availability | typeof availability
  ) => {
    if (typeof f === "function") {
      setTutorAvailability(f(availability));
    } else {
      setTutorAvailability(f);
    }
  };

  const currentDay = useMemo(() => {
    return Object.keys(availability)[currentDayIndex];
  }, [currentDayIndex, availability]);

  const daysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  console.log(availability);

  const handleSelectClick = () => {
    setShowCheckboxes(true);
  };

  const handleDayChange = (e: any) => {
    const { value, checked } = e.target;
    setAvailability((prevAvailability) => {
      if (checked) {
        if (!prevAvailability[value]) {
          prevAvailability[value] = {slots: [], timezone: ""} as SlotData;
        }
      } else {
        if (prevAvailability[value]) {
          delete prevAvailability[value];
        }
      }
      return { ...prevAvailability };
    });
  };

  return (
    <Box>
      <Stack spacing={5}>
        <FormControl>
          <FormLabel lineHeight="20px">
            What days will you be available{" "}
          </FormLabel>
          <CustomDropdown value={availabilityDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(",")} placeholder="Select days">
            <VStack alignItems={"left"} padding="10px" width="100%">
              {daysOfWeek.map((day) => {
                return (
                  <Checkbox
                    isChecked={Object.keys(availability).includes(day.value)}
                    onChange={handleDayChange}
                    key={day.value}
                    value={day.value}
                  >
                    {day.label}
                  </Checkbox>
                );
              })}
            </VStack>
          </CustomDropdown>
        </FormControl>

        <FormControl marginTop={4}>
          <FormLabel lineHeight="20px" letterSpacing="-0.001em" color="#5C5F64">
            What time of the day will you be available{" "}
          </FormLabel>
          <CustomDropdown
            automaticClose={isLastDayToFirstDay}
            disabled={Object.keys(availability).length < 1}
            useDefaultWidth
            placeholder="Select timezone"
          >
            <SelectTimeSlot
              day={currentDay}
              value={availability[currentDay]}
              onConfirm={(slots, timezone) => {
                setAvailability((prev) => {
                  if (prev[currentDay]) {
                    prev[currentDay] = { timezone, slots };
                  }
                  return { ...prev };
                });
                setPreviousDayIndex(currentDayIndex)
                setCurrentDayIndex(
                  currentDayIndex + 1 === Object.keys(availability).length
                    ? 0
                    : currentDayIndex + 1
                );
              }}
            />
          </CustomDropdown>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default AvailabilityForm;