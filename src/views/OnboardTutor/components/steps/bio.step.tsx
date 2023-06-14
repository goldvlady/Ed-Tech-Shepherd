import React, { useState } from "react";
import onboardTutorStore from "../../../../state/onboardTutorStore";
import { Box, Textarea, Text } from "@chakra-ui/react";

const BioForm = () => {
  const maxCharacters = 3000;
  const [bio, setBio] = useState("");

  const { description: value } = onboardTutorStore.useStore();

  const handleChange = (e: any) => {
    onboardTutorStore.set.description?.(e.target.value);
  };

  const characterCount = value?.length || 0
  const wordCount = bio.trim().split(/\s+/).length;

  return (
    <Box>
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder="Enter your bio"
        minHeight="250px"
        fontSize="12px"
        lineHeight="22px"
        fontStyle="normal"
        fontWeight={400}
        color="#212224"
      />
      <Box marginTop="1rem">
        <Text
          fontStyle="normal"
          fontWeight={500}
          fontSize="12px"
          lineHeight="17px"
          color="#969CA6"
        >
          {maxCharacters - characterCount} characters left
        </Text>
      </Box>
    </Box>
  );
};

export default BioForm;
