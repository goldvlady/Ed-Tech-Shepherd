import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";

const AvailabilityForm = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");

  const daysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const handleSelectClick = () => {
    setShowCheckboxes(true);
  };

  const handleDayChange = (e: any) => {
    const { value, checked } = e.target;
    setSelectedDays((prevSelectedDays: any) => {
      if (checked) {
        return [...prevSelectedDays, value];
      } else {
        return prevSelectedDays.filter((day: any) => day !== value);
      }
    });
  };

  const handleTimeChange = (e: any) => {
    setSelectedTime(e.target.value);
  };

  return (
    <Box>
      <FormControl>
        <FormLabel lineHeight="20px">
          What days will you be available{" "}
        </FormLabel>
        <Select
          onClick={handleSelectClick}
          bg="#FFFFFF"
          border="1px solid #E4E5E7"
          boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
          borderRadius="6px"
          placeholder="Select days"
          value={selectedDays}
          onChange={() => {}}
        >
          {showCheckboxes &&
            daysOfWeek.map((day) => (
              <Checkbox
                key={day.value}
                value={day.value}
                isChecked={selectedDays.includes(day.value)}
                onChange={handleDayChange}
              >
                {day.label}
              </Checkbox>
            ))}
        </Select>
      </FormControl>

      <FormControl marginTop={4}>
        <FormLabel
         
          lineHeight="20px"
          letterSpacing="-0.001em"
          color="#5C5F64"
        >
          What time of the day will you be available{" "}
        </FormLabel>
        <Select
          value={selectedTime}
          onChange={handleTimeChange}
          bg="#FFFFFF"
          border="1px solid #E4E5E7"
          boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
          borderRadius="6px"
          placeholder="Select time"
          _placeholder={{
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "20px",
            letterSpacing: "-0.003em",
            color: "#9A9DA2",
          }}
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </Select>
      </FormControl>
    </Box>
  );
};

export default AvailabilityForm;
