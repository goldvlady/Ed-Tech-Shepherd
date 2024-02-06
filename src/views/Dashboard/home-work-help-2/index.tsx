import ChatHistory from './_components/chat-history';

function HomeWorkHelp2() {
  return (
    <div className="w-full h-full flex gap-2">
      <div className="h-full max-h-screen overflow-y-scroll flex-[3.5] hidden md:block min-w-[15em] border-r">
        <ChatHistory />
      </div>
      <div className="h-full flex-[6.5]">
        <div>Chat Input</div>
        <div>Chat History</div>
      </div>
    </div>
  );
}

export default HomeWorkHelp2;
