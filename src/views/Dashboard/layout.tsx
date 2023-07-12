import AskIcon from '../../assets/avatar-male.svg';
import FeedIcon from '../../assets/blue-energy.svg';
import DocIcon from '../../assets/doc-icon.svg';
import Doc from '../../assets/doc.svg';
import FlashcardIcon from '../../assets/flashcardIcon.svg';
import MessageIcon from '../../assets/message.svg';
import NewNote from '../../assets/newnote.svg';
import NoteIcon from '../../assets/notes.svg';
import ReceiptIcon from '../../assets/receiptIcon.svg';
import VideoIcon from '../../assets/video.svg';
import { HelpModal } from '../../components';
import Logo from '../../components/Logo';
import { firebaseAuth } from '../../firebase';
import userStore from '../../state/userStore';
import TutorMarketplace from './Tutor';
import AskShepherd from './components/AskShepherd';
import MenuLinedList from './components/MenuLinedList';
import DashboardIndex from './index';
import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Center,
  CloseButton,
  Divider,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Grid,
  HStack,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { getAuth, signOut } from 'firebase/auth';
import React, { ReactNode, useState } from 'react';
import { IconType } from 'react-icons';
import { BsChatLeftDots, BsPin, BsPlayCircle } from 'react-icons/bs';
import { CgNotes } from 'react-icons/cg';
import { FaBell } from 'react-icons/fa';
import {
  FiBarChart2,
  FiBriefcase,
  FiChevronDown,
  FiHome,
  FiMenu
} from 'react-icons/fi';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp
} from 'react-icons/md';
import { TbClipboardText } from 'react-icons/tb';
import { TbCards } from 'react-icons/tb';
import {
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
  Link
} from 'react-router-dom';

const getComparisonPath = (pathname?: string) => {
  if (!pathname) return '';
  const pathParts = pathname.split('/').filter((f) => f);
  if (pathParts.length === 1) {
    return pathParts[0];
  } else if (pathParts.length > 1) {
    return pathParts[1];
  }
  return '';
};

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}
interface SidebarProps extends BoxProps {
  onClose: () => void;
  toggleMenu: () => void;
  tutorMenu: boolean;
  setTutorMenu: (value: boolean) => void;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Messages', icon: BsChatLeftDots, path: '/dashboard/messaging' },
  { name: 'Library', icon: BsPlayCircle, path: '/library' }
];

const LinkBItems: Array<LinkItemProps> = [
  { name: 'Performance', icon: FiBarChart2, path: '/performance' },
  { name: 'Study Plans', icon: TbClipboardText, path: '/study-plans' },
  { name: 'Notes', icon: CgNotes, path: '/dashboard/notes' },
  { name: 'Flashcards', icon: TbCards, path: '/dashboard/flashcards' }
];

