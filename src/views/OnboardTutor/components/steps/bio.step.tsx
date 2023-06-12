import React, { useState } from "react";
import onboardTutorStore from "../../../../state/onboardTutorStore";
import { Box, Textarea, Text } from "@chakra-ui/react";

const BioForm = () => {
  const maxCharacters = 3000;
  const maxWords = 250;
  const [bio, setBio] = useState("");

  const { bio: value } = onboardTutorStore.useStore();

  const handleChange = (e: any) => {
    onboardTutorStore.set.bio(e.target.value);
  };

  const characterCount = value.length;
  const wordCount = bio.trim().split(/\s+/).length;

  return (
    <Box>
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder="Enter your bio"
        minHeight="250px"
        fontSize="12px"
        lineHeight="17px"
        fontStyle="normal"
        fontWeight={500}
        color="#969CA6"
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
