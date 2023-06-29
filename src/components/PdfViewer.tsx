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
import React, { useState, Fragment } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "tailwindcss/tailwind.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({ documentUrl }: { documentUrl: string }) => {
  const [, setUploadDocumentModal] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale(scale + 0.2); // Increase scale by 0.2
  };

  const zoomOut = () => {
    if (scale > 0.2) {
      setScale(scale - 0.2); // Decrease scale by 0.2
    }
  };

  return (
    <div className="pb-2 lg:col-span-8">
      <div className="flex flex-row justify-between mx-2 my-5">
        <Text className="align-middle self-center h-full font-bold">
          Documenttitle.pdf
        </Text>
        <div className="flex flex-row justify-between space-x-2">
          <button className="rounded-full relative bg-white p-2 text-gray-400 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-50">
            <span className="sr-only">Pin</span>
            <img src="/svgs/pin.svg" className="h-7 w-7 text-gray-400" alt="" />
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
              <Menu.Items className="absolute space-y-3 p-2 right-0 z-10 mt-2.5 w-[15rem] origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none">
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
                      <h4 className="text-sm text-secondaryGray font-medium">
                        Add tag
                      </h4>
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
                      <h4 className="text-sm text-secondaryGray font-medium">
                        Download
                      </h4>
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
                    <h4 className="text-sm text-error font-medium">Delete</h4>
                  </div>
                </button>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <section className="ml-5">
        <div className="flex flex-row justify-between bg-gray-500 p-7">
          <button className="rounded-full relative text-gray-400 focus:outline-none">
            <span className="sr-only">Write</span>
            <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex flex-row content-center">
            <button
              onClick={goToPrevPage}
              className="rounded-full relative bg-gray-800 text-gray-400 focus:outline-none opacity-40 p-1"
            >
              <span className="sr-only">Prev</span>
              <ChevronLeftIcon
                className="h-5 w-5 text-gray-50"
                aria-hidden="true"
              />
            </button>
            <div className="flex flex-row text-white my-auto mx-2">
              <span>{currentPage}</span>
              <span>/</span>
              <span>{numPages}</span>
            </div>
            <button
              onClick={goToNextPage}
              className="rounded-full relative bg-gray-800 text-gray-400 focus:outline-none opacity-40 p-1"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon
                className="h-5 w-5 text-gray-50"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="flex flex-row space-x-2">
            <button
              onClick={zoomIn}
              className="rounded-full relative text-gray-200 focus:outline-none"
            >
              <span className="sr-only">Prev</span>
              <MagnifyingGlassPlusIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              onClick={zoomOut}
              className="rounded-full relative text-gray-200 focus:outline-none"
            >
              <span className="sr-only">Next</span>
              <MagnifyingGlassMinusIcon
                className="h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <div className="p-6 bg-white shadow-lg shadow-slate-200 text-black">
          <Document
            // @ts-ignore
            file={{
              url: `https://of-cors-not.herokuapp.com/fetch/${documentUrl}`,
            }}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={currentPage} width={300} scale={1.0} />
          </Document>
        </div>
      </section>
    </div>
  );
};

export default PDFViewer;
