import { DotsHorizontal } from '../../../../../../../../components/icons';

const ListItem = ({ title }: { title: string }) => {
  if (!title) return null;
  return (
    <div className="flex p-2 w-full h-[36px] text-[#000000] leading-5 text-[12px] rounded-[8px] border truncate text-ellipsis gap-2 font-normal bg-[#F9F9FB] border-none px-4">
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

export default ListItem;
