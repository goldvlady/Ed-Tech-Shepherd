import React, { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  Stack,
} from "@chakra-ui/react";

const HourlyRateForm: React.FC = () => {
  const [hourlyRate, setHourlyRate] = useState("");
//   const [tutorEarnings, setTutorEarnings] = useState("");

  const tutorEarnings = useMemo(() => {
      const baseEarning: number = 0
      if(!hourlyRate) return baseEarning.toFixed(2)
      // Calculate tutor's earnings after deduction
      const rateNumber = parseFloat(hourlyRate.replace("$", "").replace("/hr", ""));
      const earnings = rateNumber * 0.05; // Assuming a 20% deduction
      return earnings.toFixed(2)
  }, [hourlyRate])

  const handleHourlyRateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rate = event.target.value;
    setHourlyRate(rate);

    // // Calculate tutor's earnings after deduction
    // const rateNumber = parseFloat(rate.replace("$", "").replace("/hr", ""));
    // const earnings = rateNumber * 0.8; // Assuming a 20% deduction
    // setTutorEarnings(`$${earnings.toFixed(2)}/hr`);
  };

  return (
    <Box marginTop={30}>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel
            fontStyle="normal"
            fontWeight={500}
            fontSize={14}
            lineHeight="20px"
            letterSpacing="-0.001em"
            color="#5C5F64"
          >
            Hourly Rate
          </FormLabel>
          <InputGroup
            bg="#FFFFFF"
            _active={{
              border: "1px solid #207df7",
            }}
            border="1px solid #E4E5E7"
            boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
            borderRadius="6px"
          >
            <InputLeftElement
              pointerEvents="none"
              color="black"
              fontSize="14px"
              children="$"
            />
            <Input
              type="number"
              value={hourlyRate}
              marginLeft={"30px"}
              onChange={handleHourlyRateChange}
              placeholder="0.00"
              bg="transparent"
              border="none"
              boxShadow="none"
              borderRadius="none"
              _active={{
                border: "none",
              }}
              _placeholder={{
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "20px",
                letterSpacing: "-0.003em",
                color: "#9A9DA2",
              }}
            />{" "}
            <InputRightElement
              pointerEvents="none"
              color="gray.300"
              fontSize="1.2em"
            >
              <Box
                fontSize={"sm"}
                color={"black"}
                padding="2px 6px"
                background="#F1F2F3"
                borderRadius="5px"
              >
                /hr
              </Box>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <HStack display={"flex"} fontSize="sm" alignItems="baseline" fontWeight="500">
          <Text color={"#6E7682"}>
            Shepherd charges a
          </Text>
          <Text color="#207DF7">5% service fee (-$3.00/hr)</Text>
        </HStack>
        <FormControl>
          <FormLabel
            fontStyle="normal"
            fontWeight={500}
            fontSize={14}
            lineHeight="20px"
            letterSpacing="-0.001em"
            color="#5C5F64"
          >
           You'll get
          </FormLabel>
          <InputGroup
            bg="#F1F2F3"
            _active={{
              border: "1px solid #207df7",
            }}
            border="1px solid #E4E5E7"
            boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
            borderRadius="6px"
          >
            <InputLeftElement
              pointerEvents="none"
              color="black"
              fontSize="14px"
              children="$"
            />
            <Input
              type="text"
              value={tutorEarnings}
              isDisabled
              bg="#F5F6F7"
              marginLeft={"30px"}
              border="1px solid #E4E5E7"
              borderRadius="6px"
              _placeholder={{
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "20px",
                letterSpacing: "-0.003em",
                color: "#9A9DA2",
              }}
            />
            <InputRightElement
              pointerEvents="none"
              color="gray.300"
              fontSize="1.2em"
            >
              <Box
                fontSize={"sm"}
                color={"black"}
                padding="2px 6px"
                background="#F1F2F3"
                borderRadius="5px"
              >
                /hr
              </Box>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default HourlyRateForm;
