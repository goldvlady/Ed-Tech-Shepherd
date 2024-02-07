import { DotsHorizontal } from '../../../../../../components/icons';

function ChatList({ conversations }: { conversations: any[] }) {
  return (
    <div className="w-full flex flex-col gap-2 no-scrollbar">
      {conversations.map((conversation) => {
        return <ListItem title={conversation.title} key={conversation.id} />;
      })}
    </div>
  );
}

// const ListGroup = ({ children }: { children: React.ReactNode }) => {};

const ListItem = ({ title }: { title: string }) => {
  if (!title) return null;
  return (
    <div className="flex p-2 w-full h-[36px] text-[#000000] leading-5 text-[12px] rounded-[8px] border truncate text-ellipsis gap-2 font-normal bg-[#F9F9FB] border-none">
      <span className="flex-1 text-ellipsis truncate">{title}</span>
      <span
        role="button"
        className=" w-[5%] h-full flex items-center justify-center"
      >
        <DotsHorizontal className="font-bold" />
      </span>
    </div>
  );
};

export default ChatList;
