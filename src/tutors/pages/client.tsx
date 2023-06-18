import React from 'react';

import { ChevronRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import {Layout} from "../components";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from '../components/icons';

export default function Client() {
  return (
    <>
      <Layout className="px-4">
        <nav className="flex mt-4" aria-label="Breadcrumb">
          <ol className="flex items-center">
            <li>
              <button className="flex items-center">
                <Link to="/clients" className="text-sm font-medium text-gray-400 hover:text-gray-700">
                  Clients
                </Link>
              </button>
            </li>
            <li>
              <div className="flex items-center text-gray-400">
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <a className="text-sm font-medium">
                  Liam Kelly
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <a className="text-sm font-normal text-secondaryBlue hover:text-blue-700">
                  Contract
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <section className="my-4">
          <h4 className="space-x-2">
            <span className="font-bold text-2xl">Contract</span>
          </h4>
        </section>
        
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-2">
          <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Invoice summary */}
            <div className="lg:col-start-3 bg-white lg:col-span-2 lg:row-end-1 p-2 rounded-lg shadow-sm ring-1 ring-gray-900/5">
              <div>
                <div className="h-14 w-14 mx-auto flex items-center justify-center bg-gray-100 p-2 rounded-full">
                  <img src="/svgs/text-document.svg" className="h-6 w-6 text-gray-400" alt="" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <div className="mt-2 space-y-1">
                    <h4 className="text-dark font-semibold">You have an active contract</h4>
                    <p className="text-sm text-gray-500">
                      You’ve completed 10 out of 15 sessions 
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center border rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-500 shadow-sm hover:text-gray-560 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  Send message
                </button>
              </div>
            </div>

            
            <div className="-mx-4 space-y-4 sm:mx-0 lg:col-span-2 lg:row-span-2 lg:row-end-2">
              <div className="flex shadow-sm sm:rounded-lg p-4 ring-1 ring-gray-900/5 lg:space-y-0 space-y-3 items-center justify-between">
                <section className="flex items-center sm:space-y-0 space-y-3 sm:space-x-4">
                  <img
                    className="h-10 w-10 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <p className="">
                    <span className="block whitespace-nowrap">
                        Liam Kelly
                      </span>
                      <span className="inline-block text-gray-400 text-sm">
                        Your contract with Liam ends 29th June, 2023
                      </span>
                  </p>
                </section>
                <div className="flex flex-none items-center gap-x-4">
                  <p
                    className="rounded-md bg-gray-50 px-2.5 py-1.5 text-sm font-semibold text-gray-500 shadow-sm hover:bg-gray-50 sm:block"
                  >
                    24.09.2022
                  </p>
                </div>
              </div>

              <div className="shadow-sm sm:rounded-lg p-4 ring-1 ring-gray-900/5 lg:space-y-0 space-y-3">
                <h3 className='text-xl mb-4 font-semibold tracking-wider'>Offer Details</h3>
                <ul className='space-y-4'>
                  <li className='text-sm space-y-2 font-normal'>
                    <h3 className='text-secondaryGray'>Subject & Level</h3>
                    <h4>Mathematics - A-Level</h4>
                  </li>
                  <li className='text-sm space-y-2 font-normal'>
                    <h3 className='text-secondaryGray'>What days would you like to have your classes</h3>
                    <h4>Mon, Tue, Wed</h4>
                  </li>
                  <li className='text-sm space-y-2 font-normal'>
                    <h3 className='text-secondaryGray'>Frequency of class sessions</h3>
                    <h4>Weekly</h4>
                  </li>
                  <li className='text-sm space-y-2 font-normal'>
                    <h3 className='text-secondaryGray'>Time</h3>
                    <h4 className='flex items-center space-x-1'><span>05:00 PM</span> <ArrowRightIcon className="w-4 h-4 text-secondaryGray" onClick={undefined}/> <span>08:00 PM</span></h4>
                  </li>
                  <li className='text-sm space-y-2 font-normal'>
                    <h3 className='text-secondaryGray'>Start date</h3>
                    <h4>June 21, 2023</h4>
                  </li>
                  <li className='text-sm space-y-2 font-normal'>
                    <h3 className='text-secondaryGray'>End date</h3>
                    <h4>June 24, 2023</h4>
                  </li>
                  <li className='text-sm space-y-2 font-normal'>
                    <h3 className='text-secondaryGray'>Note</h3>
                    <h4>Consequat luctus morbi suspendisse eu quis diam eleifend orci aliquet. Facilisi in lorem ultricies ligula arcu odio</h4>
                  </li>
                </ul>
              </div>

              <div className="shadow-sm sm:rounded-lg p-4 ring-1 ring-gray-900/5 lg:space-y-0 space-y-3">
                <h3 className='text-xl mb-4 font-semibold tracking-wider'>Payment Details</h3>
                <ul className='space-y-4'>
                  <li className='text-sm space-y-2 font-normal'>
                    <h3 className='text-secondaryGray'>Hourly rate</h3>
                    <h4 className='text-gray-800'>$25.00/hr</h4>
                    <p className='flex space-x-1 text-sm'>
                      <span>Shepherd charges a</span> 
                      <span className='text-secondaryBlue'>5% service fee (-$3.00/hr)</span>
                      <QuestionMarkCircleIcon className='h-4 w-4 rounded-full text-gray-200 bg-secondaryGray'/>
                    </p>
                  </li>

                  <li className='text-sm space-y-2 font-normal'>
                    <h3 className='text-secondaryGray'>You'll receive</h3>
                    <h4 className='text-gray-800'>$22.00/hr</h4>
                  </li>

                  <li className='text-sm mb-4 space-y-2 font-normal'>
                    <h3 className='text-secondaryGray'>Total amount</h3>
                    <h4 className='text-gray-800'>$214.00</h4>
                    <p className='flex space-x-1 text-sm'>
                      You'll be paid after each session
                    </p>
                  </li>
                </ul>

                <div style={{marginTop: '1rem'}} className='flex items-start space-x-2 font-semibold bg-blue-100 text-gray-500 p-3 rounded-md'>
                  <div className='flex justify-center items-center text-sm font-bold bg-primaryColor text-white w-10 rounded-full'>i</div>
                    <p className='text-sm'>
                      Initial payment will not be made until after the client reviews the offer after the first session. The client may decide to continue with you or withdraw the offer
                    </p>
                  </div>
              </div>
            </div>


          </div>
        </div>
      </Layout>
    </>
  )
}