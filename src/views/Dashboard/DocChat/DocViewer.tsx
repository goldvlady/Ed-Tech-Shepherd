import { SelectedNoteModal } from '../../../components';
import { snip } from '../../../helpers/file.helpers';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { highlightPlugin } from '@react-pdf-viewer/highlight';
// Import styles
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import React, { useState } from 'react';

function DocViewer(props) {
  const {
    pdfLink,
    pdfName
    //   documentId={documentId}
    //   setLoading={setLoading}
    //   setHightlightedText={setHightlightedText}
  } = props;
  const [popUpNotesModal, setPopUpNotesModal] = useState(false);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    setInitialTab: () => Promise.resolve(0)
  });

  const highlightPluginInstance = highlightPlugin();
  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div
          style={{ display: 'flex', position: 'fixed' }}
          className="lg:col-span-6 flex-auto h-full w-1/2"
        >
          <div style={{ height: '100vh', width: '87%', position: 'relative' }}>
            <div
              className="absolute z-10 font-bold max-h-max max-w-max text-sm right-60 top-10 p-2 bg-green-100 rounded-xl m-1 hover:text-blue-600 hover:cursor-pointer hover:bg-yellow-100"
              onClick={() => setPopUpNotesModal(true)}
            >
              {snip(pdfName, 40)}
            </div>
            <Viewer fileUrl={pdfLink} plugins={[defaultLayoutPluginInstance]} />
          </div>
        </div>
      </Worker>
    </>
  );
}

export default DocViewer;