interface NavItemProps extends FlexProps {
  icon?: IconType;
  children: any;
  path: string;
}
const NavItem = ({ icon, path, children, ...rest }: NavItemProps) => {
  const { pathname } = useLocation();

  const isActive = path.includes(getComparisonPath(pathname));
  return (
    <Link
      to={path}
      style={{ textDecoration: 'none' }}
      // _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        px="4"
        py="2"
        mx="4"
        my="2"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: '#F0F6FE',
          color: '#207DF7'
        }}
        bg={isActive ? '#F0F6FE' : 'transparent'}
        color={isActive ? '#207DF7' : 'text.400'}
        fontSize={14}
        fontWeight={isActive ? '500' : '400'}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: '#207DF7'
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const auth = getAuth();
  const [toggleHelpModal, setToggleHelpModal] = useState(false);
  const activateHelpModal = () => {
    setToggleHelpModal(true);
  };
  const navigate = useNavigate();
  const { user }: any = userStore();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/login');
    });
  };
  return (
    <>
      <Flex
        // ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        width={{ sm: '100%', md: 'calc(100vw - 250px)' }}
        height="20"
        alignItems="center"
        zIndex={2}
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        // justifyContent={{ base: "space-between", md: "flex-end" }}
        position="fixed"
        top="0"
        {...rest}
      >
        <Box>
          <Flex
            bgColor={'transparent'}
            color="text.400"
            border="1px solid #EBECF0"
            borderRadius={'40px'}
            fontSize="14px"
            p="6px 16px"
            onClick={activateHelpModal}
            gap={2}
            _hover={{
              cursor: 'pointer',
              bgColor: '#EDF2F7',
              transform: 'translateY(-2px)'
            }}
          >
            <Image src={AskIcon} />
            <Text> Ask Shepherd?</Text>
          </Flex>
        </Box>
        <Spacer />
        <Flex justifyContent={'space-between'}>
          {' '}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />
          <Text
            display={{ base: 'flex', md: 'none' }}
            fontSize="2xl"
            fontFamily="monospace"
            fontWeight="bold"
          >
            <Logo />{' '}
          </Text>
          <HStack spacing={4}>
            <Menu>
              <MenuButton>
                <IconButton
                  size="md"
                  borderRadius={'100%'}
                  border="1px solid #ECEDEE"
                  variant="ghost"
                  aria-label="open menu"
                  color={'text.300'}
                  icon={<FaBell />}
                />{' '}
              </MenuButton>
              <MenuList p={3} width={'358px'} zIndex={2}>
                <Box>
                  <Flex alignItems="flex-start" px={3} direction={'row'} my={1}>
                    <Image
                      src={VideoIcon}
                      alt="doc"
                      maxHeight={45}
                      zIndex={1}
                    />
                    <Stack direction={'column'} px={4} spacing={1}>
                      <Text color="text.300" fontSize={12} mb={0}>
                        19 May, 2023
                      </Text>
                      <Text
                        fontWeight={400}
                        color="text.200"
                        fontSize="14px"
                        mb={0}
                      >
                        Your chemistry lesson session with Leslie Peters started
                      </Text>

                      <Spacer />
                    </Stack>
                  </Flex>
                  <Divider />
                  <Flex alignItems="flex-start" px={3} direction={'row'} my={1}>
                    <Image
                      src={MessageIcon}
                      alt="doc"
                      maxHeight={45}
                      zIndex={1}
                    />
                    <Stack direction={'column'} px={4} spacing={1}>
                      <Text color="text.300" fontSize={12} mb={0}>
                        2 hrs ago
                      </Text>
                      <Text
                        fontWeight={400}
                        color="text.200"
                        fontSize="14px"
                        mb={0}
                      >
                        Leslie Peters sent you a text while your were away
                      </Text>
                    </Stack>
                  </Flex>
                  <Divider />
                  <Flex alignItems="flex-start" px={3} direction={'row'} my={1}>
                    <Image
                      src={VideoIcon}
                      alt="doc"
                      maxHeight={45}
                      zIndex={1}
                    />
                    <Stack direction={'column'} px={4} spacing={1}>
                      <Text color="text.300" fontSize={12} mb={0}>
                        2 hrs ago
                      </Text>
                      <Text
                        fontWeight={400}
                        color="text.200"
                        fontSize="14px"
                        mb={0}
                      >
                        Your chemistry lesson session with Leslie Peters started
                      </Text>

                      <Spacer />
                    </Stack>
                  </Flex>
                  <Divider />
                  <Flex alignItems="flex-start" px={3} direction={'row'} my={1}>
                    <Image
                      src={MessageIcon}
                      alt="doc"
                      maxHeight={45}
                      zIndex={1}
                    />
                    <Stack direction={'column'} px={4} spacing={1}>
                      <Text color="text.300" fontSize={12} mb={0}>
                        2 hrs ago
                      </Text>
                      <Text
                        fontWeight={400}
                        color="text.200"
                        fontSize="14px"
                        mb={0}
                      >
                        Leslie Peters sent you a text while your were away
                      </Text>
                    </Stack>
                  </Flex>
                </Box>
              </MenuList>
            </Menu>
            <Center height="25px">
              <Divider orientation="vertical" />
            </Center>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: 'none' }}
                bg="#F4F5F5"
                borderRadius={'40px'}
                px={3}
                // minWidth={"80px"}
              >
                <HStack>
                  <Avatar
                    size="sm"
                    color="white"
                    name={`${user?.name?.first ?? ''} ${
                      user?.name?.last ?? ''
                    }`}
                    bg="#4CAF50;"
                  />

                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{ base: 'block', sm: 'none', md: 'block' }}
                  >
                    {`${user?.name?.first} ${user?.name?.last}`}
                  </Text>

                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue('white', 'gray.900')}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                minWidth={'200px'}
                fontSize={'14px'}
              >
                <Flex gap={2} p={2}>
                  <Avatar
                    size="md"
                    color="white"
                    name={`${user?.name?.first} ${user?.name?.last}`}
                    bg="#4CAF50;"
                  />
                  <Stack spacing={'2px'}>
                    <Text
                      fontSize="14px"
                      fontWeight={500}
                      color="text.300"
                      display={{ base: 'block', sm: 'none', md: 'block' }}
                    >
                      {`${user?.name?.first} ${user?.name?.last}`}
                    </Text>{' '}
                    <Box
                      bgColor="#EBF4FE"
                      color="#207DF7"
                      p="2px 8px"
                      maxWidth="fit-content"
                      borderRadius="4px"
                    >
                      <Text fontSize={10} fontWeight={500}>
                        Student
                      </Text>
                    </Box>
                  </Stack>
                </Flex>
                <Divider />
                <MenuItem p={2} m={1}>
                  <Link to="/dashboard/account-settings">
                    <Flex alignItems="center" gap={2}>
                      {/* <PiUserCircleLight size="24px" /> */}
                      <Center
                        borderRadius="50%"
                        border="1px solid #EAEAEB"
                        boxSize="26px"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 1.16602C5.47167 1.16602 4.22917 2.40852 4.22917 3.93685C4.22917 5.43602 5.40167 6.64935 6.93 6.70185C6.97667 6.69602 7.02333 6.69602 7.05833 6.70185C7.07 6.70185 7.07583 6.70185 7.0875 6.70185C7.09333 6.70185 7.09333 6.70185 7.09917 6.70185C8.5925 6.64935 9.765 5.43602 9.77083 3.93685C9.77083 2.40852 8.52833 1.16602 7 1.16602Z"
                            fill="#6E7682"
                          />
                          <path
                            d="M9.96333 8.2532C8.33583 7.1682 5.68167 7.1682 4.0425 8.2532C3.30167 8.74904 2.89333 9.41987 2.89333 10.1374C2.89333 10.8549 3.30167 11.5199 4.03667 12.0099C4.85333 12.5582 5.92667 12.8324 7 12.8324C8.07333 12.8324 9.14667 12.5582 9.96333 12.0099C10.6983 11.514 11.1067 10.849 11.1067 10.1257C11.1008 9.4082 10.6983 8.7432 9.96333 8.2532Z"
                            fill="#6E7682"
                          />
                        </svg>
                      </Center>

                      <Text color="text.300" fontSize={14}>
                        My account
                      </Text>
                    </Flex>
                  </Link>
                </MenuItem>
                <MenuItem p={2} m={1}>
                  <Flex alignItems="center" gap={2}>
                    <Center
                      borderRadius="50%"
                      border="1px solid #EAEAEB"
                      boxSize="26px"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.25 1.16602C3.72167 1.16602 2.47917 2.40852 2.47917 3.93685C2.47917 5.43602 3.65167 6.64935 5.18 6.70185C5.22667 6.69602 5.27333 6.69602 5.30833 6.70185C5.32 6.70185 5.32583 6.70185 5.3375 6.70185C5.34333 6.70185 5.34333 6.70185 5.34917 6.70185C6.8425 6.64935 8.015 5.43602 8.02083 3.93685C8.02083 2.40852 6.77833 1.16602 5.25 1.16602Z"
                          fill="#6E7682"
                        />
                        <path
                          d="M8.21333 8.2532C6.58583 7.1682 3.93167 7.1682 2.2925 8.2532C1.55167 8.74904 1.14333 9.41987 1.14333 10.1374C1.14333 10.8549 1.55167 11.5199 2.28667 12.0099C3.10333 12.5582 4.17667 12.8324 5.25 12.8324C6.32333 12.8324 7.39667 12.5582 8.21333 12.0099C8.94833 11.514 9.35667 10.849 9.35667 10.1257C9.35083 9.4082 8.94833 8.7432 8.21333 8.2532Z"
                          fill="#6E7682"
                        />
                        <path
                          d="M11.6608 4.28254C11.7542 5.41421 10.9492 6.40587 9.835 6.54004C9.82917 6.54004 9.82917 6.54004 9.82334 6.54004H9.80583C9.77083 6.54004 9.73583 6.54004 9.70667 6.5517C9.14083 6.58087 8.62167 6.40004 8.23083 6.06754C8.83167 5.53087 9.17583 4.72587 9.10583 3.85087C9.065 3.37837 8.90167 2.94671 8.65667 2.57921C8.87834 2.46837 9.135 2.39837 9.3975 2.37504C10.5408 2.27587 11.5617 3.12754 11.6608 4.28254Z"
                          fill="#6E7682"
                        />
                        <path
                          d="M12.8275 9.67708C12.7808 10.2429 12.4192 10.7329 11.8125 11.0654C11.2292 11.3862 10.4942 11.5379 9.765 11.5204C10.185 11.1412 10.43 10.6687 10.4767 10.1671C10.535 9.44375 10.1908 8.74958 9.5025 8.19541C9.11167 7.88625 8.65667 7.64125 8.16084 7.46041C9.45 7.08708 11.0717 7.33791 12.0692 8.14291C12.6058 8.57458 12.88 9.11708 12.8275 9.67708Z"
                          fill="#6E7682"
                        />
                      </svg>
                    </Center>
                    <Text color="text.300" fontSize={14}>
                      Switch Account
                    </Text>
                  </Flex>
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleSignOut} p={2} m={1}>
                  <Flex alignItems="center" gap={2}>
                    <Center
                      borderRadius="50%"
                      border="1px solid #EAEAEB"
                      boxSize="26px"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.59667 7.04018C4.59667 6.80102 4.795 6.60268 5.03417 6.60268H8.23083V1.66768C8.225 1.38768 8.00333 1.16602 7.72333 1.16602C4.2875 1.16602 1.89 3.56352 1.89 6.99935C1.89 10.4352 4.2875 12.8327 7.72333 12.8327C7.9975 12.8327 8.225 12.611 8.225 12.331V7.47185H5.03417C4.78917 7.47768 4.59667 7.27935 4.59667 7.04018Z"
                          fill="#F53535"
                        />
                        <path
                          d="M11.9817 6.73078L10.325 5.06828C10.1558 4.89911 9.87583 4.89911 9.70666 5.06828C9.5375 5.23745 9.5375 5.51745 9.70666 5.68661L10.6167 6.59662H8.225V7.47162H10.6108L9.70083 8.38162C9.53166 8.55078 9.53166 8.83078 9.70083 8.99995C9.78833 9.08745 9.89916 9.12828 10.01 9.12828C10.1208 9.12828 10.2317 9.08745 10.3192 8.99995L11.9758 7.33745C12.1508 7.17411 12.1508 6.89995 11.9817 6.73078Z"
                          fill="#F53535"
                        />
                      </svg>
                    </Center>
                    <Text color="#F53535" fontSize={14}>
                      Log out
                    </Text>
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        {/* <Flex alignItems={"center"}>
    
    </Flex> */}
      </Flex>
      <HelpModal
        toggleHelpModal={toggleHelpModal}
        setToggleHelpModal={setToggleHelpModal}
      />
    </>
  );
};
const SidebarContent = ({
  onClose,
  tutorMenu,
  setTutorMenu,
  toggleMenu,
  ...rest
}: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontWeight="bold">
          <Logo />
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <NavItem icon={FiHome} path={'/dashboard'}>
        Home
      </NavItem>
      <Box ml={8} color="text.400">
        {' '}
        <Button
          variant={'unstyled'}
          display="flex"
          gap={'10px'}
          leftIcon={<FiBriefcase />}
          fontSize={14}
          fontWeight={500}
          onClick={() => setTutorMenu(!tutorMenu)}
          rightIcon={
            tutorMenu ? (
              <MdOutlineKeyboardArrowUp />
            ) : (
              <MdOutlineKeyboardArrowDown />
            )
          }
        >
          Find a tutor
        </Button>
        <Box display={tutorMenu ? 'block' : 'none'}>
          <MenuLinedList
            items={[
              {
                title: 'Marketplace',
                path: '/dashboard/find-tutor'
              },
              {
                title: 'My Tutors',
                path: '/dashboard/my-tutors'
              },
              {
                title: 'Bookmarks',
                path: '/dashboard/saved-tutors'
              }
            ]}
          />
        </Box>
      </Box>
      {LinkItems.map((link) => (
        <>
          <NavItem key={link.name} icon={link.icon} path={link.path}>
            {link.name}
          </NavItem>
        </>
      ))}{' '}
      <Divider />
      {LinkBItems.map((link) => (
        <>
          <NavItem key={link.name} icon={link.icon} path={link.path}>
            {link.name}
          </NavItem>
        </>
      ))}{' '}
      <Divider />
      <NavItem icon={BsPin} path={'/pinned-notes'}>
        Pinned Notes
      </NavItem>
    </Box>
  );
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [tutorMenu, setTutorMenu] = useState(false);
  const [uploadDocumentModal, setUploadDocumentModal] = useState(false);
  const { user }: any = userStore();
  const { pathname } = useLocation();

  const toggleMenu = () => {
    setTutorMenu(!tutorMenu);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {' '}
      <Flex direction="column" bg="white">
        <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }}>
          <Box w="full" flexShrink={0} overflowY="auto">
            <SidebarContent
              onClose={() => onClose}
              tutorMenu={tutorMenu}
              setTutorMenu={setTutorMenu}
              toggleMenu={() => setTutorMenu(!tutorMenu)}
              display={{ base: 'none', md: 'block' }}
            />
            <Drawer
              autoFocus={false}
              isOpen={isOpen}
              placement="left"
              onClose={onClose}
              returnFocusOnClose={false}
              onOverlayClick={onClose}
              size="full"
            >
              <DrawerContent>
                <SidebarContent
                  onClose={onClose}
                  tutorMenu={tutorMenu}
                  setTutorMenu={setTutorMenu}
                  toggleMenu={() => setTutorMenu(!tutorMenu)}
                />
              </DrawerContent>
            </Drawer>
          </Box>

          <Box flex="1" overflowY="auto">
            <Box width={'100%'} zIndex="2">
              <MobileNav onOpen={onOpen} />
            </Box>
            <Box pt={20}>
              <Outlet />
            </Box>
          </Box>
        </Grid>
      </Flex>
    </>
  );
}

export const CustomButton = (props: any) => {
  const { buttonText, fontStyle, buttonType, onClick, padding } = props;
  return (
    <Box
      as="button"
      lineHeight="1.2"
      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
      border="1px"
      padding={padding ? padding : '9px 20px'}
      mx="4px"
      alignItems="center"
      borderRadius="8px"
      fontSize={fontStyle ? fontStyle.fontSize : '14px'}
      fontWeight={fontStyle ? fontStyle.fontWeight : 'semibold'}
      bg={buttonType === 'outlined' ? 'transparent' : '#207DF7'}
      borderColor={buttonType === 'outlined' ? 'transparent' : '#ccd0d5'}
      color={buttonType === 'outlined' ? '#207DF7' : '#fff'}
      _hover={{
        bg: buttonType === 'outlined' ? '#E2E8F0' : '#1964c5',
        transform: 'translateY(-2px)',
        boxShadow: 'lg'
      }}
      _active={{
        bg: '#dddfe2',
        transform: 'scale(0.98)',
        borderColor: '#bec3c9'
      }}
      _focus={{
        boxShadow:
          '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)'
      }}
      onClick={onClick}
      {...props}
    >
      {buttonText}
    </Box>
  );
};
