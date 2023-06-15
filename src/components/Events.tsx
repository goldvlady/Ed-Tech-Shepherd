import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import React, { Component } from 'react';

export default function Events({ event }: any) {
  return (
    <li className={`flex gap-x-3 ${event.backgroundColor}`}>
      <div className={`min-h-fit w-1 rounded-tr-full rounded-br-full ${event.color}`} />
      <div className="py-2">
        <div className="flex gap-x-1">
          <div className="min-w-0 flex-auto">
            <p className="text-xs font-normal leading-6 text-gray-500">{event.name}</p>
            <p className="mt-1 flex items-center truncate text-xs leading-5 text-gray-500">
              <span>{event.lastSeen}</span>
              <ChevronRightIcon className="w-4 h-4" />
              <span>{event.time}</span>
            </p>
          </div>
        </div>
        <div className="flex -space-x-0.5">
          <dt className="sr-only">Commenters</dt>
          {event.commenters.map((commenter: any) => (
            <dd key={commenter.id}>
              <img
                className={`h-5 w-5 rounded-full ${
                  commenter.backgroundColor ? commenter.backgroundColor : 'bg-gray-50'
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
