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
import { searchPlugin } from '@react-pdf-viewer/search';

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

import { cn } from '../../../../../library/utils';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Minus,
  Plus
  // SearchIcon
} from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import ApiService from '../../../../../services/ApiService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FileTextIcon,
  InfoCircledIcon,
  Pencil1Icon,
  ReloadIcon,
  TextIcon
} from '@radix-ui/react-icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../../components/ui/popover';

function PDFViewer({
  selectedDocumentID,
  getTextForSummary,
  getTextForExplaination,
  getTextForTranslation,
  highlightedDocumentPageIndex
}: {
  selectedDocumentID: {
    id: string;
    name: string;
  };
  getTextForSummary: (text: string) => void;
  getTextForExplaination: (text: string) => void;
  getTextForTranslation: (text: string) => void;
  highlightedDocumentPageIndex?: number;
}) {
  const queryClient = useQueryClient();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const searchPluginInstance = searchPlugin();

  const zoomPluginInstance = zoomPlugin();
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

  const { ZoomIn, ZoomOut } = zoomPluginInstance;
  const { ShowSearchPopoverButton } = searchPluginInstance;

  const pdfURL = `https://shepherd-document-upload.s3.us-east-2.amazonaws.com/${selectedDocumentID.name}`;

  const incrementPage = () => {
    const { jumpToPreviousPage } = pageNavigationPluginInstance;
    jumpToPreviousPage();
  };

  const decrementPage = () => {
    const { jumpToNextPage } = pageNavigationPluginInstance;
    jumpToNextPage();
  };

  useEffect(() => {
    console.log('highlightedDocumentPageIndex', highlightedDocumentPageIndex);
    const { jumpToPage } = pageNavigationPluginInstance;
    jumpToPage(highlightedDocumentPageIndex);
  }, [highlightedDocumentPageIndex]);

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
    <RenderHighlightTarget
      queryClient={queryClient}
      mutate={mutate}
      isSavingHighlightText={isSavingHighlightText}
      selectedDocumentID={selectedDocumentID}
      getTextForSummary={getTextForSummary}
      getTextForExplaination={getTextForExplaination}
      getTextForTranslation={getTextForTranslation}
      {...props}
    />
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
          <ShowSearchPopoverButton />
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
          <ZoomOut />
          <ZoomIn />
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
            <div className="h-full w-full no-scrollbar [&_div]:no-scrollbar relative">
              {selectedDocumentID.name && (
                <Viewer
                  fileUrl={pdfURL}
                  defaultScale={SpecialZoomLevel.PageFit}
                  viewMode={ViewMode.SinglePage}
                  plugins={[
                    pageNavigationPluginInstance,
                    highlightPluginInstance,
                    zoomPluginInstance,
                    searchPluginInstance
                  ]}
                  onDocumentLoad={(e) => {
                    setTotalPages(e.doc.numPages);
                  }}
                  // scrollMode={ScrollMode.Page}
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

const RenderHighlightTarget = ({
  queryClient,
  selectedDocumentID,
  mutate,
  isSavingHighlightText,
  getTextForSummary,
  getTextForExplaination,
  getTextForTranslation,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  console.log('Props', props);
  const MenuItem = ({
    title,
    icon,
    onClick,
    disabled
  }: {
    title: string;
    icon: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => {
    return (
      <div
        onClick={onClick}
        className={cn(
          'p-2 flex items-center  gap-1 cursor-pointer hover:bg-slate-100',
          {
            'opacity-50 pointer-events-none hover:bg-slate-50': disabled
          }
        )}
        role="menuitem"
      >
        {icon}
        <span className="text-xs">{title}</span>
      </div>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 200);
  }, []);

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'bg-transparent opacity-0 pointer-events-none absolute'
          )}
          style={{
            top: `${Math.floor(props.selectionRegion.top - 5)}%`,
            left: `${Math.floor(props.selectionRegion.left)}%`
          }}
        >
          .
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-transparent shadow-none border-none w-0 h-0">
        <div
          className="bg-white flex absolute z-[1] rounded-xl min-w-36 shadow-xl overflow-hidden"
          style={{
            left: `${props.selectionRegion.left}%`,
            top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
            transform: 'translate(0, 8px)'
          }}
        >
          <div className="w-full h-full">
            <MenuItem
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
              }}
              title="Highlight"
              icon={<Pencil1Icon className="w-4 mr-1" />}
            />
            <hr />
            <MenuItem
              onClick={() => {
                getTextForSummary(props.selectedText);
                props.toggle();
              }}
              title="Summarize"
              icon={<FileTextIcon className="w-4 mr-1" />}
            />
            <hr />
            <MenuItem
              onClick={() => {
                getTextForExplaination(props.selectedText);
                props.toggle();
              }}
              title="Explain"
              icon={<InfoCircledIcon className="w-4 mr-1 text-lg" />}
            />
            <hr />
            <MenuItem
              onClick={() => {
                getTextForTranslation(props.selectedText);
                props.toggle();
              }}
              title="Translate"
              icon={<TextIcon className="w-4 mr-1 text-lg" />}
            />
          </div>
          {/* <Button
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
        {isSavingHighlightText && <ReloadIcon className="animate-spin mr-2" />}

        <SaveIcon />
      </Button> */}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PDFViewer;
