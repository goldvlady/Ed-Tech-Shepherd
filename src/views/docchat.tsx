import { Layout } from "../components";
import { Text } from "@chakra-ui/react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import React, { Fragment, useState } from "react";

const notes = [{}];

export default function Notes() {
  const [, setUploadDocumentModal] = useState(false);
  return (
    <Layout
      className={`${
        notes.length > 0 ? "bg-white" : "bg-gray-100"
      } p-3 h-screen`}
    >
      <section className="divide-y max-w-screen-xl mx-auto pb-6 lg:pb-16">
        <main className="relative">
          <div className="bg-white  overflow-hidden">
            <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
              <div className="pb-1 lg:col-span-6">
                <div className="flex flex-row justify-between mx-2 my-5">
                  <Text className="align-middle self-center h-full font-bold">
                    Documenttitle.pdf
                  </Text>
                  <div className="flex flex-row justify-between space-x-2">
                    <button className="rounded-full relative bg-white p-2 text-gray-400 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-50">
                      <span className="sr-only">Pin</span>
                      <img
                        src="/svgs/pin.svg"
                        className="h-7 w-7 text-gray-400"
                        alt=""
                      />
                    </button>
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button
                          type="button"
                          className="rounded-full relative bg-white p-2 text-gray-400 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-50"
                        >
                          <span className="sr-only">Pin</span>
                          <EllipsisHorizontalIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
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
                        <Menu.Items className="absolute space-y-3 p-2 right-0 z-10 mt-2.5 w-[15rem] origin-top-right rounded-lg bg-white py-2 shadow-md ring-1 ring-gray-900/5 focus:outline-none">
                          <section className="space-y-2 border-b pb-2">
                            <button className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2">
                              <div className=" flex items-center space-x-1">
                                <div className="bg-white flex justify-center items-center w-8 h-8 border rounded-full">
                                  <span className="sr-only">Tag</span>
                                  <img
                                    src="/svgs/tag.svg"
                                    className="h-4 w-4 text-gray-400"
                                    alt=""
                                  />
                                </div>
                                <Text className="text-sm text-secondaryGray font-medium">
                                  Add tag
                                </Text>
                              </div>
                            </button>
                            <button
                              onClick={() => setUploadDocumentModal(true)}
                              className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2"
                            >
                              <div className="flex items-center space-x-1">
                                <div className="bg-white border flex justify-center items-center w-8 h-8 rounded-full">
                                  <span className="sr-only">Download</span>
                                  <img
                                    src="/svgs/download.svg"
                                    className="h-4 w-4 text-gray-400"
                                    alt=""
                                  />
                                </div>
                                <Text className="text-sm text-secondaryGray font-medium">
                                  Download
                                </Text>
                              </div>
                            </button>
                          </section>
                          <button className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2">
                            <div className="flex items-center space-x-1">
                              <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                                <span className="sr-only">Download</span>
                                <img
                                  src="/svgs/trash.svg"
                                  className="h-4 w-4 text-error"
                                  alt=""
                                />
                              </div>
                              <Text className="text-sm text-error font-medium">
                                Delete
                              </Text>
                            </div>
                          </button>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <section className="mx-5">
                  <div className="flex flex-row justify-between bg-gray-500 p-7">
                    <button className="rounded-full relative text-gray-400 focus:outline-none">
                      <span className="sr-only">Write</span>
                      <PencilSquareIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                    <div className="flex flex-row content-center">
                      <button className="rounded-full relative bg-gray-800 text-gray-400 focus:outline-none opacity-40 p-1">
                        <span className="sr-only">Prev</span>
                        <ChevronLeftIcon
                          className="h-5 w-5 text-gray-50"
                          aria-hidden="true"
                        />
                      </button>
                      <div className="flex flex-row text-white my-auto mx-2">
                        <span>1</span>
                        <span>/</span>
                        <span>5</span>
                      </div>
                      <button className="rounded-full relative bg-gray-800 text-gray-400 focus:outline-none opacity-40 p-1">
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon
                          className="h-5 w-5 text-gray-50"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <div className="flex flex-row space-x-2">
                      <button className="rounded-full relative text-gray-200 focus:outline-none">
                        <span className="sr-only">Prev</span>
                        <MagnifyingGlassPlusIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                      <button className="rounded-full relative text-gray-200 focus:outline-none">
                        <span className="sr-only">Next</span>
                        <MagnifyingGlassMinusIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 bg-white shadow-md shadow-slate-100 text-black">
                    <Document
                      file="/Keke.pdf" // This is a local pdf file that I placed in the public directory. it should come from the student's uploaded document
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page pageNumber={currentPage} scale={scale} />
                    </Document>
                  </div>
                </section>
              </div>

              <form className="lg:col-span-6 flex-auto h-full">
                <div className="flex flex-col flex-auto h-full">
                  <div className="flex overflow-scroll flex-col flex-auto flex-shrink-0 bg-white h-full">
                    <div className="flex flex-col h-full overflow-x-auto mb-4 mt-20">
                      <div className="flex flex-col h-full">
                        <div className="grid grid-cols-12 gap-y-2">
                          <div className="grid grid-cols-12 grid-rows-4 col-start-1 col-end-13 m-6 p-3 h-52 rounded-lg bg-gray-50 text-slate-600 font-light content-around">
                            <div className="col-span-2 row-span-2 h-20 w-20 flex-shrink-0 bg-pink-300 p-2 flex justify-center items-center rounded-full">
                              <img
                                src="/svgs/robot-face.svg"
                                className="h-14 w-14 text-gray-400"
                                alt=""
                              />
                            </div>
                            <div className="col-span-5 row-span-2 pl-5 pt-3">
                              <Text className="font-semibold">Bot Name</Text>
                              <Text>Flashcard Factory</Text>
                            </div>
                            <Text className="py-2 col-start-1 col-end-13 text-sm">
                              Nibh augue arcu congue gravida risus diam. Turpis
                              nulla ac urna elementum est enim mi bibendum
                              varius. Nunc urna maecenas sodales volutpat
                              ullamcorper, ilmora tun dun kabash yato.
                            </Text>
                          </div>

                          <div className="flex flex-col col-span-full px-3 py-1 h-24 rounded-lg justify-between ml-7 text-sm">
                            <Text className="">What do you need?</Text>
                            <div className="flex row-auto space-x-3">
                              <div className="flex flex-row space-x-2 border-gray-50 border-2 rounded-full py-2 px-3">
                                <img
                                  src="/svgs/summary.svg"
                                  className="h3 w3 text-gray-400"
                                  alt=""
                                />
                                <p>Summary</p>
                              </div>
                              <div className="flex flex-row space-x-2 border-gray-50 border-2 rounded-full py-2 px-3">
                                <img
                                  src="/svgs/flashcards.svg"
                                  className="h3 w3 text-gray-400"
                                  alt=""
                                />
                                <p>Flashcards</p>
                              </div>
                              <div className="flex flex-row space-x-2 border-gray-50 border-2 rounded-full py-2 px-3">
                                <img
                                  src="/svgs/quiz.svg"
                                  className="h3 w3 text-gray-400"
                                  alt=""
                                />
                                <Text>Quiz</Text>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col col-span-full px-3 py-1 h-36 rounded-lg justify-between ml-7 text-sm">
                            <Text className="">Try asking about?</Text>
                            <div className="flex flex-wrap">
                              {[...Array(4)].map((_, key) => {
                                return (
                                  <div
                                    key={key}
                                    className="border-gray-50 border-3 rounded-full py-2 px-3 mb-2 mx-1"
                                  >
                                    <Text>Suggested prompt</Text>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-[40%] w-full shadow-sm fixed z-50 border-t bg-gray-50 bottom-0 right-0 flex flex-row items-center h-16 px-4">
                  <div className="flex-grow ml-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Tell Shepherd what to do next"
                        className="flex w-full bg-white border-x-black rounded-full focus:outline-none pl-4 h-10 placeholder:text-xs"
                      />
                      <button className="absolute flex items-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600 pl-2">
                        <img alt="" src="/svgs/send.svg" className="w-9 h-9" />
                      </button>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md text-white px-4 py-2 flex-shrink-0">
                      <img
                        alt=""
                        src="/svgs/anti-clock.svg"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </section>
    </Layout>
  );
}
