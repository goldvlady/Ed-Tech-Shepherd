import React, { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import DragAndDrop from "../../../../components/DragandDrop";

const IntroVideoForm = () => {
  const [introVideo, setIntroVideo] = useState<File | null>(null);

  const handleIntroVideoUpload = (file: File) => {
    setIntroVideo(file);
  };

  const handleFormSubmit = () => {
    // Perform form submission logic here, e.g., send introVideo to the server
    // Reset form state after submission
    setIntroVideo(null);
  };

  return (
    <Box width="100%">
      <Box marginTop="10px">
        <DragAndDrop
          supportingText="Click to upload a video"
          accept="video/*"
          onFileUpload={handleIntroVideoUpload}
          boxStyles={{ width: "250px", marginTop: "10px", height: "50px" }}
        />
        {introVideo && (
          <Text marginTop="1rem">Selected file: {introVideo.name}</Text>
        )}
      </Box>
    </Box>
  );
};

export default IntroVideoForm;
