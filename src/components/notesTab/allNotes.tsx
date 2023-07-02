import CustomModal from "../CustomComponents/CustomModal";
import {
  DownloadIcon,
  FlashCardsIcon,
  FlashCardsSolidIcon,
  TrashIcon,
} from "../icons";
import { DeleteNoteModal } from "../index";
import SelectableTable, { TableColumn } from "../table";
import { StyledMenuButton, StyledMenuSection } from "./styles";
import { Menu, MenuList, MenuButton, Button, Text } from "@chakra-ui/react";
import {
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import React, { useLayoutEffect, useRef, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
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
  {
    id: 6,
    title: "Science Notes by Akeem",
    date_created: "May 09 2023, 13:00",
    last_modified: "May 21 2023, 09:00",
    tags: "#Science",
  },
  {
    id: 7,
    title: "English Notes by Daniel",
    date_created: "May 09 2023, 13:00",
    last_modified: "May 21 2023, 09:00",
    tags: "#English",
  },
  {
    id: 8,
    title: "Mathematics Notes by Ellen",
    date_created: "May 09 2023, 13:00",
    last_modified: "May 21 2023, 09:00",
    tags: "#Mathematics",
  },
];

type DataSourceItem = {
  key: number;
  title: string;
  dateCreated: string;
  lastModified: string;
  tags: string;
  id: number;
};

const dataSource: DataSourceItem[] = Array.from({ length: 8 }, (_, i) => ({
  key: i,
  id: clients[i]?.id,
  title: clients[i]?.title,
  tags: clients[i]?.tags,
  dateCreated: new Date().toISOString().split("T")[0], // current date in yyyy-mm-dd format
  lastModified: new Date().toISOString().split("T")[0], // current date in yyyy-mm-dd format
}));

const AllNotesTab = () => {
  const [deleteNoteModal, setDeleteNoteModal] = useState(false);
  const [, setDeleteAllNotesModal] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [clientsDetails, setClientDetails] = useState("");
  const [openTags, setOpenTags] = useState<boolean>(false);
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

  const onDeleteNote = (isOpenDeleteModal: boolean, noteDetails: string) => {
    setDeleteNoteModal(isOpenDeleteModal);
    setClientDetails(noteDetails);
  };

  const clientColumn: TableColumn<DataSourceItem>[] = [
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
      align: "left",
      render: ({ title }) => (
        <>
          <img
            src="/svgs/text-document.svg"
            className="text-gray-400 absolute"
            alt=""
          />
          <Text fontWeight="500">{title}</Text>
        </>
      ),
    },
    {
      key: "dateCreated",
      title: "Date Created",
      dataIndex: "dateCreated",
      align: "left",
      id: 1,
    },
    {
      key: "tags",
      title: "Tags",
      dataIndex: "tags",
      align: "left",
      id: 2,
    },
    {
      key: "lastModified",
      title: "Last Modified",
      dataIndex: "lastModified",
      align: "left",
      id: 3,
    },
    {
      key: "actions",
      title: "",
      render: ({ title, id }) => (
        <Menu>
          <MenuButton
            as={Button}
            variant="unstyled"
            borderRadius="full"
            p={0}
            minW="auto"
            height="auto"
          >
            <FaEllipsisH fontSize={"12px"} />
          </MenuButton>
          <MenuList
            fontSize="14px"
            minWidth={"185px"}
            borderRadius="8px"
            backgroundColor="#FFFFFF"
            boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
          >
            <section className="space-y-2 border-b pb-2">
              <button
                onClick={() => navigate(`/clients/${id}`)}
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
            <div
              onClick={() => onDeleteNote(true, title)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "15px",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.08317 2.50033V0.750326C3.08317 0.428162 3.34434 0.166992 3.6665 0.166992H8.33317C8.65535 0.166992 8.9165 0.428162 8.9165 0.750326V2.50033H11.8332V3.66699H10.6665V11.2503C10.6665 11.5725 10.4053 11.8337 10.0832 11.8337H1.9165C1.59434 11.8337 1.33317 11.5725 1.33317 11.2503V3.66699H0.166504V2.50033H3.08317ZM4.24984 1.33366V2.50033H7.74984V1.33366H4.24984Z"
                  fill="#F53535"
                />
              </svg>
              <Text fontSize="14px" lineHeight="20px" fontWeight="400">
                Delete
              </Text>
            </div>
          </MenuList>
        </Menu>
      ),
    },
  ];

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
                      <Menu>
                        <StyledMenuButton
                          as={Button}
                          variant="unstyled"
                          borderRadius="full"
                          p={0}
                          minW="auto"
                          height="auto"
                          background="#F4F5F5"
                          display="flex"
                          className="flex items-center gap-2"
                          onClick={() => setOpenTags((prevState) => !prevState)}
                        >
                          <FlashCardsSolidIcon
                            className="w-5"
                            onClick={undefined}
                          />
                          Add tag
                        </StyledMenuButton>
                      </Menu>

                      {openTags && (
                        <Menu>
                          <StyledMenuSection>
                            <form
                              className="relative flex flex-1 py-2"
                              action="#"
                              method="GET"
                            >
                              <label htmlFor="search-field" className="sr-only">
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
                          </StyledMenuSection>
                        </Menu>
                      )}

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
              <SelectableTable
                columns={clientColumn}
                dataSource={dataSource}
                isSelectable
                fileImage
                onSelect={(e) => setSelectedPeople(e)}
              />
            </div>
          </div>
        </div>
      </div>

      <CustomModal
        modalTitle=""
        onClose={() => setDeleteNoteModal(false)}
        isOpen={deleteNoteModal}
        modalSize="md"
        style={{ height: "327px", width: "100%" }}
      >
        <DeleteNoteModal
          title={clientsDetails}
          deleteNoteModal={deleteNoteModal}
          setDeleteNoteModal={setDeleteNoteModal}
        />
      </CustomModal>
    </>
  );
};

export default AllNotesTab;
