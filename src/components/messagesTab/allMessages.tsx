import React from "react"

export default function AllMessagesTab(): JSX.Element {
  return (
    <li className="py-4 px-2 cursor-pointer border-top">
      <div className="flex space-x-3">
        <span className="inline-block h-fit relative">
          <div
            className="h-10 w-10 flex justify-center items-center font-semibold bg-success text-white rounded-full"
          >L</div>
        </span>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              <span className="block">Leslie Peters Mapu</span>
            </h3>
            <p className="text-sm text-secondaryBlue">5m</p>
          </div>
          <p className="text-xs text-justify text-gray-500">
            Parturient amet sociis tempor integer enim hollup turoti  posuere odio. Nunc habitant sit a arcu 
          </p>
        </div>
      </div>
    </li>
  )
}