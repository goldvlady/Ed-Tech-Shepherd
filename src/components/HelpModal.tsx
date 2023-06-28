import { StarIcon } from "./icons";
import { SelectedNoteModal } from "./index";
import { Text } from "@chakra-ui/react";
import { Transition, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useState } from "react";
import Typewriter from "typewriter-effect";

const actions1 = [
  {
    id: 0,
    title: "Ace Homework",
    description:
      "Stuck with your homework, Shepherd can guide you through it step by step for quick & easy completion",
    imageURL: "/images/homework.png",
  },
  {
    id: 1,
    title: "Test Prep",
    description:
      "Got a test, Shepherd has got you covered with quizes & prep resources priming you for the big day",
    imageURL: "/images/test.png",
  },
  {
    id: 2,
    title: "Flashcards Factory",
    description:
      "Need a memory boost? Generate custom flashcards & mnemonics with Shepherd, making memorization a breeze",
    imageURL: "/images/flashcards.png",
  },
  {
    id: 3,
    title: "Deep Dives",
    description:
      "Struggling with a tricky topic? Let Shepherd simplify it for you with in-depth analysis & detailed explanations",
    imageURL: "/images/bulb.png",
  },
];

const actions2 = [
  {
    id: 0,
    title: "Notes Navigator",
    showModal: true,
    description:
      "Want to make the most of your notes? Chat with them via Shepherd and uncover insights to boost your grasp ",
    imageURL: "/images/notes-navigator.png",
  },
  {
    id: 1,
    title: "Study Roadmap",
    showModal: false,
    description:
      "Just starting school? Let Shepherd create a tailored study plan guiding you to academic success",
    imageURL: "/images/roadmap.png",
  },
  {
    id: 2,
    title: "Research Assistant",
    showModal: false,
    description:
      "Delving into a research project? Let Shepherd find you the best resources & references for your work",
    imageURL: "/images/flashcards.png",
  },
];

interface ToggleProps {
  setToggleHelpModal: (state: boolean) => void;
  toggleHelpModal: boolean;
}

const HelpModal = ({ setToggleHelpModal, toggleHelpModal }: ToggleProps) => {
  const [showSelected, setShowSelected] = useState(false);

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
          <Dialog as="div" className="relative z-1" onClose={() => {}}>
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pt-5 mt-10 text-left shadow-xl transition-all sm:w-full sm:max-w-5xl">
                    <div>
                      <div className="flex justify-between border-b pb-2 px-2">
                        <div className="flex items-center space-x-2">
                          <StarIcon
                            className="text-primaryBlue h-5 w-5"
                            onClick={undefined}
                          />
                          <div className="text-sm font-semibold">
                            <Typewriter
                              onInit={(typewriter) => {
                                typewriter
                                  .typeString(
                                    "Hi Liam, How can Shepherd make your study time more effective today?"
                                  )
                                  .start();
                              }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleClose}
                          className="inline-flex flex-shrink-0 space-x-1 items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-secondaryGray"
                        >
                          <span>Close</span>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="overflow-hidden p-4 bg-white sm:grid sm:grid-cols-4 sm:gap-x-4 sm:space-y-0 space-y-2 ">
                        {actions1.map((action) => (
                          <div
                            key={action.title}
                            className="group cursor-pointer transform hover:drop-shadow-md relative bg-gray-100 p-3 focus-within:ring-2 rounded-lg focus-within:ring-inset focus-within:ring-gray-500"
                          >
                            <div>
                              <img src={action.imageURL} alt={action.title} />
                            </div>
                            <div className="mt-4">
                              <Text className="text-base font-semibold leading-6 text-dark">
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

                      <div className="overflow-hidden sm:w-[80%] w-full mx-auto p-4  bg-white sm:grid sm:grid-cols-3 justify-items-center sm:gap-x-4 sm:space-y-0 space-y-2">
                        {actions2.map((action) => (
                          <div
                            onClick={() => {
                              if (action.showModal) handleShowSelected();
                            }}
                            key={action.title}
                            className="group cursor-pointer relative transform hover:drop-shadow-md  bg-gray-100 p-4 focus-within:ring-2 rounded-lg focus-within:ring-inset focus-within:ring-gray-500"
                          >
                            <div>
                              <img src={action.imageURL} alt={action.title} />
                            </div>
                            <div className="mt-4">
                              <button className="text-base font-semibold leading-6 text-dark">
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
        <SelectedNoteModal show={showSelected} setShow={setShowSelected} />
      )}
    </>
  );
};

export default HelpModal;
