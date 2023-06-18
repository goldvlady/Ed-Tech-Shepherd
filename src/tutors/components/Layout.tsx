import React, { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { useLocation } from 'react-router-dom';

import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { 
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import { classNames } from '../helpers'

import { 
  DashboardIcon, 
  OffersIcon,
  MessagesIcon,
  UserGroupIcon,
  UserIcon,
  ChevronRightIcon,
  LogoutIcon
} from "./icons";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon, current: true },
  { name: 'Clients', href: '/clients', icon: UserGroupIcon, current: false },
  { name: 'Offers', href: '/offers', icon: OffersIcon, current: false },
  { name: 'Messages', href: '/messages', icon: MessagesIcon, current: false },
]

export default function Layout({children, className}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation();

  const pathname = location.pathname.split('/')[1];

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <img className="h-10 w-auto" src="/svgs/logo.svg" alt="Sherperd" />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? 'bg-slate-100 text-blue-400'
                                    : 'text-gray-400 hover:text-blue-400 hover:bg-slate-100',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400',
                                    'h-6 w-6 shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="border-t pt-4">
                        <a
                          href="/settings"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-slate-200 hover:text-blue-400"
                        >
                          <Cog6ToothIcon
                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-400"
                            aria-hidden="true"
                          />
                          Settings
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden relative bg-white lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img class="h-10 w-auto" src="/svgs/logo.svg" alt="Sherperd" />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-2">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-slate-100 text-blue-400'
                            : 'text-gray-400 hover:text-blue-400 hover:bg-slate-100',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={classNames(
                           `${ item.current ? `text-blue-500` : `text-gray-400 group-hover:text-blue-400 h-6 w-6 shrink-0`
                            
                          }`
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="border-t pt-4">
                <a
                  href="/settings"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-slate-200 hover:text-blue-400"
                >
                  <Cog6ToothIcon
                    className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-400"
                    aria-hidden="true"
                  />
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className={`flex ${pathname === 'clients' ? 'justify-between' : 'justify-end'} flex-1 gap-x-4 self-stretch lg:gap-x-6`}>
            {pathname  === 'clients' && (
              <form className="relative flex flex-1 py-2" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  className="pl-2 pointer-events-none absolute inset-y-0 left-0 h-full w-7 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block rounded-lg border-gray-400 h-10 w-[80%] border py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search Clients..."
                  type="search"
                  name="search"
                />
              </form>
            )}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Show if the pathname is client */}
              {pathname === 'clients' && (
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-md bg-secondaryBlue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Create new
              </button>
              )}
              
              {/* Notification dropdown */}
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button
                    type="button"
                    className="rounded-full relative border bg-white p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <div className='absolute right-2 w-2 h-2 rounded-full bg-red-600'></div>
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-5 w-5" aria-hidden="true" />
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
                  <Menu.Items className="absolute space-y-3 p-4 right-0 z-10 mt-2.5 w-[23rem] origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none">
                    <div className="flex items-center">
                      <div className="flex w-0 flex-1 justify-between">
                        <p className="w-0 space-x-2 flex-1 text-sm font-medium text-gray-900">
                          <span>Notifications</span>
                          <span className='inline-block bg-blue-100 text-blue-400 px-1 py-0.5 rounded-md'>23</span>
                        </p>
                        <button
                          type="button"
                          className="ml-3 flex-shrink-0 rounded-md bg-white text-sm font-medium text-blue-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Mark all as read
                        </button>
                      </div>  
                    </div>

                    <div className="flex items-center border-b pb-3">
                      
                      <div className="flex-shrink-0 bg-orange-100 p-2 rounded-full">
                        <img src="/svgs/video-camera.svg" className="h-6 w-6 text-gray-400" alt="" />
                      </div>

                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-normal text-gray-400">19 May, 2023</p>
                        <p className="mt-1 text-sm font-medium text-gray-500">
                          Your chemistry leeson session with Leslie Peters started
                        </p>
                      </div>

                      <div className="ml-4 flex flex-shrink-0">
                        <span className='inline-block h-2 w-2 bg-gray-200 rounded-full'/>
                      </div>

                    </div>

                    <div className="flex items-center border-b pb-3">
                      
                      <div className="flex-shrink-0 bg-gray-100 p-2 rounded-full">
                        <img src="/svgs/text-document.svg" className="h-6 w-6 text-gray-400" alt="" />
                      </div>

                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-normal text-gray-400">2 hrs ago</p>
                        <p className="mt-1 text-sm font-medium text-gray-500">
                          You received a new contract offer
                        </p>
                        <div className="mt-3 flex space-x-7">
                          <button
                            type="button"
                            className="rounded-full flex items-center space-x-2 border-2 border-dashed p-2 text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                            <img src="/svgs/text-document.svg" className="h-6 w-6 text-gray-400" alt="" />
                            <span>View Offer</span>
                          </button>
                        </div>
                      </div>

                      <div className="ml-4 flex flex-shrink-0">
                        <span className='inline-block h-2 w-2 bg-blue-400 rounded-full'/>
                      </div>

                    </div>

                    <div className="flex items-center border-b pb-3">
                      
                      <div className="flex-shrink-0 bg-gray-100 p-2 rounded-full">
                          <img src="/svgs/text-document.svg" className="h-6 w-6 text-gray-400" alt="" />
                      </div>

                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-normal text-gray-400">2 hrs ago</p>
                        <p className="mt-1 text-sm font-medium text-gray-500">
                          William Kelly <span className='text-red-400 font-semibold'>withdrew</span> her offer
                        </p>
                      </div>

                      <div className="ml-4 flex flex-shrink-0">
                        <span className='inline-block h-2 w-2 bg-blue-400 rounded-full'/>
                      </div>

                    </div>

                    <div className="flex items-center pb-3">
                      
                      <div className="flex-shrink-0 bg-gray-100 p-2 rounded-full">
                        <img src="/svgs/text-document.svg" className="h-6 w-6 text-gray-400" alt="" />
                      </div>

                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-normal text-gray-400">2 hrs ago</p>
                        <p className="mt-1 text-sm font-medium text-gray-500">
                          You received a new contract offer
                        </p>
                        <div className="mt-3 flex space-x-7">
                          <button
                            type="button"
                            className="rounded-full flex items-center space-x-2 border-2 border-dashed p-2 text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                              <img src="/svgs/text-document.svg" className="h-6 w-6 text-gray-400" alt="" />
                            <span>View Offer</span>
                          </button>
                        </div>
                      </div>

                      <div className="ml-4 flex flex-shrink-0">
                        <span className='inline-block h-2 w-2 bg-blue-400 rounded-full'/>
                      </div>

                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex items-center rounded-full w-42 space-x-2 px-2 py-1 bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <div className='h-8 w-8 rounded-full flex justify-center items-center bg-success text-white'>
                      <span className="sr-only">Open user menu</span>
                      <span>L</span>
                    </div>
                    <h4>Leslie Peters</h4>
                    <ChevronDownIcon className='w-5 h-5'/>
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
                  <Menu.Items className="absolute space-y-3 p-4 right-0 z-10 mt-2.5 w-[15rem] origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none">
                    <section className='text-center'>
                      <div className='h-12 w-12 font-bold mb-1 mx-auto rounded-full flex justify-center items-center bg-success text-white'>
                        <span>L</span>
                      </div>
                      <h4>Leslie Peters</h4>
                      <span className='bg-orange-50 text-sm px-4 py-1 rounded-md text-orange-400 inline-block'>Tutor</span>
                    </section>
                    <section className='space-y-2 border-b pb-2'>
                      <button className='w-full bg-gray-100 rounded-md flex items-center justify-between p-2'>
                        <div className=' flex items-center space-x-1'>
                          <div className='bg-white flex justify-center items-center w-7 h-7 border rounded-full'>
                            <UserGroupIcon className="w-4 h-4 text-secondaryGray" onClick={undefined}/>
                          </div>
                          <h4 className='text-sm text-secondaryGray font-medium'>Switch account</h4>
                        </div>
                        <ChevronRightIcon className="w-2.5 h-2.5" onClick={undefined}/>
                      </button>
                      <button className='w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2'>
                        <div className='flex items-center space-x-1'>
                          <div className='bg-white border flex justify-center items-center w-7 h-7 rounded-full'>
                            <UserIcon className="w-4 h-4 text-secondaryGray" onClick={undefined}/>
                          </div>
                          <h4 className='text-sm text-secondaryGray font-medium'>Profile</h4>
                        </div>
                        <ChevronRightIcon className="w-2.5 h-2.5" onClick={undefined}/>
                      </button>
                    </section>
                    <button className='w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2'>
                      <div className='flex items-center space-x-1'>
                        <div className='bg-white border flex justify-center items-center w-7 h-7 rounded-full'>
                          <LogoutIcon className="w-4 h-4 text-secondaryGray" onClick={undefined}/>
                        </div>
                        <h4 className='text-sm text-error font-medium'>Logout</h4>
                      </div>
                    </button>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className={className}>
            {children}
        </main>
      </div>
    </>
  )
}
