import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, ReactElement } from "react";

interface IDropdownProps {
  sortedBy: any[];
  menuTitle: string;
  DropdownMenuIcon: ReactElement;
  children?: any;
}
const DropdownMenu = ({
  menuTitle,
  DropdownMenuIcon,
  children,
}: IDropdownProps) => {
  return (
    <div>
      <Menu as="div" className="relative">
        <div>
          <Menu.Button className="flex text-secondaryGray items-center space-x-2 border px-3 py-2 rounded-md">
            {DropdownMenuIcon}
            <span>{menuTitle}</span>
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
          <Menu.Items className="absolute space-y-3 p-3 right-0 z-50 mt-2.5 w-[12rem] origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none">
            {children}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropdownMenu;
