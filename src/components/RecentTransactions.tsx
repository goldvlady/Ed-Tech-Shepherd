import { classNames } from '../helpers';
import { Date } from './index';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  CircleStackIcon
} from '@heroicons/react/20/solid';
import React, { Fragment } from 'react';
import { Text } from '@chakra-ui/react';

interface Transaction {
  id: number;
  content: string;
  target: string;
  href: string;
  date: string;
  icon: React.ComponentType<any>;
}

interface Event {
  id: number;
  name: string;
  lastSeen: string;
  time: string;
  color: string;
  backgroundColor: string;
  commenters: Commenter[];
}

interface Commenter {
  id: number;
  name: string;
  imageUrl: string;
  backgroundColor?: string;
}

const transactions: Transaction[] = [
  {
    id: 1,
    content:
      ' Your received a payment of $10.95 from Leslie Peters for Chemistry Lessons',
    target: 'Front End Developer',
    href: '#',
    date: '17 May 2023 . 13:00',
    icon: CircleStackIcon
  },
  {
    id: 2,
    content:
      ' Your received a payment of $10.95 from Leslie Peters for Chemistry Lessons',
    target: 'Front End Developer',
    href: '#',
    date: '17 May 2023 . 13:00',
    icon: CircleStackIcon
  },
  {
    id: 3,
    content:
      ' Your received a payment of $10.95 from Leslie Peters for Chemistry Lessons',
    target: 'Front End Developer',
    href: '#',
    date: '17 May 2023 . 13:00',
    icon: CircleStackIcon
  },
  {
    id: 4,
    content:
      ' Your received a payment of $10.95 from Leslie Peters for Chemistry Lessons',
    target: 'Front End Developer',
    href: '#',
    date: '17 May 2023 . 13:00',
    icon: CircleStackIcon
  }
];

const events: Event[] = [
  {
    id: 1,
    name: 'Upcoming chemistry session with Liam Kelly',
    lastSeen: '03:30 pm',
    time: '04:30 pm',
    color: 'bg-orange-500',
    backgroundColor: 'bg-orange-50',
    commenters: [
      {
        id: 12,
        name: 'Emma Dorsey',
        imageUrl:
          'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 6,
        name: 'Tom Cook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 4,
        name: 'Lindsay Walton',
        imageUrl: '/svgs/feather.svg',
        backgroundColor: 'bg-blue-500'
      }
    ]
  },
  {
    id: 2,
    name: 'Upcoming chemistry session with Liam Kelly',
    lastSeen: '03:30 pm',
    time: '04:30 pm',
    color: 'bg-blue-500',
    backgroundColor: 'bg-blue-50',
    commenters: [
      {
        id: 12,
        name: 'Emma Dorsey',
        imageUrl:
          'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 6,
        name: 'Tom Cook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ]
  }
];

function EventItem({ event }: { event: Event }) {
  return (
    <li className={`flex gap-x-3 ${event.backgroundColor}`}>
      <div
        className={`min-h-fit w-1 rounded-tr-full rounded-br-full ${event.color}`}
      />
      <div className="py-2">
        <div className="flex gap-x-1">
          <div className="min-w-0 flex-auto">
            <Text className="text-xs font-normal leading-6 text-gray-500">
              {event.name}
            </Text>
            <Text className="mt-1 flex items-center truncate text-xs leading-5 text-gray-500">
              <span>{event.lastSeen}</span>
              <ChevronRightIcon className="w-4 h-4" />
              <span>{event.time}</span>
            </Text>
          </div>
        </div>
        <div className="flex -space-x-0.5">
          <dt className="sr-only">Commenters</dt>
          {event.commenters.map((commenter) => (
            <dd key={commenter.id}>
              <img
                className={`h-5 w-5 rounded-full ${
                  commenter.backgroundColor
                    ? commenter.backgroundColor
                    : 'bg-gray-50'
                } ring-2 ring-white`}
                src={commenter.imageUrl}
                alt={commenter.name}
              />
            </dd>
          ))}
        </div>
      </div>
    </li>
  );
}

export default function RecentTransaction() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {/* Invoice summary */}
        <div className="lg:col-start-3 lg:col-span-2 lg:row-end-1 p-2 rounded-lg shadow-sm ring-1 ring-gray-900/5">
          <Text className="sr-only">Summary</Text>
          <header className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-2">
              <img src="/svgs/timer.svg" alt="" className="h-6 w-6 mx-auto" />
              <h4 className="font-semibold">Schedule</h4>
            </div>

            <div className="flex items-center justify-center bg-white p-2 rounded-full border">
              <img
                src="/svgs/calender-drop.svg"
                alt=""
                className="h-5 w-5 mx-auto"
              />
            </div>
          </header>

          <section className="space-y-3">
            <Text className="text-gray-400 text-sm mt-4 ml-8">May</Text>
            <Date />
          </section>

          <ul className="space-y-3">
            <Text className="text-gray-400 text-sm mt-4 ml-8">Upcoming Events</Text>
            <ul className="space-y-3">
              {events.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </ul>
          </ul>

          <section className="space-y-3">
            <Text className="text-gray-400 text-sm mt-4 ml-8">Tommorrow</Text>
            <div className="space-y-3">
              <img
                src="/svgs/calender.svg"
                alt=""
                className="h-10 w-10 mx-auto"
              />
              <Text className="text-center font-bold text-sm text-gray-300">
                No classes scheduled for tommorrow
              </Text>
            </div>
          </section>
        </div>

        {/* Invoice */}
        <div className="-mx-4 p-2 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg lg:col-span-2 lg:row-span-2 lg:row-end-2">
          <header className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-3">
              <img className="h-5 w-5" src="/svgs/wallet-money.svg" alt="" />
              <Text>Recent events</Text>
            </div>

            <div className="hidden md:ml-4 md:flex md:items-center">
              <Menu as="div" className="relative">
                <Menu.Button
                  type="button"
                  className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <img
                    className="h-5 w-5 -mr-1"
                    src="/svgs/calender-fill.svg"
                    alt=""
                  />
                  <span>This week</span>
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="https://google.com"
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            This week
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="https://google.com"
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Last week
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="https://google.com"
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            This month
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <Menu as="div" className="relative ml-6 md:hidden">
              <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open menu</span>
                <EllipsisHorizontalIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="https://google.com"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          This week
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="https://google.com"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Last week
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="https://google.com"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          This month
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </header>

          <div className="flow-root mt-4">
            <ul className="-mb-8">
              {transactions.map((transaction, transactionIdx) => (
                <li key={transaction.id}>
                  <div className="relative pb-8">
                    {transactionIdx !== transactions.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200/70"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center ring-8 ring-white">
                          <img
                            className="h-5 w-5"
                            src="/svgs/circlestack.svg"
                            alt=""
                          />
                        </span>
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <Text className="text-sm font-normal text-gray-400">
                          {transaction.date}
                        </Text>
                        <Text className="mt-1 text-sm font-medium text-gray-500">
                          {transaction.content}
                        </Text>
                        <div className="mt-3 flex space-x-7">
                          <button
                            type="button"
                            className="rounded-full flex items-center space-x-2 border-2 border-dashed p-2 text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                            <img
                              className="h-5 w-5"
                              src="/svgs/receipt.svg"
                              alt=""
                            />
                            <span>Transaction receipt</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
