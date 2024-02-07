import { Link, useParams } from 'react-router-dom';
import Options from './_components/options';

const ListItem = ({ id, title }: { id: string; title: string }) => {
  const { id: conversationId } = useParams();
  if (!title) return null;
  return (
    <div
      className={`flex w-full h-[36px] text-[#000000] leading-5 text-[12px] rounded-[8px] border truncate text-ellipsis gap-2 font-normal bg-[#F9F9FB] border-none pr-2 ${
        id === conversationId ? 'bg-[#E5E5E5]' : ''
      } hover:bg-[#E5E5E5] hover:cursor-pointer hover:shadow-md hover:z-10 hover:transition-all hover:duration-300 hover:ease-in-out`}
    >
      <Link to={`/dashboard/ace-homework/${id}`} className="w-full py-2 pl-2">
        <span className="flex-1 text-ellipsis truncate">{title}</span>
      </Link>
      <Options />
    </div>
  );
};

export default ListItem;
