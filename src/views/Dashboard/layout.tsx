import {
  Avatar,
  Box,
  BoxProps,
  Grid,
  Button,
  Center,
  CloseButton,
  Divider,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
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
  useDisclosure,
} from "@chakra-ui/react";
import { useLocation, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import React, { ReactNode, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { BsChatLeftDots, BsPin, BsPlayCircle } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import { FaBell } from "react-icons/fa";
import {
  FiBarChart2,
  FiBell,
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
  FiCompass,
  FiHome,
  FiMenu,
  FiSettings,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { TbCards } from "react-icons/tb";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import FeedIcon from "../../assets/blue-energy.svg";
import DocIcon from "../../assets/doc-icon.svg";
import Doc from "../../assets/doc.svg";
import FlashcardIcon from "../../assets/flashcardIcon.svg";
import MessageIcon from "../../assets/message.svg";
import NewNote from "../../assets/newnote.svg";
import NoteIcon from "../../assets/notes.svg";
import ReceiptIcon from "../../assets/receiptIcon.svg";
import VideoIcon from "../../assets/video.svg";
import Logo from "../../components/Logo";
import { firebaseAuth } from "../../firebase";
import userStore from "../../state/userStore";
import TutorMarketplace from "./Tutor";
import MenuLinedList from "./components/MenuLinedList";
import DashboardIndex from "./index";

const getComparisonPath = (pathname: string) => {
  const pathParts = pathname.split("/").filter((f) => f);
  console.log(pathParts);
  if (pathParts.length === 1) {
    return pathParts[0];
  } else if (pathParts.length > 1) {
    return pathParts[1];
  }
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
  { name: "Home", icon: FiHome, path: "/dashboard" },
  { name: "Performance", icon: FiBarChart2, path: "/performance" },
  { name: "Messages", icon: BsChatLeftDots, path: "/dashboard/messaging" },
];

const LinkBItems: Array<LinkItemProps> = [
  { name: "Library", icon: BsPlayCircle, path: "/library" },
  { name: "Notes", icon: CgNotes, path: "/notes" },
  { name: "Flashcards", icon: TbCards, path: "/dashboard/flashcards" },
];

interface NavItemProps extends FlexProps {
  icon?: IconType;
  children: any;
  path: string;
}

const NavItem = ({ icon, path, children, ...rest }) => {
  const { pathname } = useLocation();
  console.log(getComparisonPath(pathname));
  const isActive = path.includes(getComparisonPath(pathname));

  return (
    <Link to={path} style={{ textDecoration: "none" }}>
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
          bg: "#F0F6FE",
          color: "#207DF7",
        }}
        bg={isActive ? "#F0F6FE" : "transparent"}
        color={isActive ? "#207DF7" : "text.400"}
        fontSize={14}
        fontWeight={isActive ? "500" : "400"}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "#207DF7",
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
  const navigate = useNavigate();
  const { user }: any = userStore();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Flex
      px={{ base: 4, md: 4 }}
      height="20"
      width="calc(100vw - 250px)"
      alignItems="center"
      zIndex={1}
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      position="fixed" // added this
      top="0" // added this
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        <Logo />{" "}
      </Text>

      <HStack spacing={4}>
        <Menu>
          <MenuButton
            bg={"#207DF7"}
            color="white"
            fontSize="14px"
            _hover={{ bg: "#1964c5" }}
            _active={{ bg: "#1964c5" }}
            as={Button}
            rightIcon={<FiChevronDown />}
          >
            + Create
          </MenuButton>
          <MenuList
            borderRadius="8px"
            backgroundColor="#FFFFFF"
            padding="8px"
            boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
          >
            <MenuItem
              p="4px 8px"
              display={"flex"}
              alignItems={"center"}
              _hover={{ bgColor: "#F2F4F7" }}
              onClick={() => console.log("ADD NEW NOTE")}
            >
              <Image mt="2px" width={"26px"} height={"26px"} src={NewNote} />
              <Text
                color="#212224"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="400"
              >
                New note
              </Text>
            </MenuItem>
            <MenuItem
              p="4px 8px"
              display={"flex"}
              alignItems={"center"}
              _hover={{ bgColor: "#F2F4F7" }}
            >
              <Image mt="2px" width={"26px"} height={"26px"} src={Doc} />
              <Text
                color="#212224"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="400"
              >
                Upload document
              </Text>
            </MenuItem>
            <MenuItem
              p="4px 8px"
              display={"flex"}
              alignItems={"center"}
              _hover={{ bgColor: "#F2F4F7" }}
              onClick={() => navigate("/dashboard/flashcards/create")}
            >
              <Image mt="2px" width={"26px"} height={"26px"} src={NewNote} />
              <Text
                color="#212224"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="400"
              >
                Flash Card
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton>
            <IconButton
              size="md"
              borderRadius={"100%"}
              border="1px solid #ECEDEE"
              variant="ghost"
              aria-label="open menu"
              color={"text.300"}
              icon={<FaBell />}
            />{" "}
          </MenuButton>
          <MenuList p={3} width={"358px"} zIndex={2}>
            <Box>
              <Flex alignItems="flex-start" px={3} direction={"row"} my={1}>
                <Image src={VideoIcon} alt="doc" maxHeight={45} zIndex={1} />
                <Stack direction={"column"} px={4} spacing={1}>
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
              <Flex alignItems="flex-start" px={3} direction={"row"} my={1}>
                <Image src={MessageIcon} alt="doc" maxHeight={45} zIndex={1} />
                <Stack direction={"column"} px={4} spacing={1}>
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
              <Flex alignItems="flex-start" px={3} direction={"row"} my={1}>
                <Image src={VideoIcon} alt="doc" maxHeight={45} zIndex={1} />
                <Stack direction={"column"} px={4} spacing={1}>
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
              <Flex alignItems="flex-start" px={3} direction={"row"} my={1}>
                <Image src={MessageIcon} alt="doc" maxHeight={45} zIndex={1} />
                <Stack direction={"column"} px={4} spacing={1}>
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
            _focus={{ boxShadow: "none" }}
            bg="#F4F5F5"
            borderRadius={"40px"}
            px={3}
          >
            <HStack>
              <Avatar
                size="sm"
                color="white"
                name={`${user.name.first} ${user.name.last}`}
                bg="#4CAF50;"
              />

              <Text
                fontSize="14px"
                fontWeight={500}
                color="text.200"
                display={{ base: "block", sm: "none", md: "block" }}
              >
                {`${user.name.first} ${user.name.last}`}
              </Text>

              <Box display={{ base: "none", md: "flex" }}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList
            bg={useColorModeValue("white", "gray.900")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <MenuItem>Profile</MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* <Flex alignItems={"center"}>
    
    </Flex> */}
    </Flex>
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
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      borderTop="1px"
      borderTopColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontWeight="bold">
          <Logo />
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Box ml={8} color="text.400">
        {" "}
        <Button
          variant={"unstyled"}
          display="flex"
          gap={"10px"}
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
        <Box display={tutorMenu ? "block" : "none"}>
          <MenuLinedList
            items={[
              {
                title: "Marketplace",
                path: "/dashboard/find-tutor",
              },
              {
                title: "My Tutors",
                path: "/dashboard/my-tutors",
              },
              {
                title: "Bookmarks",
                path: "/dashboard/saved-tutors",
              },
            ]}
          />
          {/* <NavItem path="/dashboard/find-tutor">Marketplace</NavItem>
        <NavItem path="/dashboard/my-tutors">My Tutors</NavItem>
        <NavItem path="/dashboard/saved-tutors">Bookmarks</NavItem> */}
        </Box>
      </Box>
      <Divider />
      {LinkItems.map((link) => (
        <>
          <NavItem key={link.name} icon={link.icon} path={link.path}>
            {link.name}
          </NavItem>
        </>
      ))}{" "}
      <Divider />
      {LinkBItems.map((link) => (
        <>
          <NavItem key={link.name} icon={link.icon} path={link.path}>
            {link.name}
          </NavItem>
        </>
      ))}{" "}
      <Divider />
      <NavItem icon={BsPin} path={"/pinned-notes"}>
        Pinned Notes
      </NavItem>
    </Box>
  );
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [tutorMenu, setTutorMenu] = useState(true);
  const { user }: any = userStore();
  console.log(tutorMenu);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const user = {
  //   name: {
  //     first: "Akinola",
  //     last: "Ola",
  //   },
  // };
  console.log("userrrr", user);

  const toggleMenu = () => {
    setTutorMenu(!tutorMenu);
  };

  return (
    <Flex direction="column" minH="100vh" bg="white">
      <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }} h="100vh">
        <Box w="full" h="100vh" flexShrink={0} overflowY="auto">
          <SidebarContent
            onClose={() => onClose}
            tutorMenu={tutorMenu}
            setTutorMenu={setTutorMenu}
            toggleMenu={() => setTutorMenu(!tutorMenu)}
            display={{ base: "none", md: "block" }}
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
          <Box width={"100%"} zIndex="2">
            <MobileNav onOpen={onOpen} />
          </Box>

          <Box pt="20">
            <Outlet />
          </Box>
        </Box>
      </Grid>
    </Flex>
  );
}

export const CustomButton = (props: any) => {
  const { buttonText, fontStyle, buttonType, onClick, padding } = props;
  return (
    <Box
      as="button"
      height="38px"
      lineHeight="1.2"
      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
      border="1px"
      padding={padding ? padding : "9px 20px"}
      mx="4px"
      alignItems="center"
      borderRadius="8px"
      fontSize={fontStyle ? fontStyle.fontSize : "14px"}
      fontWeight={fontStyle ? fontStyle.fontWeight : "semibold"}
      bg={buttonType === "outlined" ? "transparent" : "#207DF7"}
      borderColor={buttonType === "outlined" ? "transparent" : "#ccd0d5"}
      color={buttonType === "outlined" ? "#207DF7" : "#fff"}
      _hover={{
        bg: buttonType === "outlined" ? "#E2E8F0" : "#1964c5",
        transform: "translateY(-2px)",
        boxShadow: "lg",
      }}
      _active={{
        bg: "#dddfe2",
        transform: "scale(0.98)",
        borderColor: "#bec3c9",
      }}
      _focus={{
        boxShadow:
          "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)",
      }}
      onClick={onClick}
    >
      {buttonText}
    </Box>
  );
};