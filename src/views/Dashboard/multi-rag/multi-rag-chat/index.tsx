import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DocsThumbnailList from '../_components/docs-thumbnail-list';
import ChatArea from '../_components/chat-area';
import LearningResourcesSection from '../_components/learning-resources-section';
import PDFViewer from '../_components/pdf-viewer';
import { useEffect, useState } from 'react';
import useUserStore from '../../../../state/userStore';
import { Sheet, SheetTrigger } from '../../../../components/ui/sheet';
import { Button } from '../../../../components/ui/button';
import PlansModal from '../../../../components/PlansModal';

function MultiRagChat() {
  const { docId } = useParams();
  const { user } = useUserStore();
  const [selectedDocumentID, setSelectedDocumentID] = useState({
    id: '',
    name: ''
  });
  const [searchParams] = useSearchParams();
  const apiKey = searchParams.get('apiKey');

  const [userSelectedText, setUserSelected] = useState<{
    purpose: 'summary' | 'explain' | 'translate' | null;
    text: string;
  }>({
    purpose: null,
    text: ''
  });
  const navigate = useNavigate();
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  useEffect(() => {
    if (!user && !apiKey) {
      navigate('/signup');
    }
    if (apiKey) {
      const inputElements = document.querySelectorAll('textarea');

      // Disable each input element on the page
      inputElements.forEach((input) => {
        input.disabled = true;
      });
      window.addEventListener('click', () => {
        setTogglePlansModal(true);
      });
    }
  }, [user, apiKey, navigate]);
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
    <div className="bg-[#F9F9FB] w-full h-full overflow-hidden flex relative">
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
        user={user}
      />
      <LearningResourcesSection
        user={user}
        conversationID={docId}
        selectedDocumentID={selectedDocumentID.id}
        setHighlightedDocumentPageIndex={setHighlightedDocumentPageIndex}
      />
      {togglePlansModal && (
        <PlansModal
          togglePlansModal={togglePlansModal}
          setTogglePlansModal={setTogglePlansModal}
        />
      )}
    </div>
  );
}

export default MultiRagChat;
