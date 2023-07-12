import React, { Component } from 'react';
import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  AreaHighlight,
  Popup
} from 'react-pdf-highlighter';
import type { IHighlight, NewHighlight } from 'react-pdf-highlighter';

const HighlightPopup = ({
  comment
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const TempPDFViewer = ({ url }: { url: any }) => {
  return (
    <div>
      <PdfLoader url={url} beforeLoad={<div></div>}>
        {(pdfDocument) => <div></div>}
      </PdfLoader>
    </div>
  );
};

export default TempPDFViewer;
