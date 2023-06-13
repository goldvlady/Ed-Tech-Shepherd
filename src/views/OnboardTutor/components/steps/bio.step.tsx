import React, { useState } from "react";
import { Box, Textarea, Text } from "@chakra-ui/react";

const BioForm = () => {
  const maxCharacters = 3000;
  const maxWords = 250;
  const [bio, setBio] = useState("");

  const handleChange = (e: any) => {
    setBio(e.target.value);
  };

  const characterCount = bio.length;
  const wordCount = bio.trim().split(/\s+/).length;

  return (
    <Box>
      <Textarea
        value={bio}
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
