import { Worker } from '@react-pdf-viewer/core';
import {
  Viewer,
  Position,
  PrimaryButton,
  Tooltip,
  Icon,
  MinimalButton
} from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {
  highlightPlugin,
  HighlightArea,
  MessageIcon,
  RenderHighlightContentProps,
  RenderHighlightTargetProps,
  RenderHighlightsProps
} from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
// Import styles
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import {
  NextIcon,
  PreviousIcon,
  RenderSearchProps,
  searchPlugin
} from '@react-pdf-viewer/search';
import type {
  ToolbarProps,
  ToolbarSlot,
  TransformToolbarSlot
} from '@react-pdf-viewer/toolbar';
import {
  RenderCurrentScaleProps,
  RenderZoomInProps,
  RenderZoomOutProps,
  zoomPlugin
} from '@react-pdf-viewer/zoom';

import dummyPDF from './dummy.pdf';
import { cn } from '../../../../../library/utils';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Minus,
  Plus,
  SearchIcon
} from 'lucide-react';

function PDFViewer() {
  return (
    <div className="flex-[1] h-full mt-10 rounded-md">
      <header className="pdf-header p-[0.87rem] w-full bg-white rounded-[10px] flex justify-between items-center">
        <div className="flex items-center gap-1">
          <SearchIcon className="w-[12px]" />
          <div className="flex items-center">
            <ChevronUpIcon className="cursor-pointer w-[12px]" />
            <div className="w-[1.8rem] h-[0.75rem] rounded-[5px] shadow-inner flex items-center justify-center">
              <p className="text-[0.5rem] pt-0.5">1</p>
            </div>
            <p className="text-[#585F68] text-[0.5rem] font-normal mx-2 pt-0.5">
              165
            </p>
            <ChevronDownIcon className="cursor-pointer w-[12px]" />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Minus className="w-[12px] cursor-pointer" />
          <Plus className="w-[12px] cursor-pointer" />
        </div>
      </header>
      <div className="mt-[2rem] rounded-[20px] h-[75vh] w-full overflow-hidden">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div
            // style={{ display: 'flex', position: 'fixed' }}
            className={cn('lg:col-span-6 flex-auto h-full flex', {
              fixed: false,
              'w-1/2': false
            })}
          >
            <div className="h-full w-full">
              <Viewer fileUrl={dummyPDF} />
            </div>
          </div>
        </Worker>
      </div>
    </div>
  );
}

export default PDFViewer;
