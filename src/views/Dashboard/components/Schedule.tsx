import React, { useState } from "react";
import {
  Flex,
  Box,
  Button,
  Spacer,
  Text,
  HStack,
  Select,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  Divider,
} from "@chakra-ui/react";

import ScheduleIcon from "../../../assets/timer.svg";
import calendarDrop from "../../../assets/calendar-drop.svg";

function Schedule() {
  return (
    <>
      <Box>
        <Flex>
          <HStack>
            <img src={ScheduleIcon} alt="feed-icon" width={18} />

            <Text fontSize={16} fontWeight={500} mx={2}>
              Schedule
            </Text>
          </HStack>
          <Spacer />
          <img src={calendarDrop} alt="schedule-icon" width={45} />
        </Flex>
        <Divider />
      </Box>
      <Box>
        <Text>Upcoming Events</Text>
      </Box>
    </>
  );
}

export default Schedule;
