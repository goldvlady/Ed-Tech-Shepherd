import React, { useState, useEffect } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { storage } from "../../../../firebase";
import onboardTutorStore from "../../../../state/onboardTutorStore";
import DragAndDrop from "../../../../components/DragandDrop";

import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { ref } from "@firebase/storage";


const IntroVideoForm = () => {
  const toast = useToast();
  const {introVideo: uploadedLink} = onboardTutorStore.useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [introVideo, setIntroVideo] = useState<File | null>(null);

  console.log("file ====>", uploadedLink)

  const handleIntroVideoUpload = (file: File) => {
    setIntroVideo(file);
  };

  const handleFormSubmit = () => {
    // Perform form submission logic here, e.g., send introVideo to the server
    // Reset form state after submission
    setIntroVideo(null);
  };

  useEffect(() => {
    if(uploadedLink && !introVideo){
      fetch(uploadedLink)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], 'intro_video', { type: blob.type }); // replace 'filename' with your desired filename
        setIntroVideo(file)
      })
      .catch(err => console.error(err));
    }
  }, [uploadedLink]);

  useEffect(() => {

    if (!introVideo) return;
    onboardTutorStore.set?.introVideo?.("");
    if (introVideo?.size > 10000000) {
      setIsLoading(true)
      toast({
        title: "Please upload a file under 10MB",
        status: "error",
        position: "top",
        isClosable: true,
      });
      return;
    }else {
      const storageRef = ref(storage, `files/${introVideo.name}`);
      const uploadTask = uploadBytesResumable(storageRef, introVideo);
  
      setIsLoading(true)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
  
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // setCvUploadPercent(progress);
        },
        (error) => {
          setIsLoading(false)
          // setCvUploadPercent(0);
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIsLoading(false)
            onboardTutorStore.set?.introVideo?.(downloadURL);
          });
        }
      );
    }

  
  }, [introVideo]);


  return (
    <Box width="100%">
      <Box marginTop="10px">
        <DragAndDrop
          isLoading={isLoading}
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
