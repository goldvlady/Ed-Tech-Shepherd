import React, { useState, useEffect } from 'react';
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
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';

const AddToDeckModal = ({ isOpen, onClose, onSubmit }) => {
  const [userDecks, fetchUserDecks] = useState([]);
  const [formData, setFormData] = useState({
    deckname: '',
    studyType: '',
    level: '',
    selectedDeckId: ''
  });

  useEffect(() => {
    fetchUserDecks([]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (isNewDeck) => {
    onSubmit({ ...formData, isNewDeck });
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
          <ModalHeader>
            {formData.selectedDeckId ? 'Update Deck' : 'Create New Deck'}
          </ModalHeader>
          <ModalBody>
            <Tabs variant="enclosed" width={'full'}>
              <TabList>
                <Tab>Create New</Tab>
                <Tab>Update Existing</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Flex direction="column" width={'full'}>
                    <FormControl mb={4}>
                      <FormLabel>Deck Name</FormLabel>
                      <Input
                        name="deckname"
                        value={formData.deckname}
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
                        <option value="longTermRetention">
                          Long Term Retention
                        </option>
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
                    <Button onClick={() => handleSubmit(true)}>
                      Create Deck
                    </Button>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex direction="column" width={'full'}>
                    <FormControl mb={4}>
                      <FormLabel>Deck Name</FormLabel>
                      <Select
                        name="selectedDeckId"
                        value={formData.selectedDeckId}
                        onChange={handleChange}
                      >
                        <option value="">Select Deck</option>
                        {userDecks.map((deck) => (
                          <option key={deck.id} value={deck.id}>
                            {deck.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl mb={4}>
                      <FormLabel>Study Type</FormLabel>
                      <Select
                        name="studyType"
                        value={formData.studyType}
                        onChange={handleChange}
                      >
                        <option value="">Select Study Type</option>
                        <option value="longTermRetention">
                          Long Term Retention
                        </option>
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
                    <Button onClick={() => handleSubmit(false)}>
                      Update Deck
                    </Button>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Flex justify={'right'} width={'full'}>
              <StudyFooter onClose={onClose} />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default AddToDeckModal;
