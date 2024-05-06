import { useParams } from 'react-router-dom';
import DocsThumbnailList from '../_components/docs-thumbnail-list';
import ChatArea from '../_components/chat-area';
import LearningResourcesSection from '../_components/learning-resources-section';
import PDFViewer from '../_components/pdf-viewer';
import { useState } from 'react';

function MultiRagChat() {
  const { docId } = useParams();
  const [selectedDocumentID, setSelectedDocumentID] = useState({
    id: '',
    name: ''
  });

  const [highlightedDocumentPageIndex, setHighlightedDocumentPageIndex] =
    useState(0);

  const getTextForSummary = (text: string) => {
    alert('Summary: ' + text);
  };

  const getTextForExplaination = (text: string) => {
    alert('Explain: ' + text);
  };
  const getTextForTranslation = (text: string) => {
    alert('Translate: ' + text);
  };

  return (
    <div className="bg-[#F9F9FB] w-full h-full overflow-hidden flex">
      <DocsThumbnailList
        conversationID={docId}
        setSelectedDocumentID={setSelectedDocumentID}
        selectedDocumentID={selectedDocumentID}
      />
      <PDFViewer
        selectedDocumentID={selectedDocumentID}
        getTextForSummary={getTextForSummary}
        getTextForExplaination={getTextForExplaination}
        getTextForTranslation={getTextForTranslation}
        highlightedDocumentPageIndex={highlightedDocumentPageIndex}
      />
      <ChatArea conversationID={docId} />
      <LearningResourcesSection
        conversationID={docId}
        selectedDocumentID={selectedDocumentID.id}
        setHighlightedDocumentPageIndex={setHighlightedDocumentPageIndex}
      />
    </div>
  );
}

export default MultiRagChat;
