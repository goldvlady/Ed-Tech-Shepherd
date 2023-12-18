import React, { useRef, useState, ChangeEvent } from 'react';
import {
  Grid,
  Box,
  Divider,
  Flex,
  Image,
  Text,
  Input,
  Button,
  Heading,
  UnorderedList,
  ListItem,
  Icon,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Spacer,
  List,
  VStack,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid
} from '@chakra-ui/react';
import { FaPlus, FaCheckCircle, FaPencilAlt, FaRocket } from 'react-icons/fa';
import SelectComponent, { Option } from '../../../components/Select';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import SubjectCard from '../../../components/SubjectCard';

function StudyPlans() {
  const [studyPlans, setStudyPlans] = useState(['1', '2']);
  const [tutorGrid] = useAutoAnimate();
  const navigate = useNavigate();
  return (
    <>
      <Box>
        <Text fontSize={24} fontWeight={600} color="text.200">
          Study Plans
        </Text>
        <Text fontSize={14} fontWeight={400} color="text.300">
          Chart success: Monitor your personalized study plans.
        </Text>
      </Box>
      {studyPlans.length > 0 ? (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing="20px"
          ref={tutorGrid}
          mt={4}
        >
          {studyPlans?.map((plan: any) => (
            <SubjectCard
              title="Chemistry CS23"
              score={75}
              scoreColor="green"
              date="24 Apr, 2023"
            />
          ))}
        </SimpleGrid>
      ) : (
        <section className="flex justify-center items-center mt-28 w-full">
          <div className="text-center">
            <img src="/images/notes.png" alt="" />
            <Text>You don't have any study plans yet!</Text>
            <Button onClick={() => navigate('/dashboard/create-study-plans')}>
              Create New
            </Button>

            {/* <button
      type="button"
      className="inline-flex items-center justify-center mt-4 gap-x-2 w-[286px] rounded-md bg-secondaryBlue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      Place Bounty
    </button> */}
          </div>
        </section>
      )}
    </>
  );
}

export default StudyPlans;
