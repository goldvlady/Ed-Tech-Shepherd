import CustomModal from "../CustomModal";
import {
  DownloadIcon,
  FlashCardsIcon,
  FlashCardsSolidIcon,
  TrashIcon,
} from "../icons";
import { DeleteNoteModal, DeleteAllNotesModal } from "../index";
import { Text } from "@chakra-ui/react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import React, { Fragment, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Client {
  id: number;
  title: string;
  date_created: string;
  tags: string;
  last_modified: string;
}

const clients: Client[] = [
  {
    id: 0,
    title: "Chemistry Notes by Alisson",
    date_created: "May 09 2023, 13:00",
    last_modified: "May 21 2023, 09:00",
    tags: "#Chemistry",
  },
  {
    id: 1,
    title: "Chemistry Notes by Alisson",
    date_created: "May 09 2023, 13:00",
    last_modified: "May 21 2023, 09:00",
    tags: "#Mathematics",
  },
  {
    id: 2,
    title: "Chemistry Notes by Alisson",
    date_created: "May 09 2023, 13:00",
    last_modified: "May 21 2023, 09:00",
    tags: "#Chemistry",
  },
  {
    id: 3,
    title: "Biology Notes by Alisson",
    date_created: "May 09 2023, 13:00",
    last_modified: "May 21 2023, 09:00",
    tags: "#Biology",
  },
  {
    id: 4,
    title: "Chemistry Notes by Alisson",
    date_created: "May 09 2023, 13:00",
    last_modified: "May 21 2023, 09:00",
    tags: "#Chemistry",
  },
  {
    id: 5,
    title: "Physics Notes by Alisson",
    date_created: "May 09 2023, 13:00",
    last_modified: "May 21 2023, 09:00",
    tags: "#Physics",
  },
];

