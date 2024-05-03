import { Worker } from '@react-pdf-viewer/core';
import {
  Viewer,
  Position,
  PrimaryButton,
  Tooltip,
  Icon,
  MinimalButton,
  SpecialZoomLevel,
  ViewMode,
  ScrollMode
} from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {
  highlightPlugin,
  HighlightArea,
  MessageIcon,
  RenderHighlightContentProps,
  RenderHighlightTargetProps,
  RenderHighlightsProps,
  Trigger
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
  PlusIcon,
  SaveIcon,
  SearchIcon
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../../../components/ui/button';

function PDFViewer() {
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [areas, setAreas] = useState([
    {
      pageIndex: 1,
      height: 1.55401,
      width: 28.1674,
      left: 27.5399,
      top: 15.0772
    },
    {
      pageIndex: 1,
      height: 1.32637,
      width: 37.477,
      left: 55.7062,
      top: 15.2715
    },
    {
      pageIndex: 1,
      height: 1.55401,
      width: 28.7437,
      left: 16.3638,
      top: 16.6616
    }
  ]);

  const incrementPage = () => {
    const { jumpToPreviousPage } = pageNavigationPluginInstance;
    jumpToPreviousPage();
  };

  const decrementPage = () => {
    const { jumpToNextPage } = pageNavigationPluginInstance;
    jumpToNextPage();
  };

  const renderHighlights = (props: RenderHighlightsProps) => (
    <div>
      {areas
        .filter((area) => area.pageIndex === props.pageIndex)
        .map((area, idx) => (
          <div
            key={idx}
            className="highlight-area"
            style={Object.assign(
              {},
              {
                background: 'orange',
                opacity: 0.4
              },
              props.getCssProperties(area, props.rotation)
            )}
          />
        ))}
    </div>
  );

  const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
    <div
      style={{
        background: '#eee',
        display: 'flex',
        position: 'absolute',
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: 'translate(0, 8px)',
        zIndex: 1,
        borderRadius: 8
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button
            onClick={() => {
              console.log(
                'highted text',
                props.selectedText,
                props.highlightAreas
              );
              return null;
            }}
          >
            <SaveIcon />
          </Button>
        }
        content={() => <div style={{ width: '100px' }}>Save Highlight</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    // renderHighlightContent,
    renderHighlights
  });
  //   const { jumpToHighlightArea } = highlightPluginInstance;

  return (
    <div className="flex-[1.5] h-full mt-10 rounded-md">
      <header className="pdf-header p-[0.87rem] w-full bg-white rounded-[10px] flex justify-between items-center">
        <div className="flex items-center gap-1">
          <SearchIcon className="w-[12px]" />
          <div className="flex items-center">
            <ChevronUpIcon
              className="cursor-pointer w-[12px]"
              onClick={incrementPage}
            />
            <div className="w-[1.8rem] h-[0.75rem] rounded-[5px] shadow-inner flex items-center justify-center">
              <p className="text-[0.5rem] pt-0.5">{currentPage + 1}</p>
            </div>
            <p className="text-[#585F68] text-[0.5rem] font-normal mx-2 pt-0.5">
              {totalPages}
            </p>
            <ChevronDownIcon
              className="cursor-pointer w-[12px]"
              onClick={() => {
                decrementPage();
              }}
            />
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
            <div className="h-full w-full no-scrollbar">
              <Viewer
                fileUrl={dummyPDF}
                defaultScale={SpecialZoomLevel.PageFit}
                viewMode={ViewMode.SinglePage}
                plugins={[
                  pageNavigationPluginInstance,
                  highlightPluginInstance
                ]}
                onDocumentLoad={(e) => {
                  console.log('document loaded', e);
                  setTotalPages(e.doc.numPages);
                }}
                scrollMode={ScrollMode.Page}
                onPageChange={(e) => {
                  setCurrentPage(e.currentPage);
                }}
              />
            </div>
          </div>
        </Worker>
      </div>
    </div>
  );
}

export default PDFViewer;
