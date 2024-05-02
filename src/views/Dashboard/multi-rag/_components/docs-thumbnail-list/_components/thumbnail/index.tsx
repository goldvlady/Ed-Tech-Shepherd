import { DotsHorizontalIcon } from '@radix-ui/react-icons';

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  } else {
    return text;
  }
}

function Thumbnail({ data }: { data: any }) {
  return (
    <div className="border h-[10.31rem] w-[10.31rem] rounded-[10px] bg-white relative p-[0.68rem] flex items-end">
      <div className="w-[1.87rem] h-[1.87rem] absolute rounded-full bg-[#F9F9FB] top-0 right-0 m-[0.68rem] flex justify-center items-center cursor-pointer">
        <DotsHorizontalIcon />
      </div>
      <p className="text-[#585F68] text-[10px]">
        {truncateText(data.collection_name, 55)}
      </p>
    </div>
  );
}

export default Thumbnail;
