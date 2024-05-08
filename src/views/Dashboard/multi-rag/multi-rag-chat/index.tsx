import { useParams } from 'react-router-dom';
import DocsThumbnailList from '../_components/docs-thumbnail-list';
import ChatArea from '../_components/chat-area';
import LearningResourcesSection from '../_components/learning-resources-section';
import PDFViewer from '../_components/pdf-viewer';
import { useState } from 'react';
import useUserStore from '../../../../state/userStore';

function MultiRagChat() {
  const { docId } = useParams();
  const { user } = useUserStore();
  const [selectedDocumentID, setSelectedDocumentID] = useState({
    id: '',
    name: ''
  });

  const [userSelectedText, setUserSelected] = useState<{
    purpose: 'summary' | 'explain' | 'translate' | null;
    text: string;
  }>({
    purpose: null,
    text: ''
  });

  const [highlightedDocumentPageIndex, setHighlightedDocumentPageIndex] =
    useState(0);

  const getTextForSummary = (text: string) => {
    setUserSelected({
      purpose: 'summary',
      text
    });
  };

  const getTextForExplaination = (text: string) => {
    setUserSelected({
      purpose: 'explain',
      text
    });
  };
  const getTextForTranslation = (text: string) => {
    setUserSelected({
      purpose: 'translate',
      text
    });
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
      <ChatArea
        conversationID={docId}
        studentId={user._id}
        userSelectedText={userSelectedText}
      />
      <LearningResourcesSection
        conversationID={docId}
        selectedDocumentID={selectedDocumentID.id}
        setHighlightedDocumentPageIndex={setHighlightedDocumentPageIndex}
      />
    </div>
  );
}

export default MultiRagChat;
