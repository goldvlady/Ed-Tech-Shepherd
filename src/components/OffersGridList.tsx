import {
  PencilIcon,
  SparklesIcon,
  ArrowRightIcon,
  EllipsistIcon
} from './icons';
import { StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Text,
  Flex,
  Image,
  SimpleGrid,
  Grid,
  GridItem,
  Divider,
  VStack
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Status {
  new: number;
  updated: number;
  perfectOffer: number;
  justDate: number;
}

interface Offer {
  id: number;
  subject: string;
  level: string;
  title: string;
  status: Status;
  offer: string;
  from: string;
  to: string;
  time: string;
  name: string;
  imageURL: string;
}

const offerss: Offer[] = [
  {
    id: 1,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 1,
      updated: 1,
      perfectOffer: 0,
      justDate: 0
    },
    offer: '22.00',
    from: '05:00',
    to: '08:00',
    time: '',
    name: 'William Kelly',
    imageURL:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 1,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 1,
      updated: 0,
      perfectOffer: 0,
      justDate: 0
    },
    offer: '22.00',
    from: '05:00',
    to: '08:00',
    time: '',
    name: 'William Kelly',
    imageURL:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 1,
      updated: 0,
      perfectOffer: 1,
      justDate: 0
    },
    offer: '22.00',
    from: '05:00',
    to: '08:00',
    time: '',
    name: 'William Kelly',
    imageURL:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 3,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 0,
      updated: 0,
      perfectOffer: 0,
      justDate: 1
    },
    offer: '22.00',
    from: '05:00',
    to: '08:00',
    time: '23',
    name: 'William Kelly',
    imageURL:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 4,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 1,
      updated: 0,
      perfectOffer: 1,
      justDate: 0
    },
    offer: '22.00',
    from: '05:00',
    to: '08:00',
    time: '',
    name: 'William Kelly',
    imageURL:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 4,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 0,
      updated: 0,
      perfectOffer: 0,
      justDate: 1
    },
    offer: '22.00',
    from: '05:00',
    to: '08:00',
    time: '',
    name: 'William Kelly',
    imageURL:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 4,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 1,
      updated: 0,
      perfectOffer: 0,
      justDate: 0
    },
    offer: '22.00',
    from: '05:00',
    to: '08:00',
    time: '',
    name: 'William Kelly',
    imageURL:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 4,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 0,
      updated: 0,
      perfectOffer: 0,
      justDate: 1
    },
    offer: '22.00',
    from: '05:00',
    to: '08:00',
    time: '23',
    name: 'William Kelly',
    imageURL:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

function Updated() {
  return (
    <Text
      as="p"
      display="inline-flex"
      flexShrink={0}
      alignItems="center"
      rounded="md"
      py="1"
      px="1.5"
      bg="blue.50"
      fontSize="xs"
      mr="2"
      fontWeight="medium"
      color="blue.500"
      className="space-x-1"
    >
      <PencilIcon className="w-4 h-4" onClick={undefined} />
      <Text as="span">Updated</Text>
    </Text>
  );
}

function PerfectOffer() {
  return (
    <Text className="inline-flex flex-shrink-0 mr-2 space-x-1 items-center rounded-md bg-blue-100 px-1.5 py-1 text-xs font-medium text-secondaryBlue">
      <StarIcon w={4} h={4} />
      <span>Perfect Offer</span>
    </Text>
  );
}

function New() {
  return (
    <Text className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray">
      <SparklesIcon className="w-4 h-4" onClick={undefined} />
      <span>New</span>
    </Text>
  );
}

function Date() {
  return (
    <Text className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray">
      24.09.2022
    </Text>
  );
}

function OfferItem({ offer, navigate }: { offer: Offer; navigate: any }) {
  const {
    id,
    imageURL,
    name,
    offer: offerAmount,
    subject,
    level,
    title,
    status,
    from,
    to,
    time
  } = offer;

  const handleItemClick = () => {
    navigate(`tutordashboard/offers/${id}`);
  };

  const styles = {
    boxShadow: '0px 4px 20px 0px #737E8C26'
  };

  return (
    <GridItem
      onClick={handleItemClick}
      mb={6}
      cursor="pointer"
      border="1px"
      borderColor="gray.100"
      p={3}
      rounded="lg"
      bg="white"
      sx={styles}
      gap={2}
      colSpan={1}
    >
      <VStack spacing={3}>
        <Flex w="full" justifyContent="space-between" alignItems="center">
          <Box flexShrink={0} bg="gray.100" p={2} rounded="full">
            <Image
              src="/svgs/text-document.svg"
              color="gray.400"
              h={6}
              w={6}
              alt=""
            />
          </Box>

          <Box>
            <Flex align="center">
              {status.perfectOffer === 1 && <PerfectOffer />}
              {status.updated === 1 && <Updated />}
              {status.new === 1 && <New />}
              {status.justDate === 1 && <Date />}
            </Flex>
          </Box>
        </Flex>

        <Flex w="full" alignItems="center" justifyContent="space-between">
          <Box>
            <Text mr="1" as="span">
              {subject}
            </Text>
            <Text
              as="p"
              display="inline-flex"
              align="center"
              rounded="md"
              bg="orange.100"
              px={1.5}
              py={1}
              fontSize="xs"
              fontWeight="medium"
              color="orange.400"
            >
              <Text as="span">{level}-Level</Text>
            </Text>
          </Box>

          <Text as="p" fontSize="md" fontWeight="medium">
            ${offerAmount}/hr
          </Text>
        </Flex>

        <Flex
          as="p"
          color="gray.500"
          fontSize="sm"
          fontWeight="normal"
          ml="-8"
          alignItems="center"
        >
          <Text as="span">{title}</Text>
          <EllipsistIcon className="w-1 mx-0.5" onClick={undefined} />
          <Text as="span">{from} PM</Text>
          <ArrowRightIcon className="w-3 mx-0.5" onClick={undefined} />
          <Text as="span">{to} PM</Text>
        </Flex>
      </VStack>

      <Divider my={2} color="gray.400" />

      <Flex alignItems="center" justifyContent="space-between" pt="1">
        <Flex alignItems="center" fontSize="sm" fontWeight="normal" gap={3}>
          <Image
            w={8}
            h={8}
            flexShrink={0}
            rounded="full"
            bg="gray.300"
            src={imageURL}
            alt=""
          />
          <Text as="span" color="gray.600">
            {name}
          </Text>
        </Flex>
        <Text as="p" fontSize="sm" fontWeight="semibold" color="red.400">
          {time ? `${time}hours left` : ''}
        </Text>
      </Flex>
    </GridItem>
  );
}

export default function OffersGridList({ offers }) {
  const navigate = useNavigate();
  return (
    <SimpleGrid
      //gap={6}
      columns={3}
      spacingX="15px"
      spacingY="0px"
      //templateColumns="repeat(1, 1fr)"
      //templateColumns={{base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'}}
    >
      {offerss.map((offer) => (
        <OfferItem key={offer.id} offer={offer} navigate={navigate} />
      ))}
    </SimpleGrid>
  );
}
