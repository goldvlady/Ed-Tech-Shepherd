import React, { Fragment, FC, useRef, memo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const Proceed: FC = () => {
  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <section className="px-6 mt-4">
        <div className="flex flex-wrap lg:space-y-0 space-y-3 items-center justify-between px-4 rounded-md py-5 border shadow-sm">
          <section className="relative flex flex-wrap items-center sm:space-y-0 space-y-3 sm:space-x-4">
            <img className='absolute sm:-top-0 top-4 sm:left-12 left-9 sm:rotate-12 rotate-[24deg]' alt='' src='/svgs/cut-border.svg'/>
            <div className="flex proceed text-white justify-center text-2xl bg-success h-14 w-14 rounded-full items-center">
              L
            </div>
            <p className="">
               <span className="block whitespace-nowrap">
                  Welcome to sherpherd
                </span>
                <span className="inline-block text-gray-400 text-sm">
                  We need a few more details to complete your profile. This helps you stand out from other tutors.
                </span>
            </p>
          </section>
          <div className="flex flex-none items-center gap-x-4">
            <button
              onClick={() => setOpen(true)}
              className="rounded-md bg-gray-100 px-2.5 py-1.5 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50 sm:block"
            >
              Proceed
            </button>
          </div>
        </div>
      </section>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={setOpen}>
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

          <div className="fixed inset-1 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-10">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <h3 className='border-b px-2 py-4 text-center'>Hey Leslie, kindly drop a lesson summary</h3>
                  <form className="space-y-6 p-6" action="#" method="POST">
                    <div className='flex items-start space-x-2 font-semibold bg-blue-50 text-gray-400 p-2 rounded-md'>
                      <div className='flex justify-center items-center font-bold bg-primaryColor text-white w-10 rounded-full'>i</div>
                      <p>
                        submitting a summary of each lesson with your students is neccessary for payment processing.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-500">
                        Subject
                      </label>
                      <div className="mt-2">
                        <input
                          id="subject"
                          name="subject"
                          type="texg"
                          autoComplete="subject"
                          placeholder='Enter subject'
                          required
                          className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="topic" className="block text-sm font-medium leading-6 text-gray-500">
                        Topic
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="topic"
                          name="topic"
                          type="text"
                          autoComplete="topic"
                          placeholder='Topic'
                          required
                          className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6"
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="summary" className="block text-sm font-medium leading-6 text-gray-500">
                        Summary
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="summary"
                          name="summary"
                          type="text"
                          autoComplete="summary"
                          placeholder='Summary'
                          required
                          className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6"
                        ></textarea>
                      </div>
                    </div>

                    <div className='flex justify-end'>
                      <button
                        type="submit"
                        onClick={() => setOpen(false)}
                        className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Confirm
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default memo(Proceed);