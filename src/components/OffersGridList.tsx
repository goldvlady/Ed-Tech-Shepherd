import React from 'react';
import { PencilIcon, SparklesIcon, StarIcon, ArrowRightIcon, EllipsistIcon } from './icons';
import { useNavigate } from "react-router-dom";

interface Status {
  new: number;
  updated: number;
  perfectOffer: number;
  justDate: number;
}

interface Offer {
  id: number;
  subject: string;
  level: string;
  title: string;
  status: Status;
  offer: string;
  from: string;
  to: string;
  time: string;
  name: string;
  imageURL: string;
}

const offers: Offer[] = [
  {
    id: 1,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 1,
      updated: 1,
      perfectOffer: 0,
      justDate: 0
    },
    offer: '22.00',
    from: "05:00",
    to: "08:00",
    time: '',
    name: 'William Kelly',
    imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 1,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 1,
      updated: 0,
      perfectOffer: 0,
      justDate: 0
    },
    offer: '22.00',
    from: "05:00",
    to: "08:00",
    time: '',
    name: 'William Kelly',
    imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 1,
      updated: 0,
      perfectOffer: 1,
      justDate: 0
    },
    offer: '22.00',
    from: "05:00",
    to: "08:00",
    time: '',
    name: 'William Kelly',
    imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 3,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 0,
      updated: 0,
      perfectOffer: 0,
      justDate: 1
    },
    offer: '22.00',
    from: "05:00",
    to: "08:00",
    time: '23',
    name: 'William Kelly',
    imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 4,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 1,
      updated: 0,
      perfectOffer: 1,
      justDate: 0
    },
    offer: '22.00',
    from: "05:00",
    to: "08:00",
    time: '',
    name: 'William Kelly',
    imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 4,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 0,
      updated: 0,
      perfectOffer: 0,
      justDate: 1
    },
    offer: '22.00',
    from: "05:00",
    to: "08:00",
    time: '',
    name: 'William Kelly',
    imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 4,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 1,
      updated: 0,
      perfectOffer: 0,
      justDate: 0
    },
    offer: '22.00',
    from: "05:00",
    to: "08:00",
    time: '',
    name: 'William Kelly',
    imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
    {
    id: 4,
    subject: 'Economics',
    level: 'A',
    title: '3 lessons weekly',
    status: {
      new: 0,
      updated: 0,
      perfectOffer: 0,
      justDate: 1
    },
    offer: '22.00',
    from: "05:00",
    to: "08:00",
    time: '23',
    name: 'William Kelly',
    imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
]

function Updated() {
  return (
    <p className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-blue-100 px-1.5 py-1 text-xs font-medium text-secondaryBlue">
      <PencilIcon className='w-4 h-4' onClick={undefined}/>
      <span>Updated</span>
    </p>
  )
}

function PerfectOffer() {
  return (
    <p className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-blue-100 px-1.5 py-1 text-xs font-medium text-secondaryBlue">
      <StarIcon className='w-4 h-4' onClick={undefined}/>
      <span>Perfect Offer</span>
    </p>
  )
}

function New() {
  return (
    <p className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray">
      <SparklesIcon className='w-4 h-4' onClick={undefined}/>
      <span>New</span>
    </p>
  )
}

function Date() {
  return (
    <p className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray">
      24.09.2022
    </p>
  )
}

function OfferItem({ offer, navigate }: { offer: Offer; navigate: any }) {
  const { id, imageURL, name, offer: offerAmount, subject, level, title, status, from, to, time } = offer;

  const handleItemClick = () => {
    navigate(`/offers/${id}`);
  };

  return (
    <li onClick={handleItemClick} className="col-span-1 space-y-2 mb-6 cursor-pointer divide-y divide-gray-200 border-0.5 p-3 rounded-lg bg-white shadow-md">
      <div className="space-y-3">
        
        <div className='flex w-full items-center justify-between space-x-6'>
          <div className="flex-shrink-0 bg-gray-100 p-2 rounded-full">
            <img src="/svgs/text-document.svg" className="h-6 w-6 text-gray-400" alt="" />
          </div>
          
          <div>
            <div className="flex items-center space-x-3">
              {status.perfectOffer === 1 && <PerfectOffer />}
              {status.updated === 1 && <Updated />}
              {status.new === 1 && <New />}
              {status.justDate === 1 && <Date />}
            </div>
          </div>
        </div>

        <div className='flex w-full items-center justify-between space-x-6'>
          <div className="flex-shrink-0">
            <span>{subject}</span>
            <p className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-orange-100 px-1.5 py-1 text-xs font-medium text-orange-400">
              <span>{level}-Level</span>
            </p>
          </div>
          
          <p className="inline-flex flex-shrink-0 space-x-1 items-center text-md font-medium">
            ${offerAmount}/hr
          </p>
        </div>

        <p className='text-secondaryGray flex items-center text-sm font-normal'>
          <span>{title}</span>
          <EllipsistIcon className="w-1 mx-0.5" onClick={undefined}/>
          <span>{from} PM</span>
          <ArrowRightIcon className="w-3 mx-0.5" onClick={undefined}/>
          <span>{to} PM</span>
        </p>
      </div>

      <div className="flex items-center pt-3 justify-between">
        <div className="flex items-center  gap-x-3 text-sm font-normal">
          <img className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-300" src={imageURL} alt="" />
          <span className='text-primaryGray'>{name}</span>
        </div>
        <p className="text-sm font-semibold text-red-400">
          {time ? `${time}hours left` : ''}
        </p>
      </div>
    </li>
  );
}

export default function OffersGridList() {
  const navigate = useNavigate();
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer) => (
        <OfferItem key={offer.id} offer={offer} navigate={navigate} />
      ))}
    </ul>
  )
}
