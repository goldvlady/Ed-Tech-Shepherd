import React, { useState, useRef, ChangeEvent } from "react";
import { Box, IconButton, HStack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import placeholderImage from "./placeholder.png";

const ProfilePictureForm: React.FC = () => {
  const [avatar, setAvatar] = useState<string>("https://www.pathwaysvermont.org/wp-content/uploads/2017/03/avatar-placeholder-e1490629554738.png");

  const handleAddImage = () => {
    // Trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // Convert the selected image to base64
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setAvatar(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <HStack marginTop="50px" justifyContent={"center"}>
      <Box
        width="120px"
        height="120px"
        borderRadius="full"
        background="#F1F2F3"
        position="relative"
      >
        <img
          src={avatar}
          alt="Avatar"
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <IconButton
          icon={<AddIcon />}
          aria-label="Add Image"
          colorScheme="blue"
          borderRadius="full"
          background="#207DF7"
          boxShadow="0px 4px 10px rgba(129, 139, 152, 0.25)"
          position="absolute"
          bottom="2px"
          right="5px"
          onClick={handleAddImage}
        />
      </Box>
    </HStack>
  );
};

export default ProfilePictureForm;