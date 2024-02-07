import { Link } from 'react-router-dom';
import { DotsHorizontal } from '../../../../../../../../components/icons';

const ListItem = ({ id, title }: { id: string; title: string }) => {
  if (!title) return null;
  return (
    <div className="flex w-full h-[36px] text-[#000000] leading-5 text-[12px] rounded-[8px] border truncate text-ellipsis gap-2 font-normal bg-[#F9F9FB] border-none pr-2">
      <Link to={`/dashboard/ace-homework/${id}`} className="w-full py-2 pl-2">
        <span className="flex-1 text-ellipsis truncate">{title}</span>
      </Link>
      <button
        role="button"
        className=" w-[5%] h-full flex items-center justify-center"
      >
        <DotsHorizontal className="font-bold" />
      </button>
    </div>
  );
};

export default ListItem;
