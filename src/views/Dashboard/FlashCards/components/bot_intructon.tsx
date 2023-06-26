import { Box, Flex, Icon, Image, HStack, Text, VStack } from "@chakra-ui/react";
import robot from "../../../../assets/robot.png";
import { AiFillCiCircle } from "react-icons/ai";

const BotIntructionBox = () => {
  return (
    <Box bg="#F7F7F7" borderRadius="10px" p="20px" w="100%">
      <Flex direction="column" align="flex-start">
        <HStack>
          <Image width={"60px"} height={"60px"} src={robot}></Image>
          <VStack ml={"20px"} spacing={2} align="flex-start">
            <Text
              fontWeight="500"
              fontSize="16px"
              lineHeight="21px"
              color="#212224"
            >
              Your text here
            </Text>
            <Text
              fontWeight="400"
              fontSize="14px"
              lineHeight="16.94px"
              color="#585F68"
            >
              Your text here
            </Text>
          </VStack>
        </HStack>
        <Text
          marginTop="10px"
          fontWeight="400"
          fontSize="13px"
          lineHeight="20px"
          color="#383D42"
        >
          Nibh augue arcu congue gravida risus diam. Turpis nulla ac urna
          elementum est enim mi bibendum varius. Nunc urna maecenas sodales
          volutpat ullamcorper, ilmora tun dun kabash yato.
        </Text>
      </Flex>
    </Box>
  );
};

export default BotIntructionBox;
