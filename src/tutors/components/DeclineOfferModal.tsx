import React, {Fragment} from 'react';
import { Transition, Dialog } from '@headlessui/react';

interface DeclineOfferModalProps {
  declineOfferModalState: boolean;
  setDeclineOfferModalState: (state: boolean) => void;
};

const DeclineOfferModal: React.FC<DeclineOfferModalProps> = ({ declineOfferModalState, setDeclineOfferModalState }) => {
  return (
    <Transition.Root show={declineOfferModalState} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setDeclineOfferModalState}>
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
                  <div className='flex justify-center px-2 border-b pb-4'>
                    <p className="text-md font-medium">
                      Decline Offer
                    </p>
                  </div>
                  <form className='px-10 mt-2'>
                    <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
                      Add a note (optional)
                    </label>
                    <div className="mt-2">
                      <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        placeholder='Let the client knows what your terms are'
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-error700 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                        defaultValue={''}
                      />
                    </div>
                  </form>
                </div>
                <div className="mt-5 p-3 flex justify-end w-full bg-gray-100 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-fit justify-center rounded-md bg-error px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    onClick={() => setDeclineOfferModalState(false)}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DeclineOfferModal;