const AllNotesTab = () => {
  const [deleteNoteModal, setDeleteNoteModal] = useState(false);
  const [deleteAllNotesModal, setDeleteAllNotesModal] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<Client[]>([]);
  const [clientsDetails, setClientDetails] = useState({
    title: "",
  });
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

  const onDeleteNote = (isOpenDeleteModal: boolean, noteDetails: any) => {
    setDeleteNoteModal(isOpenDeleteModal);
    setClientDetails(noteDetails);
  };
  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              <div className="table-columns  fixed bottom-[80px] right-[36%] left-[36%]">
                {selectedPeople.length > 0 && (
                  <div className="top-0 border px-4 py-8 text-sm rounded-md flex h-12 items-center justify-between space-x-3 w-[600px] bg-white sm:left-12">
                    <p className="text-gray-600">
                      {selectedPeople.length} items selected
                    </p>

                    <div className="flex items-center space-x-4">
                      <button className="text-gray-600" onClick={toggleAll}>
                        Select all
                      </button>

                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button
                            type="button"
                            className="inline-flex items-center space-x-2 rounded bg-[#F4F5F5] px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                          >
                            <FlashCardsSolidIcon
                              className="w-5"
                              onClick={undefined}
                            />
                            <span>Add tag</span>
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
                          <Menu.Items className="absolute space-y-3 p-2 right-0 -top-[14rem] z-10 mt-2.5 w-[15rem] origin-top-right rounded-lg bg-white py-2 shadow-sm ring-1 ring-gray-900/5 focus:outline-none">
                            <section className="space-y-2">
                              <form
                                className="relative flex flex-1 py-2"
                                action="#"
                                method="GET"
                              >
                                <label
                                  htmlFor="search-field"
                                  className="sr-only"
                                >
                                  Search
                                </label>
                                <MagnifyingGlassIcon
                                  className="pl-2 pointer-events-none absolute inset-y-0 left-0 h-full w-7 text-gray-400"
                                  aria-hidden="true"
                                />
                                <input
                                  id="search-field"
                                  className="block rounded-lg border-gray-400 w-full h-10 border py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                  placeholder="Search Clients..."
                                  type="search"
                                  name="search"
                                />
                              </form>
                              <div className="relative cursor-pointer bg-lightGray px-2 py-1 rounded-lg flex items-start">
                                <div className="flex h-6 items-center">
                                  <input
                                    id="comments"
                                    aria-describedby="comments-description"
                                    name="comments"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primaryBlue ring-0 border-0"
                                  />
                                </div>
                                <div className="ml-3 text-sm leading-6">
                                  <label
                                    htmlFor="comments"
                                    className="font-normal text-dark"
                                  >
                                    #Chemistry
                                  </label>
                                </div>
                              </div>

                              <div className="relative cursor-pointer hover:bg-lightGray px-2 py-1 rounded-lg flex items-start">
                                <div className="flex h-6 items-center">
                                  <input
                                    id="comments"
                                    aria-describedby="comments-description"
                                    name="comments"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primaryBlue ring-0 border-0"
                                  />
                                </div>
                                <div className="ml-3 text-sm leading-6">
                                  <label
                                    htmlFor="comments"
                                    className="font-normal text-dark"
                                  >
                                    #Person
                                  </label>
                                </div>
                              </div>

                              <div className="relative cursor-pointer hover:bg-lightGray px-2 py-1 rounded-lg flex items-start">
                                <div className="flex h-6 items-center">
                                  <input
                                    id="comments"
                                    aria-describedby="comments-description"
                                    name="comments"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primaryBlue ring-0 border-0"
                                  />
                                </div>
                                <div className="ml-3 text-sm leading-6">
                                  <label
                                    htmlFor="comments"
                                    className="font-normal text-dark"
                                  >
                                    #Favorites
                                  </label>
                                </div>
                              </div>
                            </section>
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      <button
                        onClick={() => setDeleteAllNotesModal(true)}
                        type="button"
                        className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      >
                        <TrashIcon className="w-5" onClick={undefined} />
                        <span>Delete</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg bg-white px-6 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
              <table className="min-w-full table-auto divide-y divide-gray-300">
                <thead>
                  <tr className="bg-gray-50 w-full">
                    <th scope="col" className="relative hidden sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>

                    <th scope="col" className="relative sm:w-12 sm:px-6"></th>

                    <th
                      scope="col-span"
                      className="py-3.5 text-left text-sm font-semibold text-secondaryGray"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-semibold text-secondaryGray"
                    >
                      Date Created
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-semibold text-secondaryGray"
                    >
                      Tags
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-semibold text-secondaryGray"
                    >
                      Last Modified
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-semibold text-secondaryGray"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      className={
                        selectedPeople.includes(client)
                          ? "bg-blue-50"
                          : undefined
                      }
                    >
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primaryBlue focus:ring-primaryBlue"
                          value={client.title}
                          checked={selectedPeople.includes(client)}
                          onChange={(e) =>
                            setSelectedPeople(
                              e.target.checked
                                ? [...selectedPeople, client]
                                : selectedPeople.filter((p) => p !== client)
                            )
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap flex items-center space-x-2 py-4 pr-3 text-sm font-medium text-gray-500">
                        <div className="flex-shrink-0 bg-gray-100 p-2 rounded-full">
                          <img
                            src="/svgs/text-document.svg"
                            className="h-6 w-6 text-gray-400"
                            alt=""
                          />
                        </div>
                        <span>{client.title}</span>
                      </td>
                      <td className="whitespace-nowrap py-4 text-sm text-gray-500">
                        {client.date_created}
                      </td>
                      <td
                        className={`whitespace-nowrap py-4 text-sm ${
                          client.tags.includes("#C")
                            ? "text-primaryBlue"
                            : client.tags.includes("#P")
                            ? "text-yellow-300"
                            : "text-red-400"
                        } `}
                      >
                        {client.tags}
                      </td>
                      <td className="whitespace-nowrap py-4 text-sm text-gray-500">
                        {client.last_modified}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 text-right text-sm font-medium sm:pr-3">
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
                                    <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                                      <FlashCardsIcon
                                        className="w-4 h-4 text-primaryGray"
                                        onClick={undefined}
                                      />
                                    </div>
                                    <Text className="text-sm text-secondaryGray font-medium">
                                      Flashcards
                                    </Text>
                                  </div>
                                  <ChevronRightIcon className="w-2.5 h-2.5" />
                                </button>
                                <button className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2">
                                  <div className="flex items-center space-x-1">
                                    <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                                      <FlashCardsSolidIcon
                                        className="w-4 h-4 text-primaryGray"
                                        onClick={undefined}
                                      />
                                    </div>
                                    <Text className="text-sm text-secondaryGray font-medium">
                                      Add tag
                                    </Text>
                                  </div>
                                  <ChevronRightIcon className="w-2.5 h-2.5" />
                                </button>
                                <button className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2">
                                  <div className="flex items-center space-x-1">
                                    <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                                      <DownloadIcon
                                        className="w-4 h-4 text-primaryGray"
                                        onClick={undefined}
                                      />
                                    </div>
                                    <Text className="text-sm text-secondaryGray font-medium">
                                      Download
                                    </Text>
                                  </div>
                                  <ChevronRightIcon className="w-2.5 h-2.5" />
                                </button>
                              </section>
                              <button
                                onClick={() => onDeleteNote(true, client)}
                                className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2"
                              >
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
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CustomModal
        classes="w-[400px] h-auto"
        openModalBox={deleteNoteModal}
        closeModal={() => setDeleteNoteModal(false)}
      >
        <DeleteNoteModal
          title={clientsDetails?.title}
          deleteNoteModal={deleteNoteModal}
          setDeleteNoteModal={setDeleteNoteModal}
        />
      </CustomModal>

      {/* Delete Note Modal
      <Transition.Root show={deleteNoteModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setDeleteNoteModal}>
          <DeleteNoteModal
            deleteNoteModal={deleteNoteModal}
            setDeleteNoteModal={setDeleteNoteModal}
          />
        </Dialog>
      </Transition.Root> */}

      {/* Delete All Notes Modal */}
      {/* <Transition.Root show={deleteAllNotesModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={setDeleteAllNotesModal}
        >
          <DeleteAllNotesModal
            deleteAllNotesModal={deleteAllNotesModal}
            setDeleteAllNotesModal={setDeleteAllNotesModal}
          />
        </Dialog>
      </Transition.Root> */}
    </>
  );
};

export default AllNotesTab;
