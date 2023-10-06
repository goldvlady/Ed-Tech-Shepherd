import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Icon,
  Box
} from '@chakra-ui/react';

interface ActionDropdownProps {
  onOptionClick?: (option: 'create-note' | 'upload-document') => void;
  activeTab: 'notes' | 'files';
}

function ActionDropdown({ onOptionClick, activeTab }: ActionDropdownProps) {
  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="solid"
        marginLeft={'20px'}
        width="fit-content"
        borderRadius={'10px'}
        colorScheme={'primary'}
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          <Icon viewBox="0 0 24 24" boxSize={6}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              stroke="currentColor"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </Icon>
          <Text marginLeft={'10px'}>Create new note</Text>
        </Box>
      </MenuButton>
      <MenuList>
        {activeTab === 'notes' && (
          <MenuItem
            p="6px 8px 6px 8px"
            color={'#212224'}
            _hover={{ bgColor: '#F2F4F7' }}
            onClick={() => {
              onOptionClick && onOptionClick('create-note');
            }}
            icon={
              <Icon viewBox="0 0 24 24" boxSize={4}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </Icon>
            }
          >
            <Text fontSize="14px" lineHeight="20px" fontWeight="400">
              Create a Note
            </Text>
          </MenuItem>
        )}

        {activeTab === 'files' && (
          <MenuItem
            p="6px 8px 6px 8px"
            color={'#212224'}
            _hover={{ bgColor: '#F2F4F7' }}
            onClick={() => {
              onOptionClick && onOptionClick('upload-document');
            }}
            icon={
              <Icon viewBox="0 0 24 24" boxSize={4}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </Icon>
            }
          >
            <Text fontSize="14px" lineHeight="20px" fontWeight="400">
              Upload a Document
            </Text>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

export default ActionDropdown;
