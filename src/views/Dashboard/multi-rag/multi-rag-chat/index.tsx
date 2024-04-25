import { useParams } from 'react-router-dom';

function MultiRagChat() {
  const { docId } = useParams();
  return (
    <div className="bg-[#F9F9FB] w-full h-full overflow-hidden flex">
      <DocsList />
      <ChatArea />
      <UtilsAreas />
    </div>
  );
}

const DocsList = () => {
  return <div className="w-[16.97rem] h-full border"></div>;
};

const ChatArea = () => {
  return <div className="border flex-[1.5] h-full"></div>;
};

const UtilsAreas = () => {
  return <div className="border flex-1 h-full"></div>;
};

export default MultiRagChat;
