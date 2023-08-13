import ApiService from '../services/ApiService';
import userStore from '../state/userStore';
import { CustomButton } from '../views/Dashboard/layout';
import { StarIcon } from './icons';
import { SelectedNoteModal } from './index';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  HStack,
  useRadio,
  useRadioGroup,
  Center
} from '@chakra-ui/react';
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { getAuth } from 'firebase/auth';
import { Fragment, useState, useEffect, useCallback } from 'react';
import { PiCheckCircleFill } from 'react-icons/pi';
import { useNavigate } from 'react-router';
import Typewriter from 'typewriter-effect';

interface ToggleProps {
  setToggleProfileSwitchModal: (state: boolean) => void;
  toggleProfileSwitchModal: boolean;
}

const ProfileSwitchModal = ({
  setToggleProfileSwitchModal,
  toggleProfileSwitchModal
}: ToggleProps) => {
  const { user, fetchUser } = userStore();
  const [currentPlan, setCurrentPlan] = useState('Basic');
  const [selectedProfile, setSelectedProfile] = useState('');

  const handleClose = () => {
    setToggleProfileSwitchModal(false);
  };

  function RadioCard(props) {
    const { getInputProps, getRadioProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
      <Box as="label">
        <input {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          _checked={{
            bg: 'transparent',
            color: 'white',
            borderColor: input.value === 'student' ? '#FED7AA' : '#64a5fa'
          }}
          _focus={{
            boxShadow: 'outline'
          }}
          width="350px"
          py={2}
        >
          {props.children}
        </Box>
      </Box>
    );
  }

  const options = ['Student', 'Tutor'];

  const isDashboardPage = window.location.pathname.includes('/dashboard');
  const isTutorDashboardPage = window.location.pathname.includes(
    '/dashboard/tutordashboard'
  );

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: (value) => {
      setSelectedProfile(value);
      return;
    }
  });
  const navigate = useNavigate();
  const group = getRootProps();
  return (
    <>
      {toggleProfileSwitchModal && (
        <Transition.Root show={toggleProfileSwitchModal} as={Fragment}>
          <Dialog as="div" className="relative z-[800] " onClose={() => null}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white mt-10 text-left shadow-xl transition-all sm:w-full sm:max-w-5xl w-md">
                    <div>
                      <div className="flex justify-between align-middle border-b pb-2 px-2">
                        <div className="flex items-center space-x-2 p-3 pb-2"></div>
                        <button
                          onClick={handleClose}
                          className="inline-flex h-6 space-x-1 items-center rounded-full bg-gray-100 px-2 py-1 mt-4 mb-2 mr-4 text-xs font-medium text-secondaryGray hover:bg-orange-200 hover:text-orange-600"
                        >
                          <span>Close</span>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <Box pl={'25px'} pr={8} py={6}>
                        <Box>
                          <Text fontSize={24} fontWeight={600} color="text.200">
                            Select Account
                          </Text>
                          <Text fontSize={14} fontWeight={500} color="text.400">
                            You can create up to two accounts on Shepherd, this
                            lets you tutor and be a student.
                          </Text>
                        </Box>
                        <Center>
                          <HStack {...group} spacing={'100px'} my={'65px'}>
                            {user &&
                              user?.type.map((value) => {
                                const radio = getRadioProps({ value });
                                return (
                                  <RadioCard key={value} {...radio}>
                                    <Flex gap={3} p={4} alignItems="center">
                                      <Avatar
                                        boxSize="64px"
                                        color="white"
                                        name={value}
                                        bg="#4CAF50;"
                                      />
                                      <Text
                                        fontSize="16px"
                                        fontWeight={500}
                                        color="text.200"
                                        textTransform={'capitalize'}
                                        display={{
                                          base: 'block',
                                          sm: 'none',
                                          md: 'block'
                                        }}
                                      >
                                        {value}
                                      </Text>
                                      {/* <Stack spacing={'2px'}>
                                      <Flex>
                                        <Text
                                          fontSize="16px"
                                          fontWeight={500}
                                          color="text.200"
                                          display={{
                                            base: 'block',
                                            sm: 'none',
                                            md: 'block'
                                          }}
                                        >
                                          Leslie Peters
                                        </Text>{' '}
                                        <Box
                                          bgColor={
                                            value === 'Tutor'
                                              ? '#FFF2EB'
                                              : '#EBF4FE'
                                          }
                                          color={
                                            value === 'Tutor'
                                              ? '#FB8441'
                                              : '#207DF7'
                                          }
                                          p="2px 8px"
                                          maxWidth="fit-content"
                                          borderRadius="4px"
                                          alignSelf="center"
                                        >
                                          <Text fontSize={10} fontWeight={500}>
                                            {value}
                                          </Text>
                                        </Box>
                                      </Flex>

                                      <Text fontSize={14} color="text.400">
                                        lesliepeters@gmial.com
                                      </Text>
                                    </Stack> */}
                                    </Flex>
                                  </RadioCard>
                                );
                              })}
                          </HStack>
                        </Center>{' '}
                        <Box ml={6} textAlign="center">
                          <Button
                            onClick={() =>
                              navigate(
                                selectedProfile === 'student'
                                  ? '/dashboard'
                                  : '/dashboard/tutordashboard'
                              )
                            }
                            isDisabled={
                              selectedProfile === '' ||
                              (window.location.pathname.includes(
                                '/dashboard/tutordashboard'
                              ) &&
                                selectedProfile === 'tutor') ||
                              (!window.location.pathname.includes(
                                '/dashboard/tutordashboard'
                              ) &&
                                selectedProfile === 'student')
                            }
                          >
                            Switch
                          </Button>
                        </Box>
                      </Box>

                      {/* <div className="overflow-hidden sm:w-[80%] w-full mx-auto p-6 pt-3  bg-white sm:grid sm:grid-cols-3 justify-items-center sm:gap-x-4 sm:space-y-0 space-y-2">
                        {actions2.map((action) => (
                          <div
                            onClick={() => {
                              if (action.showModal) handleShowSelected();
                            }}
                            key={action.title}
                            className="group cursor-pointer relative transform  bg-white border-1 rounded-lg  border-gray-300 p-4 focus-within:border-blue-500 hover:border-blue-500"
                          >
                            <div>
                              <img src={action.imageURL} alt={action.title} />
                            </div>
                            <div className="mt-4">
                              <button className="text-base font-semibold leading-6 text-orange-400">
                                <span
                                  className="absolute inset-0"
                                  aria-hidden="true"
                                />
                                {action.title}
                              </button>
                              <Text className="mt-2 text-sm text-secondaryGray">
                                {action.description}
                              </Text>
                            </div>
                          </div>
                        ))}
                      </div> */}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </>
  );
};

export default ProfileSwitchModal;
