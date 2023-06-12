import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import { StarIcon, EllipsisHorizontalIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from '../icons';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { useNavigate } from "react-router-dom";
import { classNames } from '../../helpers';

const clients = [
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
  },
]

export default function AllClientTab() {
  const checkbox = useRef()
  const [reportModal, setReportModal] = useState(false);
  const [clientReviewModal, setClientReviewModal] = useState(false);
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState([])
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < clients.length
    setChecked(selectedPeople.length === clients.length)
    setIndeterminate(isIndeterminate)
    checkbox.current.indeterminate = isIndeterminate
  }, [selectedPeople])

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : clients)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              <div className='table-columns'>
                {selectedPeople.length > 0 && (
                  <div className="top-0 border px-4 py-8 rounded-md flex h-12 items-center space-x-3 w-[469] bg-white sm:left-12">
                    <p className='text-gray-600'>
                      {selectedPeople.length} items selected
                    </p>

                    <button className='text-gray-600' onClick={toggleAll}>Select all</button>

                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white space-x-2 px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      <TrashIcon className="w-5"/>
                      <span>Delete</span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
              <table className="min-w-full table-auto divide-y divide-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="relative hidden sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>

                    <th scope="col" className="relative sm:w-12 sm:px-6">
                      
                    </th>
                    
                    <th scope="col-span" className="sm:w-12 py-3.5 text-left text-sm font-semibold text-secondaryGray">
                      Client name
                    </th>
                    <th scope="col" className="py-3.5 text-left text-sm font-semibold text-secondaryGray">
                      Subject
                    </th>
                    <th scope="col" className="py-3.5 text-left text-sm font-semibold text-secondaryGray">
                      Start date
                    </th>
                    <th scope="col" className="py-3.5 text-left text-sm font-semibold text-secondaryGray">
                      End date
                    </th>
                    <th scope="col" className="py-3.5 text-left text-sm font-semibold text-secondaryGray">
                      Status
                    </th>
                    <th scope="col" className="py-3.5 text-left text-sm font-semibold text-secondaryGray">
                      Amount earned
                    </th>
                    <th scope="col" className="py-3.5 text-left text-sm font-semibold text-secondaryGray">
                      Classes
                    </th>
                    <th scope="col" className="py-3.5 text-left text-sm font-semibold text-secondaryGray">
                      Rating
                    </th>
                    <th scope="col" className="py-3.5 text-left text-sm font-semibold text-secondaryGray">
                      
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {clients.map((client) => (
                    <tr key={client.id} className={selectedPeople.includes(client) ? 'bg-blue-50' : undefined}>
                      <td className="relative px-7 sm:w-12 sm:px-6">
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
                      </td>
                      <td
                        className='whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-500'>
                        {client.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{client.subject}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{client.startDate}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{client.endDate}</td>
                      <td className={classNames(
                        `${client.status.toLowerCase() === "active" ? 'text-primaryBlue' : 'text-gray-500'}`,
                        `${client.status.toLowerCase() === "pending" ? 'text-orange-400' : 'text-gray-500'}`,
                        'whitespace-nowrap px-3 py-4 text-sm'
                      )}>{client.status}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${client.amountEarned}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                        <span className='inline-block bg-gray-100 px-2 py-1 rounded-md'>{client.classes}</span>
                      </td>
                      <td className="whitespace-nowrap flex items-center px-3 py-4 text-sm text-gray-500">
                        <span>{client.rating}</span>
                        <StarIcon className="w-4 h-4 text-yellow-500"/>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 text-right text-sm font-medium sm:pr-3">
                        <Menu as="div" className="relative">
                          <div>
                            <Menu.Button>
                              <EllipsisHorizontalIcon className="h-6 text-secondaryGray"/>
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
                              <section className='space-y-2 border-b pb-2'>
                                <button onClick={() => navigate(`/clients/${client.id}`)} className='w-full bg-gray-100 rounded-md flex items-center justify-between p-2'>
                                  <div className=' flex items-center space-x-1'>
                                    <div className='bg-white flex justify-center items-center w-7 h-7 border rounded-full'>
                                      <img src="/svgs/contract.svg" alt='Contract' className="w-4 h-4"/>
                                    </div>
                                    <h4 className='text-sm text-secondaryGray font-medium'>Contract</h4>
                                  </div>
                                  <ChevronRightIcon className="w-2.5 h-2.5"/>
                                </button>
                                <button onClick={() => setReportModal(true)} className='w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2'>
                                  <div className='flex items-center space-x-1'>
                                    <div className='bg-white border flex justify-center items-center w-7 h-7 rounded-full'>
                                      <img src="/svgs/contract.svg" alt='Monthly report' className="w-4 h-4"/>
                                    </div>
                                    <h4 className='text-sm text-secondaryGray font-medium'>Monthly report</h4>
                                  </div>
                                  <ChevronRightIcon className="w-2.5 h-2.5"/>
                                </button>
                                <button onClick={() => setClientReviewModal(true)} className='w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2'>
                                  <div className='flex items-center space-x-1'>
                                    <div className='bg-white border flex justify-center items-center w-7 h-7 rounded-full'>
                                      <StarIcon className="w-4 h-4 text-secondaryGray"/>
                                    </div>
                                    <h4 className='text-sm text-secondaryGray font-medium'>Client review</h4>
                                  </div>
                                  <ChevronRightIcon className="w-2.5 h-2.5"/>
                                </button>
                              </section>
                              {client.status.toLowerCase() === 'ended' ? (
                                <button disabled={true} className='w-full cursor-not-allowed hover:bg-gray-100 rounded-md flex items-center justify-between p-2'>
                                  <div className='flex items-center space-x-1'>
                                    <div className='bg-white border flex justify-center items-center w-7 h-7 rounded-full'>
                                      <TrashIcon className="w-4 h-4 text-gray-400"/>
                                    </div>
                                    <h4 className='text-sm text-gray-300 font-medium'>Delete</h4>
                                  </div>
                                </button>
                              ) : (
                              <button className='w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2'>
                                <div className='flex items-center space-x-1'>
                                  <div className='bg-white border flex justify-center items-center w-7 h-7 rounded-full'>
                                    <img src="/svgs/trash.svg" alt='Delete Clients' className="w-4 h-4"/>
                                  </div>
                                  <h4 className='text-sm text-error font-medium'>Delete</h4>
                                </div>
                              </button>
                              )}
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

      {/* Montly Report Modal */}
      <Transition.Root show={reportModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setReportModal}>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pt-5 text-left shadow-xl transition-all sm:w-full sm:max-w-md">
                  <div>
                    <div className='flex justify-between px-3 border-b pb-3'>
                      <h4>Monthly report</h4>
                      <button onClick={() => setReportModal(false)} className="flex items-center justify-center rounded-full border bg-white w-7 h-7 text-xs font-medium text-secondaryGray">
                        <XMarkIcon className='w-4 h-4'/>
                      </button>
                    </div>
                    <sections className="mt-3 sm:mt-5">
                      <div className='mt-4'>
                        <h3 className='text-dark mb-3 pl-4'>Previous classes</h3>
                        <div className='flex space-x-3 pl-4'>
                          <h3 className='text-xs'>8th May</h3>
                          <div className='border-t pt-2 pr-4 flex-1 mt-1.5'>
                            <div className='flex-1 border-t flex items-center justify-between w-full p-2 border border-gray-200 rounded-md bg-white'>
                              <div className="flex items-center text-xs space-x-2">
                                <svg viewBox="0 0 2 2" className="h-1.5 w-1.5 text-gray-400 fill-current">
                                  <circle cx={1} cy={1} r={1} />
                                </svg>
                                <p className='text-dark'>03:30 pm</p>
                                <svg viewBox="0 0 2 2" className="h-1.5 w-1.5 text-gray-400 fill-current">
                                  <circle cx={1} cy={1} r={1} />
                                </svg>
                                <p className='text-dark'>04:30 pm</p>
                              </div>
                              <p className='text-secondaryBlue text-xs px-2 py-1 rounded-full bg-blue-50'>
                                1hr
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className='flex space-x-3 mt-1 pl-4'>
                          <h3 className='text-xs'>8th May</h3>
                          <div className='border-t pt-2 pr-4 flex-1 mt-1.5'>
                            <div className='flex-1 border-t flex items-center justify-between w-full p-2 border border-gray-200 rounded-md bg-white'>
                              <div className="flex items-center text-xs space-x-2">
                                <svg viewBox="0 0 2 2" className="h-1.5 w-1.5 text-gray-400 fill-current">
                                  <circle cx={1} cy={1} r={1} />
                                </svg>
                                <p className='text-dark'>03:30 pm</p>
                                <svg viewBox="0 0 2 2" className="h-1.5 w-1.5 text-gray-400 fill-current">
                                  <circle cx={1} cy={1} r={1} />
                                </svg>
                                <p className='text-dark'>04:30 pm</p>
                              </div>
                              <p className='text-secondaryBlue text-xs px-2 py-1 rounded-full bg-blue-50'>
                                1hr
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='mt-4'>
                        <h3 className='text-dark mb-2 pl-4'>Upcoming classes</h3>
                        <div className='flex space-x-3 pl-4'>
                          <h3 className='text-xs'>10th May</h3>
                          <div className='border-t pt-2 pr-4 flex-1 mt-1.5'>
                            <div className='flex-1 border-t flex items-center justify-between w-full p-2 border border-gray-200 rounded-md bg-white'>
                              <div className="flex items-center text-xs space-x-2">
                                <svg viewBox="0 0 2 2" className="h-1.5 w-1.5 text-gray-400 fill-current">
                                  <circle cx={1} cy={1} r={1} />
                                </svg>
                                <p className='text-dark'>03:30 pm</p>
                                <svg viewBox="0 0 2 2" className="h-1.5 w-1.5 text-gray-400 fill-current">
                                  <circle cx={1} cy={1} r={1} />
                                </svg>
                                <p className='text-dark'>04:30 pm</p>
                              </div>
                              <p className='text-secondaryBlue text-xs px-2 py-1 rounded-full bg-blue-50'>
                                1hr
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className='flex space-x-3 mt-1 pl-4'>
                          <h3 className='text-xs'>12th May</h3>
                          <div className='border-t pt-2 pr-4 flex-1 mt-1.5'>
                            <div className='flex-1 border-t flex items-center justify-between w-full p-2 border border-gray-200 rounded-md bg-white'>
                              <div className="flex items-center text-xs space-x-2">
                                <svg viewBox="0 0 2 2" className="h-1.5 w-1.5 text-gray-400 fill-current">
                                  <circle cx={1} cy={1} r={1} />
                                </svg>
                                <p className='text-dark'>03:30 pm</p>
                                <svg viewBox="0 0 2 2" className="h-1.5 w-1.5 text-gray-400 fill-current">
                                  <circle cx={1} cy={1} r={1} />
                                </svg>
                                <p className='text-dark'>04:30 pm</p>
                              </div>
                              <p className='text-secondaryBlue text-xs px-2 py-1 rounded-full bg-blue-50'>
                                1hr
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </sections>
                  </div>
                  <div className="mt-5 p-3 flex justify-between items-center w-full bg-gray-100 sm:mt-6">
                    <div className='text-secondaryGray text-xs'>
                      <p>Total hours</p>
                      <p className='text-dark font-semibold'>20 hrs</p>
                    </div>
                    <div className='text-secondaryGray text-xs'>
                      <p>Total Received</p>
                      <p className='text-dark font-semibold'>$212.00</p>
                    </div>
                    <div className='text-secondaryGray text-xs'>
                      <p>Total Amount</p>
                      <p className='text-dark font-semibold'>$412.00</p>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Client Review Modal */}
      <Transition.Root show={clientReviewModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setClientReviewModal}>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pt-5 text-left shadow-xl transition-all sm:w-full sm:max-w-sm">
                  <div>
                    <div className='flex justify-center px-3 border-b pb-3'>
                      <h4>Liam Kelly dropped feedback for you</h4>
                    </div>
                    <sections className="mt-3 sm:mt-5">
                      <div className='p-3'>
                        <h3 className='text-gray-700 mb-2'>Rating</h3>
                        <ul className='space-x-2 grid grid-cols-5'>
                          <li className='border py-2 rounded-md flex justify-center text-center bg-white'>
                            <span>1</span>
                            <StarIcon className='w-5 text-yellow-400'/>
                          </li>
                          <li className='border py-2 rounded-md flex justify-center text-center bg-white'>
                            <span>2</span>
                            <StarIcon className='w-5 text-yellow-400'/>
                          </li>
                          <li className='border py-2 rounded-md flex justify-center text-center bg-white'>
                            <span>3</span>
                            <StarIcon className='w-5 text-yellow-400'/>
                          </li>
                          <li className='border py-2 rounded-md flex justify-center text-center bg-white'>
                            <span>4</span>
                            <StarIcon className='w-5 text-yellow-400'/>
                          </li>
                          <li className='border py-2 rounded-md flex justify-center text-center bg-white'>
                            <span>5</span>
                            <StarIcon className='w-5 text-yellow-400'/>
                          </li>
                        </ul>
                      </div>
                      <div className='p-3'>
                      <p className='mt-4 border rounded-md p-3 text-dark'>
                        Risus purus sed integer arcu sollicitudin eros tellus phasellus viverra. Dolor suspendisse quisque proin velit nulla diam. Vitae in mauris condimentum s
                      </p>
                      </div>
                    </sections>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>

  )
}
