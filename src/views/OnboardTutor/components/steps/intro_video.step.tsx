import React, { useState, useEffect } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { storage } from "../../../../firebase";
import onboardTutorStore from "../../../../state/onboardTutorStore";
import DragAndDrop from "../../../../components/DragandDrop";

import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { ref } from "@firebase/storage";


const IntroVideoForm = () => {
  const toast = useToast();

  const [introVideo, setIntroVideo] = useState<File | null>(null);

  const handleIntroVideoUpload = (file: File) => {
    setIntroVideo(file);
  };

  const handleFormSubmit = () => {
    // Perform form submission logic here, e.g., send introVideo to the server
    // Reset form state after submission
    setIntroVideo(null);
  };

  useEffect(() => {
    onboardTutorStore.set.introVideo("");

    if (!introVideo) return;

    if (introVideo?.size > 2000000) {
      toast({
        title: "Please upload a file under 2MB",
        status: "error",
        position: "top",
        isClosable: true,
      });
      return;
    }

    const storageRef = ref(storage, `files/${introVideo.name}`);
    const uploadTask = uploadBytesResumable(storageRef, introVideo);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // setCvUploadPercent(progress);
      },
      (error) => {
        // setCvUploadPercent(0);
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onboardTutorStore.set.introVideo(downloadURL);
        });
      }
    );
  }, [introVideo]);


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
