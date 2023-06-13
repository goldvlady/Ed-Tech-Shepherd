import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  Icon,
  Text,
  Stack,
  VStack,
} from "@chakra-ui/react";
import {  } from "../../../../types";
import onboardTutorStore from "../../../../state/onboardTutorStore";
import { Flex, Button, Fade } from "@chakra-ui/react";
import CustomDropdown from "../../../../components/CustomDropdown";
import { HiChevronDown } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

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
  slot1: "8am - 12am",
  slot2: "12pm - 5pm",
  slot3: "5am - 9am",
};

function SelectTimeSlot({ onConfirm, day, value }: MyComponentProps) {
  const [selectedSlot, setSelectedSlot] = useState<string[]>([]);
  const [timezone, setTimezone] = useState("");

  console.log(selectedSlot);

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
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  console.log("selected ===>",selectedSlot , selectedSlot.includes("slot1"))
  return (
    <Box width="100%">
      {/* Upper Section */}
      <AnimatePresence>
        {day && (
          <motion.div
          key={day}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3 }}
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
                    <option value="subject1">Subject 1</option>
                    <option value="subject2">Subject 2</option>
                    <option value="subject3">Subject 3</option>
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
                      color="#9A9DA2"
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
                      8am - 12am
                    </Box>
                    {/* Badge 2 */}
                    <Box
                      bg={selectedSlot.includes("slot2") ? "#EBF4FE" : "white"}
                      color="#9A9DA2"
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
                      12pm - 5am
                    </Box>
                    {/* Badge 3 */}
                    <Box
                      bg={selectedSlot.includes("slot3") ? "#EBF4FE" : "white"}
                      color="#9A9DA2"
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
                      borderRadius="0px 6px 6px 0px"
                      p={2}
                      onClick={() => handleSlotClick("slot3")}
                      _hover={{ bg: "#EBF4FE" }}
                      cursor="pointer"
                    >
                      5pm - 9pm
                    </Box>
                  </Box>
                </FormControl>
              </VStack>
            </Flex>
          </motion.div>
        )}
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
  // const { availability } = onboardTutorStore.useStore();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [availability, setTutorAvailability] = useState<{ [key: string]: SlotData}>(
    {}
  );

  console.log("availability", availability)

  const availabilityDays = Object.keys(availability)

  const setAvailability = (
    f: (v: typeof availability) => typeof availability | typeof availability
  ) => {
    if (typeof f === "function") {
      setTutorAvailability(f(availability));
    } else {
      setTutorAvailability(f);
    }
  };
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

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

  const handleTimeChange = (e: any) => {
    setSelectedTime(e.target.value);
  };

  return (
    <Box>
      <Stack spacing={5}>
        <FormControl>
          <FormLabel lineHeight="20px">
            What days will you be available{" "}
          </FormLabel>
          <CustomDropdown value={availabilityDays.join(",")} placeholder="Select days">
            <VStack alignItems={"left"} padding="10px" width="100%">
              {daysOfWeek.map((day) => {
                console.log(
                  Object.keys(availability).includes(day.value),
                  Object.keys(availability),
                  day.value
                );
                return (
                  <Checkbox
                    isChecked={Object.keys(availability).includes(day.value)}
                    onChange={handleDayChange}
                    key={day.value}
                    value={day.value}
                  >
                    {day.value}
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
            disabled={Object.keys(availability).length < 1}
            useDefaultWidth
            placeholder="Select time"
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