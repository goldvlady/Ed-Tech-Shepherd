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
      <Tools />
    </div>
  );
}

const Tools = () => {
  return (
    <div className="w-[15rem] h-full flex justify-end p-4">
      <div className="w-[114px] h-[30px] rounded-md shadow-md bg-white flex justify-center items-center cursor-pointer">
        <span className="text-xs inline-block">Quick Action</span>
      </div>
    </div>
  );
};

export default MultiRagChat;
