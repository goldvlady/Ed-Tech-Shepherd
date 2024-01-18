import {
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Flex,
  Checkbox
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

interface LibraryCardProps {
  question: string;
  answer: string;
  difficulty: string;
  explanation?: string;
  options?: any[];
  isSelected?: boolean; // New property to track if the card is selected
  onSelect?: (isSelected: boolean) => void; // New callback for checkbox changes
}

const MotionBox = motion(Box);

const LibraryCard: React.FC<LibraryCardProps> = ({
  question,
  answer,
  explanation,
  difficulty,
  options,
  isSelected,
  onSelect
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showMoreAnswer, setShowMoreAnswer] = useState(false);
  const [isAnswerTooLong, setIsAnswerTooLong] = useState(false);

  const maxHeight = 320; // you can adjust this value

  const checkIfAnswerIsTooLong = (ref) => {
    if (ref && ref.scrollHeight > maxHeight) {
      setIsAnswerTooLong(true);
    }
  };

  return (
    <Box
      bg="#FFFFFF"
      height="fit-content"
      width="100%"
      borderRadius="8px"
      borderWidth="1px"
      transition="box-shadow 0.3s"
      _hover={{
        boxShadow: '0 0 15px rgba(33,33,33,.2)'
      }}
      borderColor="#EEEFF2"
    >
      <Box
        minHeight={`${maxHeight}px`}
        maxHeight={
          showMoreAnswer || showExplanation ? 'none' : `${maxHeight}px`
        }
        width="100%"
      >
        <Flex
          borderBottomEndRadius={'8px'}
          borderBottomLeftRadius={'8px'}
          bg="#F5F9FF"
          w="full"
          p="10px 18px"
          justifyContent="space-between"
          alignItems="center"
        >
          <Checkbox
            isChecked={isSelected}
            onChange={(e) => onSelect?.(e.target.checked)}
          />
          <Text>
            <Text>{difficulty}</Text>
          </Text>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="More options"
              icon={<FaEllipsisV fontSize={'12px'} />}
              size="sm"
              variant="ghost"
            />
            <MenuList fontSize="14px" minWidth={'185px'} borderRadius="8px">
              {options.map((option, index) => (
                <MenuItem
                  key={index}
                  p="6px 8px 6px 8px"
                  color={option.color || '#212224'}
                  _hover={{ bgColor: '#F2F4F7' }}
                  onClick={() => option.onClick && option.onClick()}
                >
                  {option.icon && <Box mr={2}>{option.icon}</Box>}
                  <Text fontSize="14px" lineHeight="20px" fontWeight="400">
                    {option.label}
                  </Text>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>

        <Box
          width="100%"
          padding="25px"
          paddingBottom={'20px'}
          fontSize="14px"
          lineHeight="22px"
          color="#212224"
          minHeight={`${maxHeight - 20}px`}
          maxHeight={showMoreAnswer ? 'none' : `${maxHeight - 20}px`}
          height="100%"
          overflow="hidden"
          ref={checkIfAnswerIsTooLong}
        >
          <Text whiteSpace={'pre-line'}>{question}</Text>
        </Box>

        {isAnswerTooLong && (
          <Box
            width="100%"
            display={'flex'}
            justifyContent={'center'} // Right align the button
            alignItems={'center'}
          >
            <Button
              variant="link" // Use link variant for button without a background
              color="#207DF7"
              fontSize="12px"
              _hover={{ textDecoration: 'none', color: '#207DF7' }}
              _active={{ textDecoration: 'none', color: '#207DF7' }}
              _focus={{ boxShadow: 'none' }}
              onClick={() => setShowMoreAnswer((prev) => !prev)}
            >
              {!showMoreAnswer ? 'Show More' : 'Hide'}
            </Button>
          </Box>
        )}
        <AnimatePresence mode="wait">
          {showExplanation && (
            <MotionBox
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: '300px' }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.3 }}
              fontSize="12px"
              lineHeight="20px"
              color="#585F68"
              p="25px"
              borderRadius="8px"
              borderTop="1px solid #EEEFF2"
              layout
            >
              <Text>{answer}</Text>
              <br />
              <Text>{explanation}</Text>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
      <Box
        bg="#F5F9FF"
        width="100%"
        display={'flex'}
        py="8px"
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Button
          variant="unstyled"
          color="#207DF7"
          fontSize="12px"
          onClick={() => setShowExplanation(!showExplanation)}
          _hover={{ bg: 'none', color: '#207DF7' }}
          _active={{ bg: 'none', color: '#207DF7' }}
          _focus={{ boxShadow: 'none' }}
        >
          {showExplanation ? 'Hide Answer' : 'See Answer'}
        </Button>
      </Box>
    </Box>
  );
};

export default LibraryCard;
