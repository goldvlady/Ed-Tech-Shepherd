import { UploadIcon } from '@radix-ui/react-icons';
import { Button } from '../../../../../../../../components/ui/button';

function UploadFiles() {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="cc flex-1">
        <div className="w-[43rem] h-[15.6rem] bg-[#F9F9FB] rounded-[15px] cc">
          <div className="w-[53%] h-[50%] cc flex-col">
            <div className="icon mx-auto">
              <UploadIcon className="w-[3.81rem] h-[3.81rem]" />
            </div>
            <div className="label mt-[5px]">
              <span className="text-lg font-medium text-[#212224]">
                Drag and Drop or{' '}
                <span className="text-[#207DF7]">Browse files</span>
              </span>
            </div>
            <p className="text-[0.93rem] whitespace-nowrap text-[#585F68] mt-[0.1rem]">
              Shepherd supports{' '}
              <span className="font-medium">.pdf, .txt, .doc</span> document
              formats
            </p>
          </div>
        </div>
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
