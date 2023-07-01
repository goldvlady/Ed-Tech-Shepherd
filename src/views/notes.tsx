import { Layout, AllNotesTab } from "../components";
import CustomTabs from "../components/CustomTabs";
import DropdownMenu from "../components/DropdownMenu";
import { SortIcon, FilterByTagsIcon } from "../components/icons";
import { classNames } from "../helpers";
import { Tab } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useState } from "react";

const notes = [{}];

const filteredBy = [
  {
    id: 1,
    value: "#Chemistry",
    checked: false,
  },
  {
    id: 2,
    value: "#Physics",
    checked: false,
  },
  {
    id: 3,
    value: "#Biology",
    checked: false,
  },
  {
    id: 4,
    value: "#English",
    checked: false,
  },
];

const sortedBy = [
  {
    id: 1,
    title: "By date",
    firstValue: "Recently created",
    secondValue: "Recently modified",
  },
  {
    id: 2,
    title: "By title",
    firstValue: "A -> Z",
    secondValue: "Z -> A",
  },
];

const tabLists = [
  {
    id: 1,
    title: "All",
  },
  {
    id: 2,
    title: "Documents",
  },
  {
    id: 3,
    title: "Notes",
  },
];

const tabPanel = [
  {
    id: 1,
    component: <AllNotesTab />,
  },
];
export default function Notes() {
  const [checkedState, setCheckedState] = useState(
    new Array(filteredBy.length).fill(false)
  );

  const handleCheckboxChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  };

  return (
    <Layout
      className={`${
        notes.length > 0 ? "bg-white" : "bg-gray-100"
      } p-3 h-screen`}
    >
      {notes.length > 0 ? (
        <>
          <header className="flex mt-4 justify-between">
            <h4 className="flex items-center space-x-2">
              <span className="font-bold text-2xl">My Notes</span>
              <span className="inline-block text-sm bg-gray-100 px-2 py-1 rounded-md text-primaryGray">
                24
              </span>
            </h4>
            <div className="flex space-x-4">
              <DropdownMenu
                sortedBy={sortedBy}
                menuTitle="Sort by"
                DropdownMenuIcon={
                  <SortIcon className="w-5 h-5" onClick={() => {}} />
                }
              >
                <>
                  {
                    sortedBy?.map((sorted) => (
                      <section key={sorted.id}>
                        <div>
                          <p className="text-[#969CA6] text-xs pl-[6px]">
                            {sorted.title}
                          </p>
                          <div>
                            <p className="text-sm hover:bg-[#F2F4F7] p-[6px]  rounded-lg cursor-pointer">
                              {sorted.firstValue}
                            </p>
                            <p className="text-sm hover:bg-[#F2F4F7] p-[6px]  rounded-lg cursor-pointer">
                              {sorted.secondValue}
                            </p>
                          </div>
                        </div>
                      </section>
                    ))[0]
                  }
                  {
                    sortedBy?.map((sorted) => (
                      <section key={sorted.id}>
                        <div>
                          <p className="text-[#969CA6] text-xs pl-[6px]">
                            {sorted.title}
                          </p>
                          <div>
                            <p className="text-sm hover:bg-[#F2F4F7] p-[6px]  rounded-lg cursor-pointer">
                              {sorted.firstValue}
                            </p>
                            <p className="text-sm hover:bg-[#F2F4F7] p-[6px]  rounded-lg cursor-pointer">
                              {sorted.secondValue}
                            </p>
                          </div>
                        </div>
                      </section>
                    ))[1]
                  }
                </>
              </DropdownMenu>
              <DropdownMenu
                sortedBy={sortedBy}
                menuTitle="Filtered By"
                DropdownMenuIcon={
                  <FilterByTagsIcon className="w-5 h-5" onClick={() => {}} />
                }
              >
                <section>
                  <input
                    type="search"
                    placeholder="Search tags"
                    className="w-full h-[35px] mb-3 rounded-lg p-2 border border-[#E2E4E9] text-sm focus:border-none focus:outline-none"
                  />
                  <div>
                    {filteredBy?.map((filtered, index) => (
                      <div
                        className="flex gap-2 text-center items-center mb-3"
                        key={filtered.id}
                      >
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(index)}
                          checked={checkedState[index]}
                          className="h-4 w-4 rounded border-gray-300 cursor-pointer text-primaryBlue ring-0 border"
                        />
                        <p className="text-sm">{filtered.value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </DropdownMenu>
            </div>
          </header>
          <CustomTabs tablists={tabLists} tabPanel={tabPanel} />
        </>
      ) : (
        <>
          <header className="flex mt-4 justify-between">
            <h4 className="flex items-center space-x-2">
              <span className="font-bold text-2xl">My Notes</span>
            </h4>
          </header>
          <section className="flex justify-center items-center mt-28 w-full">
            <div className="text-center">
              <img src="/images/notes.png" alt="" />
              <p>You don't have any notes yet!</p>
              <button
                type="button"
                className="inline-flex items-center justify-center mt-4 gap-x-2 w-[286px] rounded-md bg-secondaryBlue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Create new
              </button>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}
