import { XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";

interface DeleteNoteModalProps {
  title: string;
  setDeleteNoteModal: (state: boolean) => void;
}

const DeleteNoteModal: React.FC<DeleteNoteModalProps> = ({
  title,
  setDeleteNoteModal,
}) => {
  return (
    <section>
      <div>
        <div className="flex justify-end p-3">
          <button
            onClick={() => setDeleteNoteModal(false)}
            className="inline-flex flex-shrink-0 space-x-1 items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-secondaryGray"
          >
            <span>Close</span>
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="h-12 w-12 mt-4 mx-auto flex items-center justify-center bg-white border shadow-sm p-2 rounded-full">
          <img src="/svgs/text-document.svg" className="h-6 w-6" alt="" />
        </div>
        <div className="mt-3 px-6 text-center sm:mt-5">
          <p className="text-base font-semibold leading-6 text-gray-900">
            {` Delete ${title}?`}
          </p>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              This will permanently all learning materials associated with this
              note
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 p-3 space-x-4 flex justify-end w-full bg-gray-100 sm:mt-6">
        <button
          type="button"
          className="inline-flex w-fit justify-center rounded-md bg-white ring-1 ring-gray-400 px-3 py-2 text-sm font-semibold text-primaryGray shadow-sm hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          onClick={() => setDeleteNoteModal(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex w-fit justify-center rounded-md bg-error px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          onClick={() => setDeleteNoteModal(false)}
        >
          Delete
        </button>
      </div>
    </section>
  );
};

export default DeleteNoteModal;
