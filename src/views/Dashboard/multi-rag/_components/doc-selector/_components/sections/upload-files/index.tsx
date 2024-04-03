import { Button } from '../../../../../../../../components/ui/button';

function UploadFiles() {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="flex justify-center items-center flex-1">
        <div className="w-[43rem] h-[15.6rem] bg-[#F9F9FB] rounded-[15px]"></div>
      </div>
      <div className="w-full h-[4.5rem] pr-[3.1rem] py-[1rem] flex justify-end items-center">
        <Button className="" disabled>
          New Chat
        </Button>
      </div>
    </div>
  );
}

export default UploadFiles;
