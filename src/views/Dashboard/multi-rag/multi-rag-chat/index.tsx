import { useParams } from 'react-router-dom';
import DocsThumbnailList from '../_components/docs-thumbnail-list';
import ChatArea from '../_components/chat-area';
import LearningResourcesSection from '../_components/learning-resources-section';

function MultiRagChat() {
  const { docId } = useParams();
  return (
    <div className="bg-[#F9F9FB] w-full h-full overflow-hidden flex">
      <DocsThumbnailList />
      <ChatArea />
      <LearningResourcesSection />
    </div>
  );
}

export default MultiRagChat;
