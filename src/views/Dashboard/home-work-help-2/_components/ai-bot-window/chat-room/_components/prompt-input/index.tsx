import { Button } from '@chakra-ui/button';
import {
  RightArrowIcon,
  ShareIcon
} from '../../../../../../../../components/icons';

const PromptInput = () => {
  return (
    <div className="w-full h-full flex gap-5 flex-col items-center justify-center max-w-[600px]">
      <div className="find-tutor-button flex justify-end w-full">
        <Button
          variant="outline"
          borderRadius="full"
          size="sm"
          style={{
            border: '1px solid #207DF7',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            color: '#207DF7'
          }}
        >
          Find a tutor
        </Button>
      </div>
      <div className="input-box h-[85px] flex gap-2 flex-col bg-white rounded-md shadow-md w-full px-2 pb-2">
        <div className="input-element w-full flex-1 mt-1.5">
          <input
            type="text"
            className="w-full input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:font-normal text-[#6E7682] font-normal pb-0"
            placeholder="How can Shepherd help with your homework?"
          />
        </div>
        <div className="file-uploader-submit-section flex-1 flex justify-between px-2">
          <div className="file-uploader flex gap-[1px] mb-1">
            <button className="flex items-center justify-center w-[28px] h-[28px] rounded-tl-md rounded-bl-md bg-[#F9F9FB]">
              <ShareIcon />
            </button>
            {/* <span className="text-[#969CA6] bg-[#F9F9FB] font-normal h-[28px] text-[10px] flex items-center px-2">
                <span>File.txt</span>
              </span> */}
          </div>
          <div className="submit-button">
            <button className="w-[28px] h-[28px] rounded-full bg-[#207DF7] flex items-center justify-center">
              <RightArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
