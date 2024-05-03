import { useParams } from 'react-router-dom';
import DocsThumbnailList from '../_components/docs-thumbnail-list';
import ChatArea from '../_components/chat-area';
import LearningResourcesSection from '../_components/learning-resources-section';
import PDFViewer from '../_components/pdf-viewer';

function MultiRagChat() {
  const { docId } = useParams();
  console.log('MultiRagChat', docId);
  return (
    <div className="bg-[#F9F9FB] w-full h-full overflow-hidden flex">
      <DocsThumbnailList conversationID={docId} />
      <PDFViewer />
      <ChatArea conversationID={docId} />
      <LearningResourcesSection conversationID={docId} />
    </div>
  );
}

export default MultiRagChat;
