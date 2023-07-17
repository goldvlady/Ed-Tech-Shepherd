import { Layout, AllClientTab } from '../components';
import { ArrowRightIcon, SortIcon } from '../components/icons';
import { classNames } from '../helpers';
import clientStore from '../state/clientStore';
import { Text } from '@chakra-ui/react';
import { Menu, Transition, Tab } from '@headlessui/react';
import React, { useEffect, useState, Fragment } from 'react';

const clients = [];
// const clients = [{}];

const Clients = () => {
  const { isLoading, fetchClients } = clientStore();

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <Layout
      className={`${
        clients.length > 0 ? 'bg-white' : 'bg-gray-100'
      } p-3 h-screen`}
    >
      <header className="flex justify-between">
        <Text className="flex items-center space-x-2">
          <span className="font-semibold text-2xl">Clients</span>
          {clients.length > 0 && <span className="inline-block text-sm bg-gray-100 px-2 py-1 rounded-md text-primaryGray">
            24
          </span>}
        </Text>
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="flex items-center space-x-2 border p-2 rounded-md">
              <SortIcon className="w-5 h-5" />
              <span>Sort by</span>
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
            <Menu.Items className="absolute space-y-3 p-4 right-0 z-50 mt-2.5 w-[12rem] origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none">
              <section>
                <div className="w-full">
                  <Text className="text-sm text-secondaryGray mb-2">
                    By date
                  </Text>
                  <button className="w-full flex bg-gray-100 rounded-md  items-center justify-between p-2">
                    <Text className="text-sm text-dark">Start date</Text>
                  </button>
                  <button className="w-full flex mt-2 hover:bg-gray-100 rounded-md items-center justify-between p-2">
                    <Text className="text-sm text-dark">End date</Text>
                  </button>
                </div>

                <div className="w-full">
                  <Text className="text-sm text-secondaryGray mt-4 mb-2">
                    By name
                  </Text>
                  <button className="w-full flex hover:bg-gray-100 rounded-md  items-center justify-between p-2">
                    <Text className="text-xs flex space-x-2 items-center text-dark">
                      <span>A</span>
                      <ArrowRightIcon className="w-5" onClick={undefined} />
                      <span>Z</span>
                    </Text>
                  </button>
                  <button className="w-full flex hover:bg-gray-100 rounded-md  items-center justify-between p-2">
                    <Text className="text-xs flex space-x-2 items-center text-dark">
                      <span>Z</span>
                      <ArrowRightIcon className="w-5" onClick={undefined} />
                      <span>A</span>
                    </Text>
                  </button>
                </div>
              </section>
            </Menu.Items>
          </Transition>
        </Menu>
      </header>
      {clients.length > 0 ? (
        <Tab.Group as="div" className="mt-4">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option>All clients</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Ended</option>
            </select>
          </div>
          <div className="hidden mb-4 sm:block">
            <div className="border-b border-gray-200">
              <Tab.List className="-mb-px flex space-x-8" aria-label="Tabs">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <span
                      className={classNames(
                        selected
                          ? 'border-primaryBlue text-primaryBlue'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'group cursor-pointer border-b-4 py-4 px-1 text-sm font-medium'
                      )}
                    >
                      All clients
                    </span>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <span
                      className={classNames(
                        selected
                          ? 'border-primaryBlue text-primaryBlue'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'group cursor-pointer border-b-4 py-4 px-1 text-sm font-medium'
                      )}
                    >
                      Active
                    </span>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <span
                      className={classNames(
                        selected
                          ? 'border-primaryBlue text-primaryBlue'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'group cursor-pointer border-b-4 py-4 px-1 text-sm font-medium'
                      )}
                    >
                      Pending
                    </span>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <span
                      className={classNames(
                        selected
                          ? 'border-primaryBlue text-primaryBlue'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'group cursor-pointer border-b-4 py-4 px-1 text-sm font-medium'
                      )}
                    >
                      Ended
                    </span>
                  )}
                </Tab>
              </Tab.List>
            </div>
          </div>

          <Tab.Panels>
            <Tab.Panel>
              <AllClientTab />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      ) : (
        <section className="flex justify-center items-center w-full h-full">
          <img src="/images/client.png" alt="" />
          {/* <p>You don't have any client yet</p> */}
        </section>
      )}
    </Layout>
  );
};

export default Clients;
