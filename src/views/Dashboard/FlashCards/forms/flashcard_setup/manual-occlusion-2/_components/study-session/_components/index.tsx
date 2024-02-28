import { useEffect, useState } from 'react';
import { Button } from '../../../../../../../../../components/ui/button';
import {
  Dialog,
  DialogContent
} from '../../../../../../../../../components/ui/dialog';

function OccResultsDialog({
  open,
  close,
  score
}: {
  open: boolean;
  close: () => void;
  score: {
    right: number;
    wrong: number;
    notRemembered: number;
  };
}) {
  const [{ notRemembered, right, wrong }, setCurrentScore] = useState(score);

  useEffect(() => {
    const dummyScore = { ...score };
    setCurrentScore({
      notRemembered:
        (dummyScore.notRemembered /
          (dummyScore.notRemembered + dummyScore.right + dummyScore.wrong)) *
        100,
      wrong:
        (dummyScore.wrong /
          (dummyScore.notRemembered + dummyScore.right + dummyScore.wrong)) *
        100,
      right:
        (dummyScore.right /
          (dummyScore.notRemembered + dummyScore.right + dummyScore.wrong)) *
        100
    });
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent className="bg-white w-[740px] h-[495px] p-0 flex flex-col items-stretch gap-0 max-w-none overflow-visible">
        <Button
          onClick={close}
          className="absolute w-[30px] h-[30px] flex justify-center items-center bg-white rounded-full right-[-2.5rem] top-[-2.5rem] overflow-hidden"
        >
          <p className="text-[#5C5F64] font-light text-[1.6em] pb-[4px]">
            &times;
          </p>
        </Button>
        <div className="bg-[#E1EEFE] h-[197px] rounded-lg"></div>
        <div className="flex-1 w-full bg-[#F6F6F9] flex flex-col gap-2 text-center p-6">
          <div className="h-[71px] flex flex-col justify-between">
            <h4 className="text-2xl font-semibold">Congratulations!</h4>
            <p className="text-[#6E7682] text-[16px]">
              You reviewed the occlusion card, what will you like to do next?
            </p>
          </div>
          {/* Score */}
          <div className="flex justify-between w-[476px] mx-auto">
            <div className="flex gap-2 mx-auto mt-6 items-center">
              <div className="w-[12px] h-[12px] bg-[#4CAF50] rounded-sm" />
              <span className="text-[#585F68] text-xs font-normal">
                Got it right
              </span>
              <span className="text-[#585F68] ml-1 text-xs font-semibold">
                {right || 0}%
              </span>
            </div>
            <div className="flex gap-2 mx-auto mt-6 items-center">
              <div className="w-[12px] h-[12px] bg-[#FB8441] rounded-sm" />
              <span className="text-[#585F68] text-xs font-normal">
                Didn't remember
              </span>
              <span className="text-[#585F68] ml-1 text-xs font-semibold">
                {notRemembered || 0}%
              </span>
            </div>
            <div className="flex gap-2 mx-auto mt-6 items-center">
              <div className="w-[12px] h-[12px] bg-[#4CAF50] rounded-sm" />
              <span className="text-[#585F68] text-xs font-normal">
                Got it wrong
              </span>
              <span className="text-[#585F68] ml-1 text-xs font-semibold">
                {wrong || 0}%
              </span>
            </div>
          </div>
          {/* Button */}
          <div className="flex w-[628px] mx-auto justify-between mt-8">
            <Button className="w-[304px] h-[42px] bg-white text-[#5C5F64] text-sm font-medium">
              Restart Flashcard
            </Button>
            <Button className="w-[304px] h-[42px] bg-white text-[#5C5F64] text-sm font-medium">
              Edit Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OccResultsDialog;
