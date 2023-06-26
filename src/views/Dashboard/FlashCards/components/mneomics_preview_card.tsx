import { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

interface MnemonicCardProps {
  answer: string;
  explanation: string;
}

const MotionBox = motion(Box);

const MnemonicCard: React.FC<MnemonicCardProps> = ({ answer, explanation }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  return (
    <Box
      bg="#FFFFFF"
      borderRadius="8px"
      borderWidth="1px"
      borderColor="#EEEFF2"
    >
      <Box>
        <Box
          padding="25px"
          paddingBottom={"20px"}
          fontSize="14px"
          lineHeight="22px"
          color="#212224"
        >
          <Text>{answer}</Text>
        </Box>
        <AnimatePresence mode="wait">
          {showExplanation && (
            <MotionBox
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: "300px" }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.3 }}
              fontSize="12px"
              lineHeight="20px"
              color="#585F68"
              p="25px"
              borderRadius="8px"
              borderTop="1px solid #EEEFF2"
              layout
            >
              <Text>{explanation}</Text>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
      <Box
        bg="#F5F9FF"
        width="100%"
        display={"flex"}
        py="8px"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Button
          variant="unstyled"
          color="#207DF7"
          fontSize="12px"
          onClick={toggleExplanation}
          _hover={{ bg: "none", color: "#207DF7" }}
          _active={{ bg: "none", color: "#207DF7" }}
          _focus={{ boxShadow: "none" }}
        >
          {showExplanation ? "Hide Explanation" : "See Explanation"}
        </Button>
      </Box>
    </Box>
  );
};

export default MnemonicCard;
