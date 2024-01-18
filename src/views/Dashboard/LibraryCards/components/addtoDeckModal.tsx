import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  Flex
} from '@chakra-ui/react';

const AddToDeckModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    deckName: '',
    studyType: '',
    level: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const StudyFooter = ({ onClose }) => {
    return (
      <Box display="flex" justifyContent="flex-end" p={4}>
        <Button
          variant="ghost"
          rounded="100%"
          padding="10px"
          bg="#FEECEC"
          onClick={onClose}
          _hover={{ bg: '#FEECEC', transform: 'scale(1.05)' }}
          color="black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            width={'15px'}
            height={'15px'}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </Box>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent
          borderRadius="12px"
          w="full"
          maxW={{ base: '95%', sm: '80%', md: '700px' }}
          mx="auto"
          position="relative"
        >
          <ModalHeader>Create New Deck</ModalHeader>
          <ModalBody>
            <Flex direction="column" width={'full'}>
              <FormControl mb={4}>
                <FormLabel>Deck Name</FormLabel>
                <Input
                  name="deckName"
                  value={formData.deckName}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Study Type</FormLabel>
                <Select
                  name="studyType"
                  value={formData.studyType}
                  onChange={handleChange}
                >
                  <option value="">Select Study Type</option>
                  <option value="longTermRetention">Long Term Retention</option>
                  <option value="quickPractice">Quick Practice</option>
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Level</FormLabel>
                <Select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex justify={'space-between'} width={'full'}>
              <Button onClick={handleSubmit}>Create Deck</Button>
              <StudyFooter onClose={onClose} />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default AddToDeckModal;
