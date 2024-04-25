import { ChevronRightIcon } from '@radix-ui/react-icons';

function BreadCrumb() {
  return (
    <div className="h-[1.56rem] shadow-md bg-white rounded-[10px] flex justify-start items-center px-[0.87rem] select-none">
      <span className="text-[0.62rem] flex  whitespace-nowrap w-full text-ellipsis overflow-hidden items-center">
        <span className="text-[#969CA6]">Doc Chat</span>
        <ChevronRightIcon className="text-[#969CA6] h-[10px]" />
        <span className="text-[#585F68]">Relativity Theory</span>
      </span>
    </div>
  );
}

export default BreadCrumb;
