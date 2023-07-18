import userStore from '../state/userStore';
import { StarIcon } from './icons';
import { SelectedNoteModal } from './index';
import { Text } from '@chakra-ui/react';
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { getAuth } from 'firebase/auth';
import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

const actions1 = [
  {
    id: 0,
    title: 'Test Prep',
    description:
      'Got a test coming? Shepherd has you covered with quizzes & prep resources priming you for the big day',
    imageURL: '/images/test.svg'
  },
  {
    id: 1,
    title: 'Deep Dives',
    description:
      'Struggling with a tricky topic? Let Shepherd simplify it for you with in-depth analysis & detailed explanations',
    imageURL: '/images/bulb.svg'
  },
  {
    id: 2,
    title: 'Notes Navigator',
    showModal: true,
    description:
      'Want to make the most of your notes? Chat with them via Shepherd and uncover insights to boost your grasp ',
    imageURL: '/images/notes-navigator.svg'
  },
  {
    id: 3,
    title: 'Research Assistant',
    showModal: false,
    description:
      'Delving into a research project? Let Shepherd find you the best resources & references for your work',
    imageURL: '/images/research-assistant.svg'
  }
];

const actions2 = [
  {
    id: 0,
    title: 'Ace Homework',
    description:
      'Stuck with your homework, Shepherd can guide you through it step by step for quick & easy completion',
    imageURL: '/images/ace-homework.svg'
  },
  {
    id: 1,
    title: 'Flashcards Factory',
    description:
      'Need a memory boost? Generate custom flashcards & mnemonics with Shepherd, making memorization a breeze',
    imageURL: '/images/flashcards.svg',
    path: '/dashboard/flashcards/create'
  },
  {
    id: 2,
    title: 'Study Roadmap',
    showModal: false,
    description:
      'Just starting school? Let Shepherd create a tailored study plan guiding you to academic success',
    imageURL: '/images/roadmap.svg'
  }
];

interface ToggleProps {
  setToggleHelpModal: (state: boolean) => void;
  toggleHelpModal: boolean;
}

const HelpModal = ({ setToggleHelpModal, toggleHelpModal }: ToggleProps) => {
  const [showSelected, setShowSelected] = useState(false);
  const { user }: any = userStore();
  const navigate = useNavigate();

  const handleClose = () => {
    setToggleHelpModal(false);
  };

  const handleShowSelected = () => {
    setShowSelected(true);
  };

  return (
    <>
      {toggleHelpModal && (
        <Transition.Root show={toggleHelpModal} as={Fragment}>
          <Dialog as="div" className="relative z-[800]" onClose={() => null}>
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white mt-10 text-left shadow-xl transition-all sm:w-full sm:max-w-5xl">
                    <div>
                      <div className="flex justify-between align-middle border-b pb-2 px-2">
                        <div className="flex items-center space-x-2 p-3 pb-2">
                          <StarIcon
                            className="text-primaryBlue h-4 w-4"
                            onClick={undefined}
                          />
                          <Typewriter
                            options={{
                              delay: 10,
                              autoStart: true,
                              loop: false,
                              skipAddStyles: true,
                              wrapperClassName: 'text-base font-semibold'
                            }}
                            onInit={(typewriter) => {
                              typewriter
                                .typeString(
                                  `Hi ${
                                    user.name.first || 'there'
                                  }, How can Shepherd make your study time more effective today?`
                                )
                                .start();
                            }}
                          />
                        </div>
                        <button
                          onClick={handleClose}
                          className="inline-flex h-6 space-x-1 items-center rounded-full bg-gray-100 px-2 py-1 mt-4 mb-2 mr-4 text-xs font-medium text-secondaryGray hover:bg-orange-200 hover:text-orange-600"
                        >
                          <span>Close</span>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="overflow-hidden p-6 pb-2 bg-white sm:grid sm:grid-cols-4 sm:gap-x-4 sm:space-y-0 space-y-2">
                        {actions1.map((action) => (
                          <div
                            key={action.title}
                            onClick={() => {
                              if (action.showModal) handleShowSelected();
                            }}
                            className="group cursor-pointer relative transform  bg-white border-1 rounded-lg  border-gray-300 p-4 hover:border-blue-500  focus:border-blue-500"
                          >
                            <div>
                              <img src={action.imageURL} alt={action.title} />
                            </div>
                            <div className="mt-4">
                              <Text className="text-base font-semibold leading-6 text-orange-400">
                                <span
                                  className="absolute inset-0"
                                  aria-hidden="true"
                                />
                                {action.title}
                              </Text>
                              <p className="mt-2 text-sm text-secondaryGray">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="overflow-hidden sm:w-[80%] w-full mx-auto p-6 pt-3  bg-white sm:grid sm:grid-cols-3 justify-items-center sm:gap-x-4 sm:space-y-0 space-y-2">
                        {actions2.map((action) => (
                          <div
                            onClick={() => {
                              if (action.showModal) handleShowSelected();
                              if (action.path) {
                                handleClose();
                                navigate('/dashboard/flashcards/create');
                              }
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
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
      {showSelected && (
        <SelectedNoteModal
          show={showSelected}
          setShow={setShowSelected}
          setShowHelp={setToggleHelpModal}
        />
      )}
    </>
  );
};

export default HelpModal;
