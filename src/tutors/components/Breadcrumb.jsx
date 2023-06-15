import React from 'react';
import  { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link } from 'react-router-dom';

const Breadcrumb = () => {
  return (
    <nav className="flex mt-4" aria-label="Breadcrumb">
      <ol className="flex items-center">
        <li>
          <butt className="flex items-center">
            <Link to="/offers" className="text-sm font-medium text-gray-500 hover:text-gray-700">
              Offers
            </Link>
          </butt>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <a href="#" className="text-sm font-medium text-secondaryBlue hover:text-blue-700">
              Review offer
            </a>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;