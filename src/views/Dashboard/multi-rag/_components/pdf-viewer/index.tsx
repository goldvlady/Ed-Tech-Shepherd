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
import ApiService from '../../../../../services/ApiService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReloadIcon } from '@radix-ui/react-icons';

function PDFViewer({
  selectedDocumentID
}: {
  selectedDocumentID: {
    id: string;
    name: string;
  };
}) {
  const queryClient = useQueryClient();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { mutate, isPending: isSavingHighlightText } = useMutation({
    mutationFn: (data: any) =>
      ApiService.multiDocHighlight(data).then((res) => res.json())
  });

  const { data: highlightPositions } = useQuery({
    queryKey: ['documentHighlight', selectedDocumentID.id],
    queryFn: () =>
      ApiService.getMultiDocHighlight(selectedDocumentID.id).then((res) =>
        res.json()
      ),
    select(data) {
      if (data.status === 'success') {
        const positions = data.data.flatMap((item) => {
          return JSON.parse(item.highlight).position;
        });
        return [].concat(...positions);
      } else {
        return [];
      }
    }
  });

  console.log('highlighted text', highlightPositions);

  const pdfURL = `https://shepherd-document-upload.s3.us-east-2.amazonaws.com/${selectedDocumentID.name}`;

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
      {highlightPositions
        ?.filter((area) => area.pageIndex === props.pageIndex)
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
            disabled={isSavingHighlightText}
            onClick={() => {
              mutate(
                {
                  documentId: selectedDocumentID.id,
                  highlight: {
                    name: props.selectedText,
                    position: props.highlightAreas
                  }
                },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: ['documentHighlight', selectedDocumentID.id]
                    });
                  }
                }
              );
              return null;
            }}
          >
            {isSavingHighlightText && (
              <ReloadIcon className="animate-spin mr-2" />
            )}

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
              {selectedDocumentID.name && (
                <Viewer
                  fileUrl={pdfURL}
                  defaultScale={SpecialZoomLevel.PageFit}
                  viewMode={ViewMode.SinglePage}
                  plugins={[
                    pageNavigationPluginInstance,
                    highlightPluginInstance
                  ]}
                  onDocumentLoad={(e) => {
                    setTotalPages(e.doc.numPages);
                  }}
                  scrollMode={ScrollMode.Page}
                  onPageChange={(e) => {
                    setCurrentPage(e.currentPage);
                  }}
                />
              )}
            </div>
          </div>
        </Worker>
      </div>
    </div>
  );
}

export default PDFViewer;
