import { PdfViewer } from "../components";
import { Text } from "@chakra-ui/react";
import React from "react";

export default function Notes() {
  return (
    <section className="divide-y max-w-screen-xl mx-auto pb-6 lg:pb-16">
      <main className="relative">
        <div className="bg-white overflow-hidden">
          <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
            <PdfViewer pathToPdf="/Keke.pdf" />

            <form className="lg:col-span-4 flex-auto h-full">
              <div className="flex flex-col flex-auto h-full">
                <div className="flex overflow-scroll flex-col flex-auto flex-shrink-0 bg-white h-full">
                  <div className="flex flex-col h-full overflow-x-auto mb-4">
                    <div className="flex flex-col h-full">
                      <div className="grid grid-cols-12 gap-y-2">
                        <div className="grid grid-cols-12 grid-rows-4 col-start-1 col-end-13 m-6 p-3 h-52 rounded-lg bg-gray-50 text-slate-600 font-light content-around">
                          <div className="col-span-2 row-span-2 h-16 w-16 flex-shrink-0 bg-pink-300 p-2 flex justify-center items-center rounded-full">
                            <img
                              src="/svgs/robot-face.svg"
                              className="h-10 w-10 text-gray-400"
                              alt=""
                            />
                          </div>
                          <div className="col-span-5 row-span-2 pl-5 pt-3">
                            <Text className="font-semibold">Bot Name</Text>
                            <Text>Flashcard Factory</Text>
                          </div>
                          <Text className="py-2 col-start-1 col-end-13 text-sm">
                            Nibh augue arcu congue gravida risus diam. Turpis
                            nulla ac urna elementum est enim mi bibendum varius.
                            Nunc urna maecenas sodales volutpat ullamcorper,
                            ilmora tun dun kabash yato.
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

              <div className="md:w-[30%] w-full shadow-sm fixed z-50 border-t bg-gray-50 bottom-0 right-0 flex flex-row items-center h-16 px-4">
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
  );
}
