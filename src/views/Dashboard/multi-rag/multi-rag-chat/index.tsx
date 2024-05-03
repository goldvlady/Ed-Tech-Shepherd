import { useParams } from 'react-router-dom';
import DocsThumbnailList from '../_components/docs-thumbnail-list';
import ChatArea from '../_components/chat-area';
import LearningResourcesSection from '../_components/learning-resources-section';

function MultiRagChat() {
  const { docId } = useParams();
  console.log('MultiRagChat', docId);
  return (
    <div className="bg-[#F9F9FB] w-full h-full overflow-hidden flex">
      <DocsThumbnailList conversationID={docId} />
      <div className="flex-1 h-full mt-10 border rounded-md">
        <span className="text-xs inline-block w-full text-center">
          PDF Viewer
        </span>
      </div>
      <ChatArea conversationID={docId} />
      <LearningResourcesSection conversationID={docId} />
    </div>
  );
}

export default MultiRagChat;
