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
      <div className="flex-1 h-full mt-10">PDF Viewer</div>
      <ChatArea conversationID={docId} />
      <div className="w-[15rem] border h-full"></div>
    </div>
  );
}

export default MultiRagChat;
