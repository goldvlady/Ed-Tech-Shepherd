import React from "react";
import { PencilIcon, ArrowRightIcon } from "../icons"
import { CheckIcon } from "@heroicons/react/24/outline";

interface Subject {
  id: number;
  subject: string;
  level: string;
  price: string;
}

const subject: Subject[] = [
  { id: 0, subject: 'Economics', level: 'GSCE', price: '10.00' },
  { id: 1, subject: 'Mathematics', level: 'A-Level', price: '10.00' },
  { id: 2, subject: 'Yoruba', level: 'Grade 12', price: '10.00' },
]

export default function ProfileTab() {
  return (
    <div className="space-y-6">
      <section className="divide-y space-y-4 ring-1 ring-gray-900/5 shadow-sm sm:rounded-lg p-4">
        <div className="flex">
          <section className="relative flex items-center sm:space-y-0 space-y-3 sm:space-x-4">
            <div className="h-12 w-12 font-bold border flex justify-center items-center text-white bg-success rounded-full">
              L
            </div>
            <div className="absolute top-7 left-4 bg-primaryBlue flex justify-center items-center rounded-full w-5 h-5">
              <PencilIcon className="w-3 text-white" onClick={undefined}/>
            </div>
            <p className="">
              <span className="block whitespace-nowrap">
                  Leslie Peters
                </span>
                <span className="inline-block text-gray-400 text-sm">
                  lesliepeters@gmail.com
                </span>
            </p>
          </section>
        </div>
        <p className="flex items-center space-x-6 pt-4 text-md">
          <span className="uppercase text-secondaryGray text-xs">Hourly rate</span>
          <span className="font-bold text-[16px]">$20.00/hr</span>
        </p>
      </section>
      
      <div className="relative rounded-lg isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
        <img
          src="/images/profile.png"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0D1926] opacity-80"></div>
        <div className="mx-auto max-w-2xl text-center relative z-10">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-xl">Update intro video</h2>
        </div>
      </div>

      <section className="space-y-4 border shadow-sm sm:rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p className="text-secondaryGray">About Me</p>
          <div className="bg-white border flex justify-center items-center rounded-full w-8 h-8">
            <PencilIcon className="w-4 text-secondaryGray" onClick={undefined}/>
          </div>
        </div>
        <p className="text-sm font-normal text-justify">
          Quam eros suspendisse a pulvinar sagittis mauris. Vel duis adipiscing id faucibus consectetur amet. Tempor dui quam scelerisque at tempor aliquam. Vivamus aenean hendrerit turpis velit pretium consectetur quam ut malesuada. Tempor dui quam scelerisque at tempor aliquam. Vivamus aenean hendrerit turpis velit pretium consectetur quam ut malesuada.
        </p>
      </section>

      <section className="space-y-4 border shadow-sm sm:rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p className="text-secondaryGray">Suject Offered</p>
          <div className="bg-white border flex justify-center items-center rounded-full w-8 h-8">
            <PencilIcon className="w-4 text-secondaryGray" onClick={undefined}/>
          </div>
        </div>
        <table className="min-w-full border divide-y divide-gray-300">
          <thead>
            <tr className="divide-x divide-gray-200">
              <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold bg-gray-50 sm:pl-0">
                
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                Level
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {subject.map(({subject, level, price, id}) => (
              <tr key={id} className="divide-x divide-gray-200">
                <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium bg-gray-50 text-secondaryGray">
                  {subject}
                </td>
                <td className="whitespace-nowrap p-4 text-sm font-normal">{level}</td>
                <td className="whitespace-nowrap p-4 text-sm">${price}/hr</td>
              </tr>
            ))}
          </tbody>
            </table>
      </section>

      <section className="space-y-4 border shadow-sm sm:rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p className="text-secondaryGray">Qualifications</p>
          <div className="bg-white border flex justify-center items-center rounded-full w-8 h-8">
            <PencilIcon className="w-4 text-secondaryGray" onClick={undefined}/>
          </div>
        </div>

        <div className="flex items-start border-b pb-3">
          
          <div className="flex-shrink-0 border bg-gray-100 p-2 rounded-full">
            <img src="/svgs/text-document.svg" className="h-6 w-6 text-gray-400" alt="" />
          </div>

          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-normal">Indian Institute of Management (IIM), Bangalore</p>
            <p className="mt-1 text-sm font-normal text-secondaryGray">
              Master of Business Administration (MBA), Information System
            </p>
            <p className="mt-1 text-sm font-normal text-secondaryGray">
              2008 - 2010
            </p>
          </div>
        </div>

        <div className="flex items-start border-b pb-3">
          
          <div className="flex-shrink-0 border bg-gray-100 p-2 rounded-full">
            <img src="/svgs/text-document.svg" className="h-6 w-6 text-gray-400" alt="" />
          </div>

          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-normal">Indian Institute of Management (IIM), Bangalore</p>
            <p className="mt-1 text-sm font-normal text-secondaryGray">
              Master of Business Administration (MBA), Information System
            </p>
            <p className="mt-1 text-sm font-normal text-secondaryGray">
              2008 - 2010
            </p>
          </div>
        </div>

      </section>

      <section className="space-y-4 w-full border shadow-sm sm:rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p className="text-secondaryGray">Availability</p>
          <div className="bg-white border flex justify-center items-center rounded-full w-8 h-8">
            <PencilIcon className="w-4 text-secondaryGray" onClick={undefined}/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full overflow-x-auto border divide-y divide-gray-300">
            <thead>
              <tr className="divide-x divide-gray-200">
                <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold bg-gray-100 sm:pl-0">
                  
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Mon
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Tue
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Wed
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Thur
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Fri
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Sat
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Sun
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr className="divide-x divide-gray-200">
                <td className="py-4 pl-4 pr-4 text-xs font-semibold bg-gray-100">
                  <div className="flex items-center space-x-1 text-gray-700">
                    <img src="/svgs/cloud.svg" alt="" className="h-5 w-5" />
                    <p>8 AM</p>
                    <ArrowRightIcon className="w-4" onClick={undefined}/>
                    <p>12 AM</p>
                  </div>
                </td>
                <td className="bg-profile-pattern whitespace-nowrap p-4 text-sm font-normal"></td>
                <td className="bg-profile-pattern whitespace-nowrap p-4 text-sm"></td>
                <td className="bg-profile-pattern whitespace-nowrap p-4 text-sm"></td>
                <td className="bg-profile-pattern whitespace-nowrap p-4 text-sm"></td>
                <td className="bg-profile-pattern whitespace-nowrap p-4 text-sm"></td>
                <td className="bg-profile-pattern whitespace-nowrap p-4 text-sm"></td>
                <td className="bg-profile-pattern whitespace-nowrap p-4 text-sm"></td>
              </tr>
              <tr className="divide-x divide-gray-200">
                <td className="py-4 pl-4 pr-4 text-xs font-semibold bg-gray-100">
                  <div className="flex items-center space-x-1 text-gray-700">
                    <img src="/svgs/cloud.svg" alt="" className="h-5 w-5" />
                    <p>12 AM</p>
                    <ArrowRightIcon className="w-4" onClick={undefined}/>
                    <p>5 AM</p>
                  </div>
                </td>
                <td className="bg-white whitespace-nowrap p-4 text-sm font-normal">
                  <CheckIcon className="text-green-500 w-7 h-7"/>
                </td>
                <td className="bg-white whitespace-nowrap p-4 text-sm">
                  <CheckIcon className="text-green-500 w-7 h-7"/>
                </td>
                <td className="bg-profile-pattern whitespace-nowrap p-4 text-sm"></td>
                <td className="bg-profile-pattern whitespace-nowrap p-4 text-sm"></td>
                <td className="bg-white whitespace-nowrap p-4 text-sm">
                  <CheckIcon className="text-green-500 w-7 h-7"/>
                </td>
                <td className="bg-white whitespace-nowrap p-4 text-sm">
                  <CheckIcon className="text-green-500 w-7 h-7"/>
                </td>
                <td className="bg-white whitespace-nowrap p-4 text-sm">
                  <CheckIcon className="text-green-500 w-7 h-7"/>
                </td>
              </tr>
              <tr className="divide-x divide-gray-200">
                <td className="py-4 pl-4 pr-4 text-xs font-semibold bg-gray-100 text-secondaryGray">
                  <div className="flex items-center space-x-2 text-gray-800">
                    <img src="/svgs/cloud.svg" alt="" className="h-5 w-5" />
                    <p>5 AM</p>
                    <ArrowRightIcon className="w-4" onClick={undefined}/>
                    <p>9 AM</p>
                  </div>
                </td>
                <td className="bg-white whitespace-nowrap p-4 text-sm font-normal">
                  <CheckIcon className="text-green-500 w-7 h-7"/>
                </td>
                <td className="bg-white whitespace-nowrap p-4 text-sm">
                  <CheckIcon className="text-green-500 w-7 h-7"/>
                </td>
                <td className="bg-profile-pattern whitespace-nowrap p-4 text-sm"></td>
                <td className="bg-profile-pattern whitespace-nowrap p-4 text-sm"></td>
                <td className="bg-white whitespace-nowrap p-4 text-sm">
                  <CheckIcon className="text-green-500 w-7 h-7"/>
                </td>
                <td className="bg-white whitespace-nowrap p-4 text-sm">
                  <CheckIcon className="text-green-500 w-7 h-7"/>
                </td>
                <td className="bg-white whitespace-nowrap p-4 text-sm">
                  <CheckIcon className="text-green-500 w-7 h-7"/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}