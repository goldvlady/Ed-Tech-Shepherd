import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useRef } from "react";

interface ModalOptions {
  openModalBox: boolean;
  children?: any;
  classes: string;
  closeModal: () => void;
}

const CustomModal = ({
  children,
  classes,
  openModalBox,
  closeModal,
}: ModalOptions) => {
  let completeButtonRef = useRef(null);

  return (
    <>
      <Transition appear show={openModalBox} as={Fragment}>
        <Dialog
          initialFocus={completeButtonRef}
          as="div"
          className="fixed inset-0 z-[70] top-0 flex justify-center items-center overflow-y-auto bg-black/50 bg-opacity-50 backdrop-filter backdrop-blur-[2px]"
          onClose={closeModal}
        >
          <button></button>
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`${classes ?? ""}
inline-block overflow-hidden text-left align-middle transition-all transform rounded-lg bg-white`}
              >
                <div className="mt-2">{children}</div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CustomModal;
