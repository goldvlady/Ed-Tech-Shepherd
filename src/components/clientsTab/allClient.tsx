import { classNames } from '../../helpers';
import { TrashIcon } from '../icons';
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Thead,
  Th,
  Tr,
  Td,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  SimpleGrid,
  HStack
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { Menu, Transition } from '@headlessui/react';
import {
  StarIcon,
  EllipsisHorizontalIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import React, { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: number;
  name: string;
  subject: string;
  startDate: string;
  endDate: string;
  status: string;
  amountEarned: string;
  classes: string;
  rating: string;
}

const clients: Client[] = [
  {
    id: 0,
    name: 'William Kelly',
    subject: 'Economics, A-level',
    startDate: 'May 09, 2023',
    endDate: 'May 20, 2023',
    status: 'Active',
    amountEarned: '410.00',
    classes: 'Lesson 1',
    rating: '1'
  },
  {
    id: 1,
    name: 'William Kelly',
    subject: 'Economics, A-level',
    startDate: 'May 09, 2023',
    endDate: 'May 20, 2023',
    status: 'Active',
    amountEarned: '410.00',
    classes: 'Lesson 1',
    rating: '1'
  },
  {
    id: 2,
    name: 'William Kelly',
    subject: 'Economics, A-level',
    startDate: 'May 09, 2023',
    endDate: 'May 20, 2023',
    status: 'Ended',
    amountEarned: '410.00',
    classes: 'Lesson 1',
    rating: '1'
  },
  {
    id: 3,
    name: 'William Kelly',
    subject: 'Economics, A-level',
    startDate: 'May 09, 2023',
    endDate: 'May 20, 2023',
    status: 'Pending',
    amountEarned: '410.00',
    classes: 'Lesson 1',
    rating: '1'
  },
  {
    id: 4,
    name: 'William Kelly',
    subject: 'Economics, A-level',
    startDate: 'May 09, 2023',
    endDate: 'May 20, 2023',
    status: 'Active',
    amountEarned: '410.00',
    classes: 'Lesson 1',
    rating: '1'
  },
  {
    id: 5,
    name: 'William Kelly',
    subject: 'Economics, A-level',
    startDate: 'May 09, 2023',
    endDate: 'May 20, 2023',
    status: 'Ended',
    amountEarned: '410.00',
    classes: 'Lesson 1',
    rating: '1'
  },
  {
    id: 6,
    name: 'William Kelly',
    subject: 'Economics, A-level',
    startDate: 'May 09, 2023',
    endDate: 'May 20, 2023',
    status: 'Ended',
    amountEarned: '410.00',
    classes: 'Lesson 1',
    rating: '1'
  }
];

const AllClientTab = () => {
  const {
    isOpen: isOpenReport,
    onOpen: onOpenReport,
    onClose: onCloseReport
  } = useDisclosure();
  const {
    isOpen: isOpenReview,
    onOpen: onOpenReview,
    onClose: onCloseReview
  } = useDisclosure();
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<Client[]>([]);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < clients.length;
    setChecked(selectedPeople.length === clients.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedPeople]);

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : clients);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  return (
    <>
      <Box mt="4">
        <Box className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <Box
            display="inline-block"
            minW="full"
            py={2}
            verticalAlign="middle"
            px={['2', '6']}
            pb={['2', '6']}
          >
            <Box pos="relative">
              <Box>
                {selectedPeople.length > 0 && (
                  <Flex
                    top="20"
                    border="1px"
                    borderColor="gray.200"
                    px={4}
                    py={8}
                    pos="absolute"
                    rounded="md"
                    align="center"
                    width={469}
                    height={12}
                    bg="white"
                    left={[0, 20]}
                  >
                    <Text className="text-gray-600">
                      {selectedPeople.length} items selected
                    </Text>

                    <Button mx="1" color="gray.600" onClick={toggleAll}>
                      Select all
                    </Button>

                    <Button
                      type="button"
                      display="inline-flex"
                      alignItems="center"
                      rounded="md"
                      bg="white"
                      px="6"
                      py="2"
                      mr="2"
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.700"
                      shadow="sm"
                      ring="1"
                      ringInset="inset"
                      ringColor="gray.300"
                      _hover={{
                        bg: 'gray.50'
                      }}
                      cursor="not-allowed"
                    >
                      <TrashIcon className="w-5" onClick={undefined} />
                      <Text as="span" ml={2}>
                        Delete
                      </Text>
                    </Button>
                    <Button
                      type="button"
                      display="inline-flex"
                      alignItems="center"
                      rounded="md"
                      bg="white"
                      px="6"
                      py="2"
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.700"
                      shadow="sm"
                      ring="1"
                      ringInset="inset"
                      ringColor="gray.300"
                      _hover={{
                        bg: 'gray.50'
                      }}
                      cursor="not-allowed"
                    >
                      Done
                    </Button>
                  </Flex>
                )}
              </Box>
              <Table minW="full" className="divide-y divide-gray-300">
                <Thead>
                  <Tr bg="gray.50">
                    <Th
                      scope="col"
                      position="relative"
                      w={[12]}
                      px={[6]}
                      visibility="hidden"
                      className="hidden"
                    >
                      <Input
                        type="checkbox"
                        pos="absolute"
                        left="4"
                        h="4"
                        w="5"
                        rounded="md"
                        mt="-2"
                        borderColor="gray.300"
                        color="indigo"
                        _focus={{
                          ringColor: 'indigo'
                        }}
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </Th>

                    <Th scope="col" pos="relative" w={[12]} px={[0, 6]}></Th>

                    <Th
                      scope="col-span"
                      w={[12]}
                      py="3.5"
                      textAlign="left"
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Client name
                    </Th>
                    <Th
                      scope="col"
                      py="3.5"
                      textAlign="left"
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Subject
                    </Th>
                    <Th
                      scope="col"
                      py="3.5"
                      textAlign="left"
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Start date
                    </Th>
                    <Th
                      scope="col"
                      py="3.5"
                      textAlign="left"
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      End date
                    </Th>
                    <Th
                      scope="col"
                      py="3.5"
                      textAlign="left"
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Status
                    </Th>
                    <Th
                      scope="col"
                      py="3.5"
                      textAlign="left"
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Amount earned
                    </Th>
                    <Th
                      scope="col"
                      py="3.5"
                      textAlign="left"
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Classes
                    </Th>
                    <Th
                      scope="col"
                      py="3.5"
                      textAlign="left"
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Rating
                    </Th>
                    <Th
                      scope="col"
                      py="3.5"
                      textAlign="left"
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.600"
                    ></Th>
                  </Tr>
                </Thead>
                <Tbody className="divide-y divide-gray-200 bg-white">
                  {clients.map((client) => (
                    <Tr
                      key={client.id}
                      className={
                        selectedPeople.includes(client)
                          ? 'bg-blue-50'
                          : undefined
                      }
                    >
                      <Td pos="relative" px={[7, 6]} w={[0, 12]}>
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primaryBlue focus:ring-primaryBlue"
                          value={client.name}
                          checked={selectedPeople.includes(client)}
                          onChange={(e) =>
                            setSelectedPeople(
                              e.target.checked
                                ? [...selectedPeople, client]
                                : selectedPeople.filter((p) => p !== client)
                            )
                          }
                        />
                      </Td>
                      <Td
                        whiteSpace="nowrap"
                        py="4"
                        pr="3"
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.500"
                      >
                        {client.name}
                      </Td>
                      <Td
                        whiteSpace="nowrap"
                        px="3"
                        py="4"
                        fontSize="sm"
                        color="gray.500"
                      >
                        {client.subject}
                      </Td>
                      <Td
                        whiteSpace="nowrap"
                        px="3"
                        py="4"
                        fontSize="sm"
                        color="gray.500"
                      >
                        {client.startDate}
                      </Td>
                      <Td
                        whiteSpace="nowrap"
                        px="3"
                        py="4"
                        fontSize="sm"
                        color="gray.500"
                      >
                        {client.endDate}
                      </Td>
                      <Td
                        className={classNames(
                          `${
                            client.status.toLowerCase() === 'active'
                              ? 'text-primaryBlue'
                              : 'text-gray-500'
                          }`,
                          `${
                            client.status.toLowerCase() === 'pending'
                              ? 'text-orange-400'
                              : 'text-gray-500'
                          }`,
                          'whitespace-nowrap px-3 py-4 text-sm'
                        )}
                      >
                        {client.status}
                      </Td>
                      <Td
                        whiteSpace="nowrap"
                        px="3"
                        py="4"
                        fontSize="sm"
                        color="gray.500"
                      >
                        ${client.amountEarned}
                      </Td>
                      <Td
                        whiteSpace="nowrap"
                        px="3"
                        py="4"
                        fontSize="sm"
                        color="gray.500"
                      >
                        <Text
                          as="span"
                          display="inline-block"
                          bg="gray.100"
                          px="4"
                          py="1"
                          rounded="md"
                        >
                          {client.classes}
                        </Text>
                      </Td>
                      <Td
                        whiteSpace="nowrap"
                        display="flex"
                        alignItems="center"
                        px="4"
                        py="4"
                        fontSize="sm"
                        color="gray.500"
                      >
                        <Text as="span">{client.rating}</Text>
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                      </Td>
                      <Td
                        whiteSpace="nowrap"
                        py="4"
                        pl="3"
                        pr={[0, 3]}
                        textAlign="right"
                        fontSize="sm"
                        fontWeight="medium"
                        className="sm:pr-3"
                      >
                        <Menu as="div" className="relative">
                          <div>
                            <Menu.Button>
                              <EllipsisHorizontalIcon className="h-6 text-secondaryGray" />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute space-y-3 p-4 right-0 z-50 mt-2.5 w-[15rem] origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none">
                              <section className="space-y-2 border-b pb-2">
                                <button
                                  onClick={() =>
                                    navigate(`/clients/${client.id}`)
                                  }
                                  className="w-full bg-gray-100 rounded-md flex items-center justify-between p-2"
                                >
                                  <div className=" flex items-center space-x-1">
                                    <div className="bg-white flex justify-center items-center w-7 h-7 border rounded-full">
                                      <img
                                        src="/svgs/contract.svg"
                                        alt="Contract"
                                        className="w-4 h-4"
                                      />
                                    </div>
                                    <Text className="text-sm text-secondaryGray font-medium">
                                      Contract
                                    </Text>
                                  </div>
                                  <ChevronRightIcon className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  onClick={onOpenReport}
                                  className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2"
                                >
                                  <div className="flex items-center space-x-1">
                                    <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                                      <img
                                        src="/svgs/contract.svg"
                                        alt="Monthly report"
                                        className="w-4 h-4"
                                      />
                                    </div>
                                    <Text className="text-sm text-secondaryGray font-medium">
                                      Monthly report
                                    </Text>
                                  </div>
                                  <ChevronRightIcon className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  onClick={onOpenReview}
                                  className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2"
                                >
                                  <div className="flex items-center space-x-1">
                                    <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                                      <StarIcon className="w-4 h-4 text-secondaryGray" />
                                    </div>
                                    <Text className="text-sm text-secondaryGray font-medium">
                                      Client review
                                    </Text>
                                  </div>
                                  <ChevronRightIcon className="w-2.5 h-2.5" />
                                </button>
                              </section>
                              {client.status.toLowerCase() === 'ended' ? (
                                <button
                                  disabled={true}
                                  className="w-full cursor-not-allowed hover:bg-gray-100 rounded-md flex items-center justify-between p-2"
                                >
                                  <div className="flex items-center space-x-1">
                                    <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                                      <TrashIcon
                                        className="w-4 h-4 text-gray-400"
                                        onClick={undefined}
                                      />
                                    </div>
                                    <Text className="text-sm text-gray-300 font-medium">
                                      Delete
                                    </Text>
                                  </div>
                                </button>
                              ) : (
                                <button className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2">
                                  <div className="flex items-center space-x-1">
                                    <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                                      <img
                                        src="/svgs/trash.svg"
                                        alt="Delete Clients"
                                        className="w-4 h-4"
                                      />
                                    </div>
                                    <Text className="text-sm text-error font-medium">
                                      Delete
                                    </Text>
                                  </div>
                                </button>
                              )}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Montly Report Modal */}
      <Modal isOpen={isOpenReport} onClose={onCloseReport}>
        <ModalOverlay />
        <ModalContent>
          <Box>
            <Box py="2">
              <Flex
                alignItems="center"
                justifyContent="space-between"
                px="3"
                borderBottom="1px"
                borderBottomColor="gray.200"
                pb="3"
              >
                <Text as="h3">Monthly report</Text>
                <Button
                  onClick={onCloseReport}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  rounded="full"
                  h="10"
                  w="10"
                  border="1px"
                  borderColor="gray.200"
                  bg="white"
                  fontWeight="medium"
                  color="gray.600"
                >
                  <XMarkIcon className="w-10 h-10" />
                </Button>
              </Flex>
              <Box mt={[3, 5]}>
                <Box mt="4">
                  <Text as="h3" color="gray.700" mb="3" pl="4">
                    Previous classes
                  </Text>
                  <HStack pl="4">
                    <Text as="h3" fontSize="xs">
                      8th May
                    </Text>
                    <Box
                      borderTop="1px"
                      borderTopColor="gray.200"
                      flex="1"
                      mt="1.5"
                      pt="2"
                      pr="4"
                    >
                      <Flex
                        flex="1"
                        alignItems="center"
                        justifyContent="space-between"
                        w="full"
                        p="2"
                        border="1px"
                        borderColor="gray.200"
                        rounded="md"
                        bg="white"
                      >
                        <Flex alignItems="center" fontSize="xs">
                          <svg
                            viewBox="0 0 2 2"
                            className="h-1.5 w-1.5 text-gray-400 fill-current"
                          >
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <Text mx="2" as="p" color="gray.800">
                            03:30 pm
                          </Text>
                          <svg
                            viewBox="0 0 2 2"
                            className="h-1.5 w-1.5 text-gray-400 fill-current"
                          >
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <Text as="p" mx="2" color="gray.800">
                            04:30 pm
                          </Text>
                        </Flex>
                        <Text
                          as="p"
                          fontSize="xs"
                          px="2"
                          py="1"
                          rounded="full"
                          bg="blue.50"
                          color="blue.500"
                        >
                          1hr
                        </Text>
                      </Flex>
                    </Box>
                  </HStack>

                  <HStack mt="1" pl="4">
                    <Text as="h3" fontSize="xs">
                      8th May
                    </Text>
                    <Box
                      borderTop="1px"
                      borderTopColor="gray.200"
                      flex="1"
                      mt="1.5"
                      pt="2"
                      pr="4"
                    >
                      <Flex
                        flex="1"
                        alignItems="center"
                        justifyContent="space-between"
                        w="full"
                        p="2"
                        border="1px"
                        borderColor="gray.200"
                        rounded="md"
                        bg="white"
                      >
                        <Flex alignItems="center" fontSize="xs">
                          <svg
                            viewBox="0 0 2 2"
                            className="h-1.5 w-1.5 text-gray-400 fill-current"
                          >
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <Text mx="2" as="p" color="gray.800">
                            03:30 pm
                          </Text>
                          <svg
                            viewBox="0 0 2 2"
                            className="h-1.5 w-1.5 text-gray-400 fill-current"
                          >
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <Text as="p" mx="2" color="gray.800">
                            04:30 pm
                          </Text>
                        </Flex>
                        <Text
                          as="p"
                          fontSize="xs"
                          px="2"
                          py="1"
                          rounded="full"
                          bg="blue.50"
                          color="blue.500"
                        >
                          1hr
                        </Text>
                      </Flex>
                    </Box>
                  </HStack>
                </Box>

                <Box mt="4">
                  <Text as="h3" color="gray.700" mb="3" pl="4">
                    Upcoming classes
                  </Text>
                  <HStack pl="4">
                    <Text as="h3" fontSize="xs">
                      10th May
                    </Text>
                    <Box
                      borderTop="1px"
                      borderTopColor="gray.200"
                      flex="1"
                      mt="1.5"
                      pt="2"
                      pr="4"
                    >
                      <Flex
                        flex="1"
                        alignItems="center"
                        justifyContent="space-between"
                        w="full"
                        p="2"
                        border="1px"
                        borderColor="gray.200"
                        rounded="md"
                        bg="white"
                      >
                        <Flex alignItems="center" fontSize="xs">
                          <svg
                            viewBox="0 0 2 2"
                            className="h-1.5 w-1.5 text-gray-400 fill-current"
                          >
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <Text mx="2" as="p" color="gray.800">
                            03:30 pm
                          </Text>
                          <svg
                            viewBox="0 0 2 2"
                            className="h-1.5 w-1.5 text-gray-400 fill-current"
                          >
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <Text as="p" mx="2" color="gray.800">
                            04:30 pm
                          </Text>
                        </Flex>
                        <Text
                          as="p"
                          fontSize="xs"
                          px="2"
                          py="1"
                          rounded="full"
                          bg="blue.50"
                          color="blue.500"
                        >
                          1hr
                        </Text>
                      </Flex>
                    </Box>
                  </HStack>

                  <HStack mt="1" pl="4">
                    <Text as="h3" fontSize="xs">
                      12th May
                    </Text>
                    <Box
                      borderTop="1px"
                      borderTopColor="gray.200"
                      flex="1"
                      mt="1.5"
                      pt="2"
                      pr="4"
                    >
                      <Flex
                        flex="1"
                        alignItems="center"
                        justifyContent="space-between"
                        w="full"
                        p="2"
                        border="1px"
                        borderColor="gray.200"
                        rounded="md"
                        bg="white"
                      >
                        <Flex alignItems="center" fontSize="xs">
                          <svg
                            viewBox="0 0 2 2"
                            className="h-1.5 w-1.5 text-gray-400 fill-current"
                          >
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <Text mx="2" as="p" color="gray.800">
                            03:30 pm
                          </Text>
                          <svg
                            viewBox="0 0 2 2"
                            className="h-1.5 w-1.5 text-gray-400 fill-current"
                          >
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <Text as="p" mx="2" color="gray.800">
                            04:30 pm
                          </Text>
                        </Flex>
                        <Text
                          as="p"
                          fontSize="xs"
                          px="2"
                          py="1"
                          rounded="full"
                          bg="blue.50"
                          color="blue.500"
                        >
                          1hr
                        </Text>
                      </Flex>
                    </Box>
                  </HStack>
                </Box>
              </Box>
            </Box>
            <Flex
              mt={[5, 6]}
              p="3"
              justifyContent="space-between"
              alignItems="center"
              w="full"
              bg="gray.100"
            >
              <Box fontSize="xs" color="gray.600">
                <Text as="p">Total hours</Text>
                <Text as="p" color="gray.800" fontWeight="semibold">
                  20 hrs
                </Text>
              </Box>
              <Box fontSize="xs" color="gray.600">
                <Text as="p">Total Received</Text>
                <Text as="p" color="gray.800" fontWeight="semibold">
                  $212.00
                </Text>
              </Box>
              <Box fontSize="xs" color="gray.600">
                <Text as="p">Total Amount</Text>
                <Text as="p" color="gray.800" fontWeight="semibold">
                  $412.00
                </Text>
              </Box>
            </Flex>
          </Box>
        </ModalContent>
      </Modal>

      {/* Client Review Modal */}
      <Modal isOpen={isOpenReview} onClose={onCloseReview}>
        <ModalOverlay />
        <ModalContent>
          <Box>
            <Flex
              justifyContent="center"
              px="3"
              py="3"
              borderBottom="1px"
              borderBottomColor="gray.200"
              pb="3"
            >
              <Text as="h4">Liam Kelly dropped feedback for you</Text>
            </Flex>
            <Box mt={[3, 5]}>
              <Box p="3">
                <Text as="h3" color="gray.700" mb="2">
                  Rating
                </Text>
                <SimpleGrid columns={5} gap={2}>
                  <Flex
                    justifyContent="center"
                    border="1px"
                    borderColor="gray.200"
                    py="2"
                    rounded="md"
                    textAlign="center"
                    bg="white"
                  >
                    <Text as="span">1</Text>
                    <StarIcon className="w-5 text-yellow-400" />
                  </Flex>
                  <Flex
                    justifyContent="center"
                    border="1px"
                    borderColor="gray.200"
                    py="2"
                    rounded="md"
                    textAlign="center"
                    bg="white"
                  >
                    <Text as="span">2</Text>
                    <StarIcon className="w-5 text-yellow-400" />
                  </Flex>
                  <Flex
                    justifyContent="center"
                    border="1px"
                    borderColor="gray.200"
                    py="2"
                    rounded="md"
                    textAlign="center"
                    bg="white"
                  >
                    <Text as="span">3</Text>
                    <StarIcon className="w-5 text-yellow-400" />
                  </Flex>
                  <Flex
                    justifyContent="center"
                    border="1px"
                    borderColor="gray.200"
                    py="2"
                    rounded="md"
                    textAlign="center"
                    bg="white"
                  >
                    <Text as="span">4</Text>
                    <StarIcon className="w-5 text-yellow-400" />
                  </Flex>
                  <Flex
                    justifyContent="center"
                    border="1px"
                    borderColor="gray.200"
                    py="2"
                    rounded="md"
                    textAlign="center"
                    bg="white"
                  >
                    <Text as="span">5</Text>
                    <StarIcon className="w-5 text-yellow-400" />
                  </Flex>
                </SimpleGrid>
              </Box>
              <Box p="3">
                <Text
                  as="p"
                  mt="4"
                  border="1px"
                  borderColor="gray.200"
                  rounded="md"
                  p="3"
                  color="gray.800"
                >
                  Risus purus sed integer arcu sollicitudin eros tellus
                  phasellus viverra. Dolor suspendisse quisque proin velit nulla
                  diam. Vitae in mauris condimentum s
                </Text>
              </Box>
            </Box>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AllClientTab;
