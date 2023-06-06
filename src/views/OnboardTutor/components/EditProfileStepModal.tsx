import React, {useState, useEffect} from "react";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  value?: any;
  onCancel: (previousValue: any) => void;
  onSave: () => void;
  mainText?: string;
  supportingText?: string;
  children?: React.ReactNode;
}

const HAS_SAVED_MEMO = false
const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onCancel,
  onSave,
  mainText,
  supportingText,
  children,
  value
}) => {
  const [memoValue, setMemoValue] = useState()
  console.log(mainText, supportingText)

  useEffect(() => {
    if(!memoValue){
        setMemoValue(value)
    }
  }, [value])
   
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <Modal isOpen={(isOpen && Boolean(children))} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalBody>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{width: "100%"}}
          >
            <Text
              fontFamily="Inter"
              fontStyle="normal"
              fontWeight={600}
              fontSize="24px"
              marginTop={"40px"}
              width="85%"
              lineHeight="34px"
              letterSpacing="-0.02em"
              color="#212224"
              flex="none"
              order={0}
              flexGrow={0}
            >
              {mainText}
            </Text>

            <Text
              fontStyle="normal"
              fontWeight={400}
              width="80%"
              fontSize="14px"
              lineHeight="21px"
              color="#585F68"
              flex="none"
              order={1}
              flexGrow={0}
              marginBottom="16px"
            >
              {supportingText}
            </Text>

            <Box marginTop={10}>{children}</Box>
          </motion.div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" colorScheme="white" onClick={() => onCancel(memoValue)}>
            Cancel
          </Button>
          <Button onClick={onSave} colorScheme="blue" ml={3}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
